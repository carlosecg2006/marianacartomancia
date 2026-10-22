# Plano do site — Mariana Dayrell

## Contexto

- O site é um presente surpresa para a Mari, taróloga. A base é o `CLAUDE.md` (regras) e o `PRODUTO.md` (produto), com os textos iniciais em `docs/conteudo-inicial.md`.
- O repositório ainda não tem código: só documentos, skills e as referências em `docs/referencias/`.
- O público vê uma página única que vai do sol à lua com o scroll. A Mari tem um painel com login para editar tudo e gerenciar a agenda.
- O pagamento é combinado no WhatsApp. O Stripe fica só documentado, sem ser construído.
- Objetivo: construir em fases pequenas, cada uma testável e mostrada antes da próxima.

---

## 1. Arquitetura de pastas e rotas

```
src/
  app/
    (site)/
      layout.tsx            # fontes, Lenis, banner de cookies, JSON-LD
      page.tsx              # one-page; Server Component; ISR + revalidação por tag
      privacidade/page.tsx
      termos/page.tsx
    login/page.tsx          # login da administradora (e-mail + senha + MFA)
    admin/                  # protegido: middleware + checagem de papel no layout (servidor)
      layout.tsx
      page.tsx              # "Hoje": consultas do dia + botões de WhatsApp
      agenda/               # pedidos, disponibilidade, bloqueios, remarcar/cancelar
      conteudo/[secao]/     # editor de cada seção
      citacoes/  depoimentos/  faq/  midia/
      configuracoes/        # contatos, valor, SEO, temas prontos, mensagens prontas, Google Agenda
    api/
      slots/route.ts        # GET de horários livres (sem dados pessoais)
      cron/resumo-diario/route.ts   # Vercel Cron → e-mail do dia para a Mari
      google/callback/route.ts      # OAuth do Google Agenda (fase opcional)
    sitemap.ts  robots.ts  llms.txt/route.ts  opengraph-image.tsx
  components/
    sections/   # Hero, QuemSou, Citacoes, Baralho, Consulta, ComoFunciona, Agendamento, Depoimentos, Faq, Contato, Rodape
    ornaments/  # SVGs próprios: moldura déco, hera espelhada, sol, lua, selo numerado, pentagrama de galhos
    ui/         # Botao, FaixaTitulo, MolduraCarta, Divisor, CalendarioHorarios, BannerCookies
    admin/      # formulários e tabelas do painel
  animations/   # LenisProvider, useScrollScene, cenas por seção (gsap.matchMedia)
  lib/
    supabase/   # server.ts, browser.ts, admin.ts (service role; import 'server-only')
    validation/ # schemas Zod (conteúdo de cada seção, pedido de agendamento, configurações)
    booking/    # cálculo de horários, fuso, links do WhatsApp
    security/   # rate limit, sanitização, headers
    email/      # envio (Resend) + templates
  styles/
    _tokens.scss  _bootstrap-config.scss  _themes.scss  main.scss  admin.scss
supabase/
  migrations/   seed.sql (gerado de docs/conteudo-inicial.md)   tests/ (pgTAP)
tests/
  e2e/  a11y/  visual/  security/
docs/
  creditos-imagens.md  referencias/  conteudo-inicial.md
```

**Renderização**
- A página pública é estática (ISR).
- Quando a Mari salva algo no painel, uma Server Action chama `revalidateTag`.
- Os horários livres são buscados no cliente via `/api/slots`, porque mudam o tempo todo.

**Segurança das rotas**
- O `proxy.ts` (nome do antigo `middleware.ts` no Next 16) renova a sessão (`@supabase/ssr`) e barra `/admin` sem login.
- Toda Server Action do painel chama `requireAdmin()` de novo, no servidor (itens 3, 4 e 7 do checklist).

---

## 2. Banco no Supabase

### Tabelas

| Tabela | Campos principais | Leitura pública |
|---|---|---|
| `admin_users` | `user_id → auth.users`, `created_at` | não |
| `site_settings` (1 linha) | nome, WhatsApp, Instagram + ligado, exibição do valor (fixo/sob consulta) + valor, SEO, `theme_preset`, `font_preset` | sim, por uma **view** só com as colunas públicas |
| `private_settings` (1 linha) | modelos das mensagens prontas, duração do horário, horas de reserva (2), fuso, Google Agenda ligado, e-mail de aviso | não |
| `sections` | `key` (enum das 11 seções), `visible`, `position`, `content jsonb` (validado por Zod por seção) | sim, onde `visible` |
| `quotes` | texto, autor, `source_url` (opcional), `position`, `published` | sim, onde `published` |
| `testimonials` | nome exibido, texto, data, `position`, `published`, `consent_confirmed` | sim, onde `published` |
| `faq_items` | pergunta, resposta, `position`, `published` | sim, onde `published` |
| `media` | caminho no Storage, `alt`, crédito, licença, URL de origem, largura/altura | sim |
| `availability_rules` | dia da semana, hora de início e de fim | não (só via RPC) |
| `availability_blocks` | intervalo bloqueado (`tstzrange`), motivo | não |
| `bookings` | `slot tstzrange`, `client_name`, `client_whatsapp`, `intent`, `consent_at`, `consent_version`, `status` (pending/confirmed/done/cancelled/expired), `hold_expires_at`, `admin_notes`, `reminder_sent_at`, `confirmation_sent_at`, `gcal_event_id` | **nunca** |
| `audit_log` | ação do painel, quem, quando | não |

### Relações e garantias
- **Sem agendamento duplo:** `bookings` tem uma *exclusion constraint* (`btree_gist`) sobre `slot`, válida quando `status in ('pending','confirmed')`.
- **Reserva de 2 horas:** um job `pg_cron` a cada 5 minutos muda `pending` com `hold_expires_at < now()` para `expired`. A RPC de horários também ignora pendentes vencidos, então nada depende do job estar em dia.
- **Retenção (LGPD):** um job diário anonimiza nome, WhatsApp e intenção X dias depois de `done` ou `cancelled`. O valor de X é decisão sua (seção 8).

### RLS (ativado em todas as tabelas)
- A função `is_admin()` é `security definer`, com `search_path` fixo, e checa `admin_users` a partir de `auth.uid()`.
- **Tabelas de conteúdo:**
  - `select` para `anon` só nas linhas publicadas ou visíveis;
  - `insert`, `update` e `delete` só para `is_admin()`.
- **Configurações privadas, regras, bloqueios e log:** todas as operações só para `is_admin()`.
- **`bookings`:**
  - nenhuma política para `anon`;
  - admin tem acesso total.
  - O público só entra por duas RPCs `security definer`:
    - `get_available_slots(from, to)` devolve só horários, sem dados pessoais;
    - `request_booking(slot_start, name, whatsapp, intent, consent)` valida de novo, insere como `pending` e devolve só o id e o horário.
- **Storage:**
  - bucket `site-media` **privado**: nenhum visitante acessa o arquivo original nem lista o bucket;
  - as imagens chegam ao visitante só pelo otimizador do Next (`/_next/image`, no domínio do site), que busca o original no servidor com URL assinada de curta duração;
  - escrita só para admin, por política;
  - aceita só `image/webp`, `image/avif`, `image/jpeg` e `image/png`, até 5 MB;
  - o upload é feito pelo servidor e a imagem é convertida para WebP/AVIF.
- **Testes:** pgTAP (`supabase test db`) prova que `anon` e um usuário logado sem papel não leem `bookings` nem escrevem em nada.

---

## 3. Autenticação e pagamento

### Autenticação (só a administradora)
- **Supabase Auth:** e-mail + senha, cadastro público **desligado**.
- A conta da Mari é criada por convite. **MFA TOTP obrigatório** no painel: `aal2` é exigido pelo `requireAdmin()`.
- **Fluxo:**
  1. `/login` chama uma Server Action, que aplica rate limit (5 tentativas a cada 15 minutos por IP e por e-mail) e faz `signInWithPassword`.
  2. Vem o desafio MFA e, depois dele, `/admin`.
  3. A sessão fica em cookies `httpOnly`, `secure` e `sameSite=lax`, via `@supabase/ssr`.
- **Erros:** a tela mostra só "e-mail ou senha incorretos". Os detalhes vão para o log.
- **Recuperação de senha:** pelo fluxo do Supabase, com redirect só para o domínio do site.

### Pagamento hoje (sem Stripe)
1. A visitante reserva um horário e o pedido fica `pending`.
2. O WhatsApp abre com a mensagem pronta e a Mari combina o Pix.
3. No painel, a Mari marca "confirmado".

O site nunca vê dado de pagamento.

### Stripe (documentado, não construído)
Fica em `docs/stripe-futuro.md`, para quando houver uma decisão nova. O fluxo seria:
1. Uma Server Action cria a Checkout Session com o preço vindo do servidor e o `booking_id` em `metadata`.
2. A visitante paga na página do Stripe.
3. O `/api/stripe/webhook` lê o corpo cru, verifica a assinatura (`stripe.webhooks.constructEvent` + `STRIPE_WEBHOOK_SECRET`) e trata eventos repetidos com uma tabela `stripe_events`.
4. Só então o pedido vira `confirmed`.

O pedido só é confirmado pelo webhook, nunca pelo redirect de sucesso.

---

## 4. Sistema de design

Os valores abaixo são o ponto de partida. A taste-skill escolhe a direção final na fase 1, e cada par de cores passa por verificação de contraste antes de entrar.

### Cores (tokens em `_tokens.scss`, expostos como CSS custom properties)

| Token | Solar | Lunar | Uso |
|---|---|---|---|
| `--bg` | pergaminho `#F3E9D2` | noite `#0D1322` | fundo da seção |
| `--surface` | bege `#E8D9B5` | azul-meia-noite `#18213A` | cartões, molduras |
| `--text` | tinta `#2A1D12` | luar `#EEE7D7` | texto (AA ≥ 4.5:1) |
| `--accent-gold` | `#8A6416` (texto) / `#C9A24A` (ornamento) | `#D8B463` | ornamentos, selos |
| `--accent-red` | terracota `#A3322A` | vermelho-vinho `#C94A40` | detalhes, CTA secundário |
| `--turquoise` | `#0F6E6B` (texto em claro) | `#4FD1C5` (texto em escuro) | **fio condutor**, links, foco, CTA |
| `--olive` | `#5B6A2C` | `#8E9C5A` | folhagem |

Cada seção tem `data-phase="solar|crepusculo|lunar"`, com tokens fixos. Assim o contraste de texto nunca depende de uma cor no meio da transição.

### Transição sol → lua
- Três camadas fixas de fundo (solar, crepúsculo, noite) trocam por `opacity`.
- O sol desce e a lua sobe só com `transform`.
- As trocas de fase acontecem em **interlúdios ornamentais sem texto corrido**, entre as seções. Isso garante o AA nos estados intermediários.

### Tipografia
Hospedada pelo `next/font`, sem chamada ao Google em tempo de execução (LGPD e desempenho).

| Papel | Proposta inicial | Por quê |
|---|---|---|
| Títulos | Cormorant Garamond | serifa de alto contraste: mística e séria |
| Rótulos em caixa alta | Marcellus SC | lembra as faixas com o nome das cartas |
| Texto | Literata | serifa de leitura, calorosa |

São 2 ou 3 presets de fonte e de cor no painel, todos pré-testados.

### Tokens do Bootstrap (`_bootstrap-config.scss`)
- **Cores e fontes:** `$primary` turquesa, `$secondary` dourado, `$body-bg` e `$body-color` por fase, `$font-family-base`, `$headings-font-family`.
- **Escala:** `$font-sizes` (escala fluida com `clamp`), `$spacer` com escala própria (base 8px).
- **Bordas e efeitos:** `$border-radius: 0` (déco, com formas em arco feitas por `mask`/`clip-path` nos componentes), `$enable-shadows: false`, `$enable-gradients: false`.
- **Foco:** `$focus-ring-color` turquesa com 3px de espessura e offset.
- **Componentes:** botões, formulários e accordion sobrescritos.
- **Módulos importados no site público:** functions, variables, maps, mixins, root, reboot, type, containers, grid, buttons, forms, accordion e o subconjunto da utilities API.
- **No painel (`admin.scss`):** os mesmos módulos mais nav, tables, modal, toasts e badges, num visual mais sóbrio.

### Componentes do site
- `MolduraCarta`: moldura com selo numerado e faixa, como nas cartas.
- `FaixaTitulo`: título em faixa de pergaminho.
- `Divisor`: hera espelhada com pentagrama.
- `BotaoSelo`: CTA.
- `CitacaoOrnada`, `DepoimentoCarta`, `CalendarioHorarios`, `FaqAccordion`, `BannerCookies`, `LinkWhatsApp`.

### Arte
- SVGs próprios, gravuras de domínio público tingidas na paleta e brilho Y2K em CSS (sem WebGL, por desempenho).
- Os créditos de cada imagem vão em `docs/creditos-imagens.md`.

---

## 5. Mapa de animações

Ferramentas: GSAP + ScrollTrigger + Lenis, com `gsap.matchMedia` separando desktop, celular e `prefers-reduced-motion`.

| Seção | Desktop | Celular | Reduced motion |
|---|---|---|---|
| Global | sol desce e lua sobe; camadas de céu trocam por opacity; fio turquesa cresce (`scaleY`) | igual, com menos camadas | céu fixo por seção, sem sol/lua móveis, sem Lenis |
| 1. Abertura | parallax em 3 camadas (sol, folhagem, moldura); entrada do nome | 2 camadas | estático |
| 2. Quem sou | foto com parallax leve; moldura que "desenha" (`scale`/`opacity` por partes) | fade simples | estático |
| 3. Citações | cada frase entra com o scroll (fade + translate); estrelas Y2K começam a cintilar | igual | visível de cara |
| 4. Baralho | **scroll horizontal com pin**: as cartas passam como numa tiragem; o verso vira para a frente (`rotateY`) | **scroll-snap horizontal nativo**, sem pin | grade estática |
| 5. Consulta | pin curto com respiração guiada visual (círculo que expande e contrai, `scale`) | igual, mais curto | sem respiração animada |
| 6. Como funciona | **seção sticky**: os 4 passos trocam conforme o progresso | lista com fade | lista estática |
| 7. Agendamento | sem animação de scroll (formulário nunca anima) | — | — |
| 8–9. Depoimentos e FAQ | entrada suave | igual | estático |
| 10. Contato | lua cheia no topo e céu estrelado com parallax lento | estrelas estáticas | estático |

Regras de toda animação:
- Só `transform` e `opacity`, com `will-change` só durante a animação.
- O texto fica legível desde o primeiro quadro: nada de texto com `opacity: 0` esperando gatilho. As entradas partem de `opacity: .001` com estado final garantido.
- O pin é desligado abaixo de 768px.
- Lenis com `autoRaf` sincronizado com o ticker do GSAP.

---

## 6. Ordem de construção

Cada fase termina com uma demonstração (screenshots ou preview) e a sua aprovação.

| Fase | Entrega | Como testar |
|---|---|---|
| **F0 Fundação** | Next.js + TypeScript + Sass/Bootstrap, ESLint, Prettier, Vitest, Playwright, CI no GitHub Actions (lint, typecheck, testes, gitleaks), `.env.example`, headers de segurança iniciais | `npm run build` passa; CI verde; headers conferidos no teste |
| **F1 Design system** | tokens, fontes, ornamentos SVG, componentes base e uma página de estilos (só em dev) | screenshots em 320/768/1440; axe sem violações; contraste de cada par de cores |
| **F2 Página estática** | as 11 seções com o conteúdo de `conteudo-inicial.md` (ainda local), HTML semântico, responsivo | Playwright em 320px→1920px; navegação por teclado; axe |
| **F3 Animações** | Lenis, sol→lua, mapa da seção 5, reduced motion | trace de desempenho com CPU 4× e meta de 60fps; teste com `reducedMotion: 'reduce'` mostra o conteúdo inteiro |
| **F4 Banco** | migrations, RLS, RPCs, seed; a página lê do Supabase com ISR | pgTAP de RLS; e2e da página com dados do banco |
| **F5 Login e painel base** | login + MFA, middleware, layout admin, edição de configurações e seções, revalidação | e2e "como estranho": `/admin` sem login redireciona; Server Action sem papel é recusada |
| **F6 Painel de conteúdo** | citações, depoimentos, FAQ, mídia (upload com alt e crédito obrigatórios), temas prontos | e2e de criar, editar e publicar; upload de tipo errado é recusado |
| **F7 Agenda pública** | regras de disponibilidade, `/api/slots`, formulário, reserva de 2h, link do WhatsApp, rate limit, anti-bot | Vitest do cálculo de horários e fuso; teste de concorrência (2 reservas no mesmo horário → só 1 passa); expiração |
| **F8 Agenda no painel** | lista de pedidos, tela "Hoje", botões de mensagem pronta, status, remarcar/cancelar, e-mail de novo pedido + resumo diário (Vercel Cron) | e2e do ciclo pending → confirmed → done; e-mail em modo de teste |
| **F9 LGPD e jurídico** | banner de cookies, privacidade e termos (RASCUNHO — revisar com advogado), job de retenção | tracking só depois do aceite; job anonimiza |
| **F10 SEO e GEO** | metadata, OG image, sitemap, robots, JSON-LD (`Person`, `Service`, `FAQPage`), `llms.txt` | validação do schema; Lighthouse SEO ≥ 90 |
| **F11 Google Agenda (opcional)** | OAuth, token no Supabase Vault, sincronização liga/desliga | e2e com mock da API do Google |
| **F12 Endurecimento e publicação** | checklist completo, Lighthouse, Strix, correções, deploy de produção na Vercel | relatório final (seção 7) |

---

## 7. Testes e segurança

### Testes
- **Playwright** (`tests/e2e`):
  - projetos 320px, 375px, 768px e 1440px, mais um com `reducedMotion: 'reduce'`;
  - fluxos: página pública, agendamento, login, painel;
  - screenshots visuais (`tests/visual`) com tolerância.
- **Acessibilidade:**
  - `@axe-core/playwright` em todas as rotas (zero violações sérias);
  - teste de teclado: foco visível, ordem lógica, armadilhas de foco só em modais, skip link.
  - Contraste conferido nos estados de transição (screenshots em pontos do scroll).
- **Lighthouse CI** (`@lhci/cli`): sobre o build de produção, perfil mobile, ≥ 90 em todas as categorias. Roda no CI a partir da F2.
- **Desempenho de animação:** trace do Chrome via Playwright com throttling e asserção de quadros longos.
- **Unidade (Vitest):** schemas Zod, cálculo de horários e fuso, montagem de links do WhatsApp, sanitização.
- **Banco (pgTAP):** RLS e RPCs de todas as tabelas.

### Checklist de segurança: onde cada item é resolvido

| # | Item | Como | Fase |
|---|---|---|---|
| 1, 6 | chaves e service role | só em `lib/supabase/admin.ts` com `import 'server-only'`; teste que procura chaves no bundle do cliente | F0/F4 |
| 2 | `.env` | `.gitignore` + `.env.example`; só URL e anon key do Supabase e site key do anti-bot como `NEXT_PUBLIC_` | F0 |
| 3, 4, 7 | permissões | middleware + `requireAdmin()` em toda Server Action/rota; usuário sempre da sessão | F5 |
| 5 | RLS | todas as tabelas + pgTAP | F4 |
| 8 | debug e source maps | `productionBrowserSourceMaps: false`, sem `console` em produção | F0 |
| 9 | erros | mensagens genéricas; detalhes no log do servidor | F5 |
| 10, 11 | Zod e sanitização | Zod em toda entrada; texto puro (sem HTML) no conteúdo, renderizado escapado | F4–F7 |
| 12 | upload | tipo, tamanho, conversão no servidor, políticas do bucket | F6 |
| 13 | SQL injection | só cliente do Supabase e RPCs com parâmetros | F4 |
| 14 | rate limit | login, agendamento e `/api/slots` | F5/F7 |
| 15 | gitleaks | no CI e no histórico inteiro | F0 |
| 16 | headers e CORS | CSP estático no `next.config.ts` para a página pública (nonce exige renderização dinâmica e mataria o ISR) e CSP com nonce no `proxy.ts` para `/admin` e `/login`; HSTS, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy; CORS fechado | F0/F5/F12 |
| 17 | testar como estranho | suíte `tests/security`: sem login, com usuário sem papel, IDs de outras linhas | F5–F8 |
| 18 | Strix | auditoria do repositório + URL de preview | F12 |

### Strix (F12)
- Rodar `strix --target ./` e `strix --target <url de preview>`.
- Precisa de Docker ligado e de `STRIX_LLM` + `LLM_API_KEY`.
- Tudo o que for encontrado é corrigido e rodado de novo até não sobrar achado alto ou crítico.

---

## 8. Riscos e decisões que dependem de você

### Decisões (respondidas em 22/10)
1. **Contas:** você cria todas (Supabase, Vercel, Resend, Upstash, Turnstile e, se houver F11, Google Cloud). Nenhuma exige a Mari como dona: ela entra só como administradora do painel do site.
2. **Administradores:** você durante a construção; depois da entrega, você **e** a Mari (a tabela `admin_users` aceita várias pessoas).
3. **E-mails antes do domínio:** os avisos vão para o seu e-mail até o domínio ser verificado no Resend.
4. **Retenção:** **90 dias** depois da consulta; então nome, WhatsApp e intenção são apagados.
5. **Imagens:** bucket **privado**. O visitante vê as imagens no site, mas nunca o link do arquivo original no Supabase. Limite que não tem como evitar: qualquer imagem exibida numa página pode ser salva pelo visitante (clique direito ou print).
6. **Analytics:** **sim**, com Vercel Web Analytics (sem cookies), carregado **só depois do aceite** no banner, como pede o `CLAUDE.md`. O CSP passa a liberar só o script da Vercel.
7. **Stripe:** só documentado (`docs/stripe-futuro.md`), sem código. (Sem resposta contrária; mantido.)
8. **Google Agenda (F11):** em aberto. Decidir antes da F11.
9. **Preview na Vercel:** em aberto. Decidir antes do fim da F2.

### Riscos
- **Desempenho × animação:** scroll horizontal, pin e parallax ameaçam o Lighthouse ≥ 90 no celular. Mitigação: matchMedia com cenas mais leves, imagens AVIF pequenas, CSS no lugar de WebGL e medição desde a F3.
- **Docker neste container:** o Docker está instalado, mas o serviço não está ligado. O Supabase local, o pgTAP e o Strix precisam dele. Se não conseguir ligar, uso um projeto Supabase de desenvolvimento na nuvem para testes e rodo o Strix na sua máquina.
- **Downloads bloqueados:** o Chromium novo do Playwright não baixou aqui. Os testes usam o Chromium do container, e o CI do GitHub baixa o próprio.
- **Direitos das imagens:** a arte das cartas não é reproduzida. As gravuras são só de domínio público, com crédito.
- **Textos:** os rascunhos são meus, na voz da Mari. Ela precisa revisá-los depois da surpresa.
- **Custo do Strix:** ele usa a sua chave de LLM, e um scan completo pode custar alguns dólares.

---

## Verificação geral
- **A cada fase:** `npm run lint && npm run typecheck && npm test`, Playwright e2e/a11y/visual, screenshots enviados a você.
- **Da F4 em diante:** `supabase test db`.
- **Da F2 em diante, no CI:** Lighthouse CI.
- **Na F12:**
  - checklist de segurança item por item, com evidência;
  - Strix sem achados altos ou críticos;
  - Lighthouse ≥ 90 nas 4 categorias em mobile e desktop;
  - teste manual no celular.

---

# Próxima fase: F2 — página estática (detalhamento)

## Contexto
- F0 e F1 estão prontas, com CI verde (run 39744401144).
- A F2 monta as 11 seções da one-page com os textos de `docs/conteudo-inicial.md`, ainda sem animação (F3), sem banco (F4) e sem formulário funcionando (F7).
- Segue a folha da taste-skill (`.taste-skill/direction.json`, direção `page-is-the-object`) e o sistema de design da F1 (`src/styles/_tokens.scss`, `src/components/ui/*`, `src/components/ornaments/*`).

## Conteúdo
- **`src/content/conteudo-inicial.ts`:** os textos padrão iniciais, tipados, transcritos de `docs/conteudo-inicial.md`, com um schema Zod por seção em `src/lib/validation/conteudo.ts`. Esse mesmo schema vai validar o banco na F4, e a página passa a ler do banco sem mudar os componentes.
- **Trechos `[a preencher]`:** a história dela, o número do WhatsApp e as frases dela e da Prem não são renderizados. Os campos ficam vazios e a seção se adapta.
- **Depoimentos:** a seção não aparece enquanto não houver nenhum. Não se inventa prova.

## Seções → blueprint da folha (geometria da folha, cores e tipos da F1)

| # | Seção | Fase | Blueprint | Notas |
|---|---|---|---|---|
| 1 | Abertura | solar | *Card over a dim room* | Fundo de céu/sol em gravura; carta **XIX O Sol** com `h1` "Mariana Dayrell", linha de apoio e o botão "Quero minha tiragem" (→ `#agendamento`) |
| 2 | Quem sou | solar | *Founder's letter* (variante folha) | Folha pergaminho com borda inferior recortada; retrato redondo da Mari; carta em 1ª pessoa |
| 3 | Citações | solar → crepúsculo | campo vermelho (o "descanso" da página) | Citação da Sara Koimbra em `blockquote`; o espaço das frases da Mari e da Prem fica pronto |
| 4 | O baralho | crepúsculo | *Output slips along the edge* | Gravura de fundo; as "tiras" são cartas desenhadas por nós (moldura, selo, faixa e ornamento próprio) com os nomes A Louca, A Força, O Eremita, A Enforcada…, **sem a arte original** |
| 5 | A consulta | lunar | *Title, note, facts row* | Fatos reais: áudio de 10–15 min · foto das cartas · respiração guiada · 100% online |
| 6 | Como funciona | lunar | *Drag row of moments* | 4 momentos com a ordem dita em palavras ("Você escolhe o horário"…), sem números; rolagem horizontal nativa com scroll-snap |
| 7 | Agendamento | lunar | *Visit card on a photograph* | Céu noturno com o cartão de reserva: campos e consentimento LGPD em rascunho. Botão desativado com aviso "agenda abre em breve" até a F7 |
| 8 | Depoimentos | lunar | *One long letter* | Oculta sem dados |
| 9 | Perguntas frequentes | lunar | *Answers as reading text* | 10 perguntas em texto corrido, duas colunas; JSON-LD `FAQPage` fica para a F10 |
| 10–11 | Contato e rodapé | noite plena | *The back of the card* | Verso da carta (hera espelhada + pentagrama), carta **XVIII A Lua**, links (WhatsApp e Instagram só se preenchidos), links legais e crédito das imagens |

- **Navegação:** barra simples com o nome, 3 a 4 links de âncora e a ação. Skip link para o conteúdo.
- **Celular (320–390px):** cada blueprint na versão de telefone que a própria folha descreve.

## Imagens (piso da taste-skill: 4+ imagens reais)
- **Imagem própria:** a foto da Mari (`docs/referencias/foto-tarologa.jpg`), convertida para AVIF/WebP com menos de 300 KB.
- **Gravuras de domínio público:**
  - mapas celestes (Cellarius, *Harmonia Macrocosmica*);
  - a lua de Hevelius (*Selenographia*);
  - pranchas botânicas (hera, lavanda, dedaleira);
  - sol e lua alquímicos;
  - mapa antigo de Minas Gerais.
- **Busca:** feita com `assets.mjs` e baixada com `--get`. Cada imagem é convertida com `sharp` e registrada em `docs/creditos-imagens.md`, com a linha de crédito no rodapé.
- **Bloqueio atual:** a rede deste ambiente bloqueia os acervos (403). **Decisão (22/10): você libera os domínios** nas configurações do ambiente: menu do ambiente no topo da sessão → Edit → Network access → Allowed domains, mantendo "Allow package managers" marcado. Passo a passo em https://code.claude.com/docs/en/cloud-environments#network-access.
  - Domínios: `commons.wikimedia.org`, `upload.wikimedia.org`, `api.openverse.org`, `api.artic.edu`, `www.artic.edu`, `collectionapi.metmuseum.org`, `images.metmuseum.org`.
- **Ordem de trabalho para não travar:**
  1. conteúdo tipado;
  2. as 11 seções com a foto da Mari e os ornamentos;
  3. os testes.
  - As gravuras entram assim que a rede estiver liberada. Antes de buscar, confiro a liberação com `assets.mjs`.
  - Se a mudança só valer para sessões novas, aviso e sigo com o resto. Nada de imagem inventada nem de substituto no lugar das gravuras.

## Verificação da F2
- `lint.mjs` e `inspect.mjs` da taste-skill a 1440, 768 e 390px com **0 FAIL**, mais até 3 rodadas de crítica com os screenshots (`references/critique.md`).
- **Playwright:**
  - cada seção tem título;
  - um único `h1`;
  - nenhuma rolagem horizontal da página em 320px;
  - navegação completa por teclado, com skip link e foco visível;
  - axe sem violações na página inteira;
  - os links de âncora funcionam.
- **Lighthouse CI:** entra no CI (`@lhci/cli`, perfil mobile) com meta ≥ 90.
- **Entrega:** screenshots das 3 larguras para a sua aprovação.
