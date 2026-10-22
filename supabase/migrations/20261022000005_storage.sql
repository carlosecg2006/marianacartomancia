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
