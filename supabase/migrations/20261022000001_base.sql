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
