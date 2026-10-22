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
