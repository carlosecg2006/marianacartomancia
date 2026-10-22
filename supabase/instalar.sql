-- GERADO a partir de supabase/migrations/*.sql e supabase/seed.sql. Não edite à mão.
-- Cole tudo no SQL Editor do Supabase e clique em Run. Rode UMA vez num projeto novo.

begin;

-- ===== supabase/migrations/20261022000001_base.sql =====

-- Base: papéis, funções auxiliares e privilégios padrão.
-- Regra da casa: RLS em todas as tabelas, e nada é executável por anon sem um grant explícito.

-- Funções novas não ganham EXECUTE para anon/authenticated. O EXECUTE de PUBLIC só sai com
-- revoke explícito (no fim da migration de RLS); o teste 01_rls confere a lista final.
alter default privileges in schema public revoke execute on functions from anon, authenticated;

-- Quem pode administrar o site. Linhas entram só pelo SQL Editor (dono do projeto).
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from anon;
revoke insert, update, delete, truncate, references, trigger on table public.admin_users from authenticated;

-- Admin = está em admin_users E entrou com o segundo fator (MFA, aal2).
-- security definer com search_path vazio: não depende de nada que o chamador controle.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select auth.jwt() ->> 'aal') = 'aal2', false)
     and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()));
$$;

grant execute on function public.is_admin() to anon, authenticated;

create function public.tocar_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Texto puro: sem < ou > (nada de HTML) e sem caracteres de controle (quebra de linha é permitida).
create function public.texto_puro(valor text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select valor !~ '[<>]' and valor !~ '[\x01-\x09\x0b\x0c\x0e-\x1f\x7f]';
$$;

grant execute on function public.texto_puro(text) to anon, authenticated;

-- ===== supabase/migrations/20261022000002_conteudo.sql =====

-- Conteúdo do site público: tudo o que a Mari edita no painel.
-- O formato de cada seção é validado por Zod no servidor (src/lib/validation/conteudo.ts);
-- aqui ficam as garantias que o banco consegue dar sozinho.

create type public.secao as enum (
  'abertura',
  'quem_sou',
  'citacoes',
  'baralho',
  'consulta',
  'como_funciona',
  'agendamento',
  'depoimentos',
  'faq',
  'contato_final'
);

-- Uma linha só (id = true).
create table public.site_settings (
  id boolean primary key default true check (id),
  nome text not null check (char_length(nome) between 1 and 60 and public.texto_puro(nome)),
  papel text not null check (char_length(papel) between 1 and 60 and public.texto_puro(papel)),
  regiao text not null check (char_length(regiao) between 1 and 60 and public.texto_puro(regiao)),
  -- Vazios até a Mari preencher; o site esconde o que estiver vazio.
  whatsapp text not null default '' check (whatsapp ~ '^(\d{12,13})?$'),
  instagram text not null default '' check (instagram ~ '^[a-z0-9._]{0,30}$'),
  instagram_ativo boolean not null default false,
  theme_preset text not null default 'padrao' check (theme_preset ~ '^[a-z0-9-]{1,32}$'),
  updated_at timestamptz not null default now()
);

create table public.sections (
  key public.secao primary key,
  visible boolean not null default true,
  position smallint not null default 0,
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  updated_at timestamptz not null default now(),
  -- A abertura tem o h1 e o contato final é o rodapé: as duas nunca somem.
  constraint sections_fixas_visiveis check (visible or key not in ('abertura', 'contato_final'))
);

create table public.quotes (
  id bigint generated always as identity primary key,
  texto text not null check (char_length(texto) between 1 and 240 and public.texto_puro(texto)),
  autoria text not null check (char_length(autoria) between 1 and 80 and public.texto_puro(autoria)),
  fonte_url text check (fonte_url ~ '^https://[^\s<>"]{1,500}$'),
  position integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Depoimento só vai ao ar com a autorização de quem escreveu.
create table public.testimonials (
  id bigint generated always as identity primary key,
  nome text not null check (char_length(nome) between 1 and 60 and public.texto_puro(nome)),
  texto text not null check (char_length(texto) between 1 and 1200 and public.texto_puro(texto)),
  data_depoimento date,
  consent_confirmed boolean not null default false,
  position integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint testimonials_publica_com_consentimento check (not published or consent_confirmed)
);

create table public.faq_items (
  id bigint generated always as identity primary key,
  pergunta text not null check (char_length(pergunta) between 1 and 140 and public.texto_puro(pergunta)),
  resposta text not null check (char_length(resposta) between 1 and 800 and public.texto_puro(resposta)),
  position integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Imagens enviadas pelo painel (F6). Alt e crédito são obrigatórios.
create table public.media (
  id uuid primary key default gen_random_uuid(),
  caminho text not null unique check (caminho ~ '^[a-z0-9][a-z0-9/_.-]{0,200}$'),
  alt text not null check (char_length(alt) <= 300 and public.texto_puro(alt)),
  credito text not null check (char_length(credito) between 1 and 300 and public.texto_puro(credito)),
  licenca text not null check (char_length(licenca) between 1 and 120 and public.texto_puro(licenca)),
  origem_url text check (origem_url ~ '^https://[^\s<>"]{1,500}$'),
  largura integer check (largura > 0),
  altura integer check (altura > 0),
  created_at timestamptz not null default now()
);

create index quotes_ordem on public.quotes (position, id);
create index testimonials_ordem on public.testimonials (position, id);
create index faq_items_ordem on public.faq_items (position, id);

create trigger site_settings_updated before update on public.site_settings
  for each row execute function public.tocar_updated_at();
create trigger sections_updated before update on public.sections
  for each row execute function public.tocar_updated_at();
create trigger quotes_updated before update on public.quotes
  for each row execute function public.tocar_updated_at();
create trigger testimonials_updated before update on public.testimonials
  for each row execute function public.tocar_updated_at();
create trigger faq_items_updated before update on public.faq_items
  for each row execute function public.tocar_updated_at();

-- Visitante só lê. Escrita depende de is_admin() nas políticas (migration de RLS).
revoke insert, update, delete, truncate, references, trigger
  on table public.site_settings, public.sections, public.quotes, public.testimonials, public.faq_items, public.media
  from anon;

-- ===== supabase/migrations/20261022000003_agenda.sql =====

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

-- ===== supabase/migrations/20261022000004_rls.sql =====

-- RLS ligado em TODAS as tabelas. Visitante (anon) lê só o que está publicado;
-- escrever exige is_admin() (admin_users + MFA). Pedidos de horário não têm política para anon.

alter table public.site_settings enable row level security;
alter table public.sections enable row level security;
alter table public.quotes enable row level security;
alter table public.testimonials enable row level security;
alter table public.faq_items enable row level security;
alter table public.media enable row level security;
alter table public.private_settings enable row level security;
alter table public.availability_rules enable row level security;
alter table public.availability_blocks enable row level security;
alter table public.bookings enable row level security;
-- admin_users já nasceu com RLS (migration base).

-- admin_users: cada pessoa vê a própria linha; a admin vê todas. Sem escrita pelo app.
create policy admin_users_leitura on public.admin_users
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

-- site_settings: leitura pública, edição só da admin (a linha é única: sem insert/delete).
create policy site_settings_leitura on public.site_settings
  for select to anon, authenticated using (true);
create policy site_settings_edicao on public.site_settings
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- sections: o conjunto é fixo; a admin edita e liga/desliga.
create policy sections_leitura on public.sections
  for select to anon, authenticated
  using (visible or (select public.is_admin()));
create policy sections_edicao on public.sections
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Listas editáveis: público vê o publicado; a admin faz tudo.
create policy quotes_leitura on public.quotes
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy quotes_admin on public.quotes
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy testimonials_leitura on public.testimonials
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy testimonials_admin on public.testimonials
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy faq_items_leitura on public.faq_items
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy faq_items_admin on public.faq_items
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy media_leitura on public.media
  for select to anon, authenticated using (true);
create policy media_admin on public.media
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Agenda e configurações privadas: só a admin. O público usa as RPCs.
create policy private_settings_admin on public.private_settings
  for select to authenticated using ((select public.is_admin()));
create policy private_settings_edicao on public.private_settings
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy availability_rules_admin on public.availability_rules
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy availability_blocks_admin on public.availability_blocks
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy bookings_admin on public.bookings
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Funções: ninguém executa nada por padrão (o Postgres dá EXECUTE a PUBLIC em toda função nova).
-- Liberadas só as RPCs do site e as funções que as políticas e constraints usam.
-- Toda migration que criar função precisa repetir este bloco; o teste 01_rls falha se esquecer.
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function
  public.is_admin(),
  public.texto_puro(text),
  public.get_available_slots(timestamptz, timestamptz),
  public.request_booking(timestamptz, text, text, text, boolean, text)
  to anon, authenticated;

-- ===== supabase/migrations/20261022000005_storage.sql =====

-- Imagens do painel (F6): bucket PRIVADO. O site serve as imagens pelo próprio servidor
-- (/_next/image), então nenhum link direto do Storage fica exposto ao visitante.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', false, 5242880, array['image/webp', 'image/avif', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy site_media_leitura_admin on storage.objects
  for select to authenticated
  using (bucket_id = 'site-media' and (select public.is_admin()));

create policy site_media_envio_admin on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'site-media'
    and (select public.is_admin())
    and lower(name) ~ '^[a-z0-9][a-z0-9/_.-]{0,200}\.(webp|avif|jpe?g|png)$'
  );

create policy site_media_edicao_admin on storage.objects
  for update to authenticated
  using (bucket_id = 'site-media' and (select public.is_admin()))
  with check (bucket_id = 'site-media' and (select public.is_admin()));

create policy site_media_remocao_admin on storage.objects
  for delete to authenticated
  using (bucket_id = 'site-media' and (select public.is_admin()));

-- ===== supabase/seed.sql =====

-- GERADO por src/lib/conteudo/seed.ts a partir de src/content/conteudo-inicial.ts.
-- Não edite à mão: rode `UPDATE_SEED=1 npx vitest run seed`.

insert into public.site_settings (nome, papel, regiao, whatsapp, instagram, instagram_ativo)
values
  ('Mariana Dayrell', 'Taróloga', 'Minas Gerais, Brasil', '', 'maarianadayrell', false)
on conflict (id) do nothing;

insert into public.sections (key, position, content)
select v.key::public.secao, v.position, v.content::jsonb
from (values
  ('abertura', 0, '{"frase":"As cartas falam baixinho. Eu te ajudo a escutar.","apoio":"Tiragens de tarô online com acolhimento e respiração do Kundalini Yoga.","acao":"Quero minha tiragem","fatos":["Tarô e acolhimento","100% online","Minas Gerais"]}'),
  ('quem_sou', 1, '{"titulo":"Quem sou","paragrafos":["Eu sou a Mari, Mariana Dayrell, mineira, e o tarô é o meu jeito de conversar com o que a gente sente, mas ainda não conseguiu dizer.","Leio as cartas com calma e com respeito. Para mim, uma tiragem não é sentença: é um espelho, um convite para olhar com mais carinho para o próprio caminho.","Também estudo e pratico Kundalini Yoga com a minha professora, Prem Ras Kaur. Foi no yoga que eu aprendi que a respiração muda tudo: acalma o corpo, abre espaço e deixa a intuição chegar. Por isso, nas minhas tiragens, as duas coisas andam juntas."],"historia":"","assinatura":"Mariana Dayrell"}'),
  ('citacoes', 2, '{"titulo":"Palavras que me acompanham"}'),
  ('baralho', 3, '{"titulo":"O Lendário Tarot das Bruxas","paragrafos":["São 78 cartas, 22 Arcanos Maiores e 56 Arcanos Menores, cheias de natureza, ervas, luas e mulheres sábias. Gosto desse baralho porque ele fala a língua das bruxas antigas: a do ciclo, da terra e da intuição.","Nele, a Louca caminha com o seu gato preto, a Força abraça um leão, e o Eremita ilumina a montanha com uma lanterna. Cada carta é uma história, e cada história pode ser a sua."],"cartas":[{"numeral":"I","nome":"O Mago"},{"numeral":"II","nome":"A Sacerdotisa"},{"numeral":"III","nome":"A Imperatriz"},{"numeral":"VIII","nome":"A Força"},{"numeral":"IX","nome":"O Eremita"},{"numeral":"XII","nome":"A Enforcada"},{"numeral":"XXII","nome":"A Louca"}]}'),
  ('consulta', 4, '{"titulo":"Uma tiragem que acolhe","paragrafos":["Você me conta o que está pedindo atenção na sua vida. Pode ser uma pergunta, uma dúvida ou só um sentimento que não quer calar.","Eu preparo o espaço, respiro, embaralho e tiro as cartas para você. No começo do áudio, eu te guio numa respiração curta do Kundalini Yoga, para você receber a leitura com o corpo calmo e o coração aberto."],"fatos":[{"valor":"10 a 15 min","explicacao":"de áudio com a leitura, no meu tempo e com cuidado"},{"valor":"A foto","explicacao":"das cartas que saíram, para você guardar e voltar a elas"},{"valor":"Respiração","explicacao":"guiada do Kundalini Yoga no começo do áudio"},{"valor":"100% online","explicacao":"pelo WhatsApp, de onde você estiver"}]}'),
  ('como_funciona', 5, '{"titulo":"Como funciona","passos":[{"titulo":"Você escolhe um horário","texto":"Veja na agenda os horários livres e reserve o seu."},{"titulo":"A gente conversa","texto":"Seu pedido chega para mim no WhatsApp, e a gente combina os detalhes e o pagamento."},{"titulo":"Eu tiro as suas cartas","texto":"No dia marcado, preparo o espaço e faço a sua tiragem com calma."},{"titulo":"Você recebe o áudio","texto":"O áudio e a foto chegam para você ouvir num lugar tranquilo, sem pressa."}]}'),
  ('agendamento', 6, '{"titulo":"Reserve o seu horário","texto":"Seu horário fica guardado por 2 horas enquanto a gente confirma pelo WhatsApp.","campos":{"nome":"Seu nome","whatsapp":"Seu WhatsApp (com DDD)","intencao":"O que você quer olhar nas cartas? (opcional)"},"consentimento":"Autorizo o uso do meu nome e WhatsApp para a Mari entrar em contato sobre esta tiragem, conforme a Política de Privacidade.","botao":"Reservar e falar com a Mari","aviso":"A agenda abre em breve."}'),
  ('depoimentos', 7, '{"titulo":"Quem já tirou as cartas comigo"}'),
  ('faq', 8, '{"titulo":"Perguntas frequentes"}'),
  ('contato_final', 9, '{"titulo":"Vamos conversar?","texto":"Me chama para tirar dúvidas, combinar a sua tiragem ou só dizer oi."}')
) as v (key, position, content)
on conflict (key) do nothing;

-- As listas só entram num banco vazio.
insert into public.quotes (texto, autoria, position)
select v.texto, v.autoria, v.position
from (values
  ('Que a sua autonomia seja sempre um ritual: silencioso, constante e irreversível.', 'Sara Koimbra', 0)
) as v (texto, autoria, position)
where not exists (select 1 from public.quotes);

insert into public.faq_items (pergunta, resposta, position)
select v.pergunta, v.resposta, v.position
from (values
  ('Preciso acreditar em tarô para fazer uma tiragem?', 'Não. Basta estar aberta ou aberto para receber o que as cartas trazem. Muita gente chega curiosa e sai com um olhar novo sobre a própria situação.', 0),
  ('Como funciona a tiragem online?', 'Você reserva um horário e me chama no WhatsApp. No dia combinado, eu faço a sua tiragem e te mando um áudio de 10 a 15 minutos com a leitura e a foto das cartas.', 1),
  ('O que eu recebo?', 'Um áudio de 10 a 15 minutos com a leitura completa e a foto das cartas que saíram para você.', 2),
  ('Como entra a respiração do Kundalini Yoga? Preciso saber yoga?', 'Não precisa saber nada. No começo do áudio, eu te guio numa respiração simples, que qualquer pessoa consegue fazer, para você ouvir a leitura com mais calma.', 3),
  ('Preciso preparar alguma coisa antes?', 'Só pensar no que você quer olhar. Na hora de ouvir o áudio, procure um lugar tranquilo, sem pressa.', 4),
  ('Como agendo e como pago?', 'Pela agenda aqui do site você reserva o horário, e pelo WhatsApp a gente combina o pagamento. O horário fica guardado por 2 horas até a confirmação.', 5),
  ('Posso remarcar ou cancelar?', 'Pode. É só me chamar no WhatsApp que eu ajusto para você.', 6),
  ('O tarô prevê o futuro?', 'O tarô mostra caminhos, tendências e o que está em movimento agora. O futuro não está escrito em pedra: as suas escolhas fazem parte dele.', 7),
  ('O que eu conto fica entre nós?', 'Sim. O que você me conta é usado só para a sua tiragem e não é compartilhado com ninguém.', 8),
  ('A tiragem substitui terapia ou acompanhamento médico?', 'Não. O tarô é uma prática de autoconhecimento e acolhimento. Se você está passando por um momento difícil, procure também um profissional de saúde.', 9)
) as v (pergunta, resposta, position)
where not exists (select 1 from public.faq_items);

commit;
