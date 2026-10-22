-- Testar como um estranho (checklist 5, 17): visitante, usuário logado sem papel,
-- admin sem MFA e admin com MFA.
begin;
create extension if not exists pgtap with schema extensions;
select plan(33);

-- Pessoas de teste.
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'admin@teste.local'),
  ('00000000-0000-0000-0000-0000000000b2', 'estranho@teste.local');
insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-0000000000a1');

insert into public.bookings (slot, client_name, client_whatsapp, consent_at, consent_version, status)
values (tstzrange(now() + interval '3 days', now() + interval '3 days 1 hour'), 'Cliente Teste', '5531999990000', now(), 'v1', 'confirmed');
insert into public.testimonials (nome, texto, consent_confirmed, published)
values ('Rascunho', 'Ainda não publicado', true, false);

-- RLS em todas as tabelas do schema public.
select is(
  (select count(*)::int from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity),
  0,
  'RLS ligado em todas as tabelas'
);

-- O visitante executa só as RPCs públicas (e as funções usadas nas políticas).
select is(
  (select array_agg(p.proname::text order by p.proname) from pg_proc p
    where p.pronamespace = 'public'::regnamespace and has_function_privilege('anon', p.oid, 'execute')),
  array['get_available_slots', 'is_admin', 'request_booking', 'texto_puro'],
  'anon só executa as funções liberadas'
);

-- ===== Visitante (anon) =====
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);

select is((select count(*)::int from public.sections), 10, 'anon lê as seções visíveis');
select is((select count(*)::int from public.site_settings), 1, 'anon lê as configurações públicas');
select is((select count(*)::int from public.faq_items), 10, 'anon lê as perguntas publicadas');
select is((select count(*)::int from public.testimonials), 0, 'anon não vê depoimento não publicado');
select throws_ok('select * from public.bookings', '42501', null, 'anon não lê pedidos de horário');
select throws_ok('select * from public.private_settings', '42501', null, 'anon não lê configurações privadas');
select throws_ok('select * from public.availability_rules', '42501', null, 'anon não lê regras da agenda');
select throws_ok('select * from public.admin_users', '42501', null, 'anon não lê admins');
select throws_ok($$insert into public.quotes (texto, autoria) values ('x', 'y')$$, '42501', null, 'anon não cria citação');
select throws_ok($$update public.sections set visible = false$$, '42501', null, 'anon não edita seção');
select throws_ok($$update public.site_settings set nome = 'Invasor'$$, '42501', null, 'anon não edita configurações');
select throws_ok('select public.expirar_reservas()', '42501', null, 'anon não roda o job de expiração');
select throws_ok('select public.aplicar_retencao()', '42501', null, 'anon não roda o job de retenção');
select throws_ok(
  $$insert into storage.objects (bucket_id, name) values ('site-media', 'x.webp')$$,
  '42501', null, 'anon não envia imagem'
);
select lives_ok('select * from public.get_available_slots(now(), now() + interval ''7 days'')', 'anon consulta horários livres');

-- ===== Logado sem papel =====
reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated","aal":"aal2"}', true);

select is(public.is_admin(), false, 'estranho não é admin');
select is((select count(*)::int from public.bookings), 0, 'estranho não vê pedidos');
select is((select count(*)::int from public.private_settings), 0, 'estranho não vê configurações privadas');
select is((select count(*)::int from public.admin_users), 0, 'estranho não vê a lista de admins');
select throws_ok($$insert into public.quotes (texto, autoria) values ('x', 'y')$$, '42501', null, 'estranho não cria citação');
select is_empty($$update public.site_settings set nome = 'Invasor' returning 1$$, 'estranho não edita configurações');
select is_empty($$delete from public.faq_items returning 1$$, 'estranho não apaga perguntas');
select throws_ok(
  $$insert into storage.objects (bucket_id, name) values ('site-media', 'x.webp')$$,
  '42501', null, 'estranho não envia imagem'
);

-- ===== Admin sem o segundo fator (aal1) =====
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated","aal":"aal1"}', true);

select is(public.is_admin(), false, 'admin sem MFA não tem poder de admin');
select is((select count(*)::int from public.bookings), 0, 'admin sem MFA não vê pedidos');

-- ===== Admin com MFA (aal2) =====
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated","aal":"aal2"}', true);

select is(public.is_admin(), true, 'admin com MFA é admin');
select is((select count(*)::int from public.bookings), 1, 'admin vê pedidos');
select is((select count(*)::int from public.testimonials), 1, 'admin vê rascunhos');
select lives_ok($$insert into public.quotes (texto, autoria) values ('Nova frase', 'Mari')$$, 'admin cria citação');
select lives_ok(
  $$insert into storage.objects (bucket_id, name) values ('site-media', 'gravuras/lua.webp')$$,
  'admin envia imagem'
);
select throws_ok(
  $$insert into storage.objects (bucket_id, name) values ('site-media', 'script.svg')$$,
  '42501', null, 'nem a admin envia tipo fora da lista'
);

reset role;
select * from finish();
rollback;
