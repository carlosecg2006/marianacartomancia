-- Agenda: horários livres, pedido de horário, horário duplo, reserva de 2 h e retenção de 90 dias.
begin;
create extension if not exists pgtap with schema extensions;
select plan(24);

-- Todos os dias, das 8h às 20h (horário de Brasília), consultas de 60 min.
insert into public.availability_rules (dia_semana, inicio, fim)
select d, '08:00', '20:00' from generate_series(0, 6) d;

create temp table livres on commit drop as
select * from public.get_available_slots(now(), now() + interval '3 days');
create temp table pedido (id uuid, inicio timestamptz, reserva_ate timestamptz) on commit drop;
grant select on livres to anon;
grant select, insert on pedido to anon;

select ok((select count(*) from livres) > 10, 'há horários livres');
select is(
  (select count(*)::int from livres where inicio < now() + interval '2 hours'),
  0,
  'nada antes da antecedência mínima'
);
select is(
  (select count(*)::int from livres
    where (inicio at time zone 'America/Sao_Paulo')::time < '08:00'
       or (fim at time zone 'America/Sao_Paulo')::time > '20:00'),
  0,
  'só dentro da janela do dia, no fuso da Mari'
);
select is((select count(*)::int from livres where fim - inicio <> interval '60 minutes'), 0, 'cada horário dura 60 min');
select is(
  (select count(*)::int from public.get_available_slots(now(), now() + interval '200 days')
    where inicio > now() + interval '31 days'),
  0,
  'nada além da janela de 30 dias'
);

-- ===== Pedido como visitante =====
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);

insert into pedido
select * from public.request_booking(
  (select min(inicio) from livres), '  Maria   da Silva ', '(31) 99999-0000', 'Amor e trabalho', true, 'v1'
);

select is((select count(*)::int from pedido), 1, 'visitante faz um pedido');
select ok(
  (select reserva_ate between now() + interval '119 minutes' and now() + interval '121 minutes' from pedido),
  'o horário fica reservado por 2 h'
);
select ok(
  not exists (
    select 1 from public.get_available_slots(now(), now() + interval '3 days') s
     where s.inicio = (select min(inicio) from livres)
  ),
  'o horário reservado some da agenda'
);
select throws_ok(
  $$select * from public.request_booking((select min(inicio) from livres), 'Outra Pessoa', '31988887777', null, true, 'v1')$$,
  'P0001', 'horario_indisponivel', 'ninguém reserva o mesmo horário'
);
select throws_ok(
  $$select * from public.request_booking((select max(inicio) from livres), 'Maria', '5531999990000', null, true, 'v1')$$,
  'P0001', 'limite_de_pedidos', 'um pedido aberto por WhatsApp'
);
select throws_ok(
  $$select * from public.request_booking((select max(inicio) from livres), 'Ana', '31977776666', null, false, 'v1')$$,
  'P0001', 'dados_invalidos', 'sem consentimento não há pedido'
);
select throws_ok(
  $$select * from public.request_booking((select max(inicio) from livres), '<script>', '31977776666', null, true, 'v1')$$,
  'P0001', 'dados_invalidos', 'nome com HTML é recusado'
);
select throws_ok(
  $$select * from public.request_booking((select max(inicio) from livres), 'Ana', '123', null, true, 'v1')$$,
  'P0001', 'dados_invalidos', 'WhatsApp inválido é recusado'
);
select throws_ok(
  $$select * from public.request_booking((select max(inicio) from livres), 'Ana', '31977776666', repeat('a', 501), true, 'v1')$$,
  'P0001', 'dados_invalidos', 'intenção longa demais é recusada'
);
select throws_ok(
  $$select * from public.request_booking(now() + interval '1 day 7 minutes', 'Ana', '31977776666', null, true, 'v1')$$,
  'P0001', 'horario_indisponivel', 'horário fora da grade é recusado'
);
select throws_ok(
  $$select * from public.request_booking(now() - interval '1 day', 'Ana', '31977776666', null, true, 'v1')$$,
  'P0001', 'horario_indisponivel', 'horário no passado é recusado'
);
reset role;

-- O que foi gravado: nome limpo, WhatsApp com 55, só os campos permitidos.
select is(
  (select client_name || '|' || client_whatsapp || '|' || status from public.bookings where id = (select id from pedido)),
  'Maria da Silva|5531999990000|pending',
  'nome normalizado, WhatsApp com DDI, pedido pendente'
);

-- Garantia final no banco: nem um insert direto passa por cima de outro pedido ativo.
select throws_ok(
  $$insert into public.bookings (slot, client_name, client_whatsapp, consent_at, consent_version, status)
    select tstzrange(inicio + interval '30 minutes', inicio + interval '90 minutes'), 'X Y', '5531900000000', now(), 'v1', 'confirmed'
      from livres order by inicio limit 1$$,
  '23P01', null, 'sobreposição barrada pela constraint'
);

-- ===== Reserva de 2 h vencida =====
update public.bookings set hold_expires_at = now() - interval '1 minute' where id = (select id from pedido);
select ok(
  exists (
    select 1 from public.get_available_slots(now(), now() + interval '3 days') s
     where s.inicio = (select min(inicio) from livres)
  ),
  'pendente vencido volta a ficar livre antes mesmo do job'
);
select is(public.expirar_reservas(), 1, 'o job expira o pedido vencido');
select is((select status::text from public.bookings where id = (select id from pedido)), 'expired', 'pedido vencido vira expired');

-- ===== Retenção (LGPD): 90 dias depois do horário =====
insert into public.bookings (slot, client_name, client_whatsapp, intent, consent_at, consent_version, status, admin_notes)
values
  (tstzrange(now() - interval '100 days', now() - interval '100 days' + interval '1 hour'), 'Antiga', '5531911112222', 'x', now() - interval '101 days', 'v1', 'done', 'nota'),
  (tstzrange(now() - interval '30 days', now() - interval '30 days' + interval '1 hour'), 'Recente', '5531933334444', 'y', now() - interval '31 days', 'v1', 'done', null);

select is(public.aplicar_retencao(), 1, 'só o pedido com mais de 90 dias é anonimizado');
select is(
  (select row(client_name, client_whatsapp, intent, admin_notes)::text from public.bookings where consent_at < now() - interval '100 days'),
  '(,,,)',
  'nome, WhatsApp, intenção e notas apagados'
);

-- Jobs agendados no pg_cron.
select is(
  (select count(*)::int from cron.job where jobname in ('expirar-reservas', 'retencao-agendamentos')),
  2,
  'jobs de expiração e retenção agendados'
);

select * from finish();
rollback;
