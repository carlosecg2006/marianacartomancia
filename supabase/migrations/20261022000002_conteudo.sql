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
