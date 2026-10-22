# CLAUDE.md

Regras permanentes do projeto. Valem para toda tarefa. Contexto do produto em `PRODUTO.md`.

## Stack

- **Front-end:** Next.js (App Router) + Bootstrap 5 customizado via Sass.
  - Sobrescreva variáveis, tipografia, espaçamentos e componentes. O resultado **não pode** ter cara de Bootstrap padrão.
  - Importe só os módulos Sass do Bootstrap que forem usados.
- **Back-end e banco:** Supabase (Auth, Postgres, Storage).
- **Pagamentos:** Stripe (Checkout + webhooks verificados por assinatura). Nunca tocar em dados de cartão.
- **Hospedagem:** Vercel.
- **Animações:** GSAP + ScrollTrigger, e Lenis para scroll suave.

## Skills

### Prioridade das skills de design (quando conflitarem)

1. `design-taste-frontend` (taste-skill)
2. `impeccable`
3. `frontend-design`
4. `web-design-guidelines`
5. as demais

- Carregue a taste-skill antes de escrever qualquer código de UI.
- Use `systematic-debugging` ao corrigir bugs.
- Use `playwright-cli` para testar visualmente. Ele está configurado em `.playwright/cli.config.json` para usar o Chromium do container (`/opt/pw-browsers/chromium`).
- As skills ficam em `.claude/skills/` e as origens estão em `skills-lock.json`. Para atualizar: `npx skills update -p`.

## Direção visual

- Boho + solar + dark + natureza + místico + **[A DEFINIR: Y2K anos 2000 OU ancestral/milenar]** + surrealista.
- Ilustrações e composições com influência isométrica e art déco: linhas geométricas, simetria, ornamentos dourados.
- Tema escuro como base, com acentos quentes/solares.
- A referência principal é a estética das cartas do baralho da taróloga (ver `PRODUTO.md` e `docs/referencias/`).

## Animações

- Técnicas: scroll-trigger, parallax, seções sticky (pin) e scroll horizontal.
- Obrigatório:
  - Respeitar `prefers-reduced-motion`. Com ele ativo, sem parallax, pin ou scroll horizontal, e o conteúdo continua inteiro e legível.
  - Manter 60fps no celular: animar só `transform` e `opacity` e medir no Playwright com throttling.
  - Nunca bloquear a leitura do conteúdo. Texto nunca fica escondido atrás de uma animação que não terminou.

## Requisitos de qualidade (todo entregável)

- Responsivo de 320px a telas grandes.
- Acessibilidade WCAG 2.2 AA:
  - `alt` em todas as imagens (vazio só nas decorativas);
  - contraste corrigido;
  - navegação completa por teclado;
  - foco visível;
  - HTML semântico.
- Imagens em WebP/AVIF com menos de 300 KB, vídeos em WebM e lazy loading.
- Lighthouse acima de 90 em todas as categorias.
- SEO: metadata, Open Graph, `sitemap.xml`, `robots.txt` e dados estruturados (JSON-LD).
- GEO (otimização para IAs e buscadores generativos): conteúdo claro e estruturado, FAQ, schema.org e `llms.txt`.
- Toda imagem tem origem e licença registradas em `/docs/creditos-imagens.md`.

## Segurança (checklist obrigatório)

1. Chaves de API só no servidor, nunca no front.
2. `.env*` no `.gitignore`. Só use variáveis `NEXT_PUBLIC_` que sejam realmente públicas.
3. Permissões checadas no servidor em toda rota.
4. Nunca confiar em ID vindo da tela: o usuário vem sempre da sessão.
5. Banco travado: RLS ativado em **todas** as tabelas do Supabase.
6. Service role key do Supabase nunca no cliente.
7. Área admin protegida por papel verificado no servidor.
8. Debug e source maps desligados em produção.
9. Mensagens de erro genéricas para o usuário. Os detalhes vão só para o log.
10. Validação de tudo no servidor (Zod).
11. Sanitização de toda entrada do usuário.
12. Upload protegido: tipo, tamanho e bucket privado com políticas.
13. Sem SQL injection: só queries parametrizadas ou o cliente do Supabase.
14. Rate limiting em login, formulários e APIs.
15. Varredura do histórico do git por segredos (gitleaks).
16. Headers de segurança (CSP, HSTS, X-Frame-Options etc.) e CORS restrito.
17. Testar como um estranho: acessar rotas e dados sem login e como outro usuário.
18. Auditoria completa com Strix antes de publicar.

## Conformidade e LGPD

- Banner de consentimento de cookies. Tracking só depois do aceite.
- Política de privacidade e termos de serviço.
- Formulários com consentimento explícito e finalidade descrita.
- Scripts de tracking revisados.
- Textos jurídicos: escreva rascunhos marcados **"RASCUNHO — revisar com advogado"**.

## Forma de trabalhar

- Antes de tarefas grandes, apresente um plano e espere aprovação.
- Trabalhe em etapas pequenas e mostre o resultado de cada uma.
- Nunca faça commit de segredos.
- Não invente informação sobre a taróloga, o baralho ou a consulta. O que faltar fica "A DEFINIR" em `PRODUTO.md` e vira pergunta.
