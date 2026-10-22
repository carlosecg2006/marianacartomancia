-- Agenda: disponibilidade, pedidos de horário, reserva de 2 h e retenção (LGPD).
-- O visitante nunca lê a tabela de pedidos: só usa as duas RPCs no fim do arquivo.

-- Uma linha só (id = true). Tudo editável no painel.
create table public.private_settings (
  id boolean primary key default true check (id),
  duracao_minutos smallint not null default 60 check (duracao_minutos between 15 and 240),
  reserva_horas smallint not null default 2 check (reserva_horas between 1 and 48),
  antecedencia_horas smallint not null default 2 check (antecedencia_horas between 0 and 168),
  janela_dias smallint not null default 30 check (janela_dias between 1 and 90),
  fuso text not null default 'America/Sao_Paulo' check (fuso ~ '^[A-Za-z_]+(/[A-Za-z_]+){0,2}$'),
  retencao_dias smallint not null default 90 check (retencao_dias between 1 and 365),
  updated_at timestamptz not null default now()
);

insert into public.private_settings default values;

-- Janelas semanais no fuso da Mari (0 = domingo).
create table public.availability_rules (
  id bigint generated always as identity primary key,
  dia_semana smallint not null check (dia_semana between 0 and 6),
  inicio time not null,
  fim time not null,
  constraint availability_rules_intervalo check (fim > inicio)
);

-- Férias, compromissos, feriados.
create table public.availability_blocks (
  id bigint generated always as identity primary key,
  periodo tstzrange not null check (not isempty(periodo) and lower(periodo) is not null and upper(periodo) is not null),
  motivo text check (char_length(motivo) <= 120 and public.texto_puro(motivo)),
  created_at timestamptz not null default now()
);

create type public.booking_status as enum ('pending', 'confirmed', 'done', 'cancelled', 'expired');

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  slot tstzrange not null check (not isempty(slot) and lower(slot) is not null and upper(slot) is not null),
  -- Dados pessoais: só nome, WhatsApp e intenção (LGPD). Somem na retenção.
  client_name text check (char_length(client_name) between 2 and 80 and public.texto_puro(client_name)),
  client_whatsapp text check (client_whatsapp ~ '^\d{12,13}$'),
  intent text check (char_length(intent) <= 500 and public.texto_puro(intent)),
  consent_at timestamptz not null,
  consent_version text not null check (consent_version ~ '^[a-z0-9.-]{1,20}$'),
  status public.booking_status not null default 'pending',
  hold_expires_at timestamptz,
  admin_notes text check (char_length(admin_notes) <= 2000),
  confirmation_sent_at timestamptz,
  reminder_sent_at timestamptz,
  gcal_event_id text,
  anonymized_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_dados_ate_anonimizar check (
    anonymized_at is not null or (client_name is not null and client_whatsapp is not null)
  ),
  constraint bookings_pendente_tem_prazo check (status <> 'pending' or hold_expires_at is not null),
  -- Nunca dois pedidos ativos no mesmo horário, nem com duas abas abertas ao mesmo tempo.
  constraint bookings_sem_sobreposicao exclude using gist (slot with &&)
    where (status in ('pending', 'confirmed'))
);

create index bookings_status on public.bookings (status, hold_expires_at);
create index bookings_whatsapp on public.bookings (client_whatsapp) where status = 'pending';

create trigger private_settings_updated before update on public.private_settings
  for each row execute function public.tocar_updated_at();
create trigger bookings_updated before update on public.bookings
  for each row execute function public.tocar_updated_at();

revoke all on table public.private_settings, public.availability_rules, public.availability_blocks, public.bookings
  from anon;

-- Reserva vencida (2 h sem confirmação) libera o horário.
create function public.expirar_reservas()
returns integer
language sql
security definer
set search_path = ''
as $$
  with vencidas as (
    update public.bookings
       set status = 'expired'
     where status = 'pending' and hold_expires_at <= now()
    returning 1
  )
  select count(*)::integer from vencidas;
$$;

-- Retenção: X dias depois do horário, o pedido perde nome, WhatsApp, intenção e notas.
create function public.aplicar_retencao()
returns integer
language sql
security definer
set search_path = ''
as $$
  with antigos as (
    update public.bookings b
       set client_name = null,
           client_whatsapp = null,
           intent = null,
           admin_notes = null,
           anonymized_at = now()
      from public.private_settings s
     where s.id
       and b.anonymized_at is null
       and b.status <> 'pending'
       and upper(b.slot) < now() - make_interval(days => s.retencao_dias)
    returning 1
  )
  select count(*)::integer from antigos;
$$;

-- Horários livres entre p_de e p_ate. Devolve só horários, nenhum dado pessoal.
-- Um pendente vencido já conta como livre, mesmo antes do job passar.
create function public.get_available_slots(p_de timestamptz, p_ate timestamptz)
returns table (inicio timestamptz, fim timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  cfg public.private_settings;
  duracao interval;
begin
  select * into cfg from public.private_settings s where s.id;
  if not found or p_de is null or p_ate is null then
    return;
  end if;

  duracao := make_interval(mins => cfg.duracao_minutos);
  p_de := greatest(p_de, now() + make_interval(hours => cfg.antecedencia_horas));
  p_ate := least(p_ate, now() + make_interval(days => cfg.janela_dias));
  if p_ate <= p_de then
    return;
  end if;

  return query
  with dias as (
    select d::date as dia
      from generate_series(
        (p_de at time zone cfg.fuso)::date,
        (p_ate at time zone cfg.fuso)::date,
        interval '1 day'
      ) as d
  ),
  candidatos as (
    select (local_ini at time zone cfg.fuso) as ini
      from dias
      join public.availability_rules r on r.dia_semana = extract(dow from dias.dia)
     cross join lateral generate_series(
        dias.dia + r.inicio,
        dias.dia + r.fim - duracao,
        duracao
      ) as local_ini
  )
  select distinct c.ini, c.ini + duracao
    from candidatos c
   where c.ini >= p_de
     and c.ini + duracao <= p_ate
     and not exists (
       select 1 from public.availability_blocks bl
        where bl.periodo && tstzrange(c.ini, c.ini + duracao)
     )
     and not exists (
       select 1 from public.bookings bk
        where bk.slot && tstzrange(c.ini, c.ini + duracao)
          and (bk.status = 'confirmed' or (bk.status = 'pending' and bk.hold_expires_at > now()))
     )
   order by 1;
end;
$$;

-- Pedido de horário vindo do site. Valida tudo de novo aqui (o servidor do site já validou com Zod).
-- Erros têm códigos curtos; o site mostra uma mensagem genérica.
create function public.request_booking(
  p_inicio timestamptz,
  p_nome text,
  p_whatsapp text,
  p_intencao text,
  p_consentimento boolean,
  p_versao_consentimento text
)
returns table (id uuid, inicio timestamptz, reserva_ate timestamptz)
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  cfg public.private_settings;
  duracao interval;
  nome text := btrim(regexp_replace(coalesce(p_nome, ''), '\s+', ' ', 'g'));
  whatsapp text := regexp_replace(coalesce(p_whatsapp, ''), '\D', '', 'g');
  intencao text := nullif(btrim(replace(coalesce(p_intencao, ''), E'\r\n', E'\n')), '');
  novo public.bookings;
begin
  select * into cfg from public.private_settings s where s.id;
  if not found then
    raise exception 'agenda_fechada';
  end if;
  duracao := make_interval(mins => cfg.duracao_minutos);

  -- Número brasileiro sem o 55 (DDD + número) ganha o código do país.
  if char_length(whatsapp) in (10, 11) then
    whatsapp := '55' || whatsapp;
  end if;

  if p_consentimento is not true
     or p_inicio is null
     or char_length(nome) not between 2 and 80 or not public.texto_puro(nome)
     or whatsapp !~ '^\d{12,13}$'
     or (intencao is not null and (char_length(intencao) > 500 or not public.texto_puro(intencao)))
     or coalesce(p_versao_consentimento, '') !~ '^[a-z0-9.-]{1,20}$' then
    raise exception 'dados_invalidos';
  end if;

  perform public.expirar_reservas();

  if not exists (
    select 1 from public.get_available_slots(p_inicio, p_inicio + duracao) s where s.inicio = p_inicio
  ) then
    raise exception 'horario_indisponivel';
  end if;

  -- Um pedido aberto por WhatsApp, e um teto geral contra robôs.
  if exists (
    select 1 from public.bookings b
     where b.client_whatsapp = whatsapp and b.status = 'pending' and b.hold_expires_at > now()
  ) or (
    select count(*) from public.bookings b where b.created_at > now() - interval '1 hour'
  ) >= 30 then
    raise exception 'limite_de_pedidos';
  end if;

  begin
    insert into public.bookings (slot, client_name, client_whatsapp, intent, consent_at, consent_version, hold_expires_at)
    values (
      tstzrange(p_inicio, p_inicio + duracao),
      nome,
      whatsapp,
      intencao,
      now(),
      p_versao_consentimento,
      now() + make_interval(hours => cfg.reserva_horas)
    )
    returning * into novo;
  exception when exclusion_violation then
    raise exception 'horario_indisponivel';
  end;

  return query select novo.id, lower(novo.slot), novo.hold_expires_at;
end;
$$;

grant execute on function public.get_available_slots(timestamptz, timestamptz) to anon, authenticated;
grant execute on function public.request_booking(timestamptz, text, text, text, boolean, text) to anon, authenticated;

-- Jobs (pg_cron). schedule() com o mesmo nome atualiza o job em vez de duplicar.
create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule('expirar-reservas', '*/5 * * * *', 'select public.expirar_reservas()');
select cron.schedule('retencao-agendamentos', '17 4 * * *', 'select public.aplicar_retencao()');
