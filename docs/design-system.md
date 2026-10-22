# Sistema de design

Página viva: `/estilo` (só em desenvolvimento ou com `STYLEGUIDE=1` no build).

## Direção (taste-skill)

- **Sorteio:** `page-is-the-object` — "a página é o objeto" (seed 1631522040; folha em `.taste-skill/direction.json`, reimprima com `node .claude/skills/design-taste-frontend/scripts/draw.mjs --show`).
- **Ideia:** a carta de "O Lendário Tarot das Bruxas" — moldura, selo numerado, faixa com o nome e verso de hera espelhada — vira a página. A abertura é a carta **XIX O Sol** e a noite termina na carta **XVIII A Lua**, os dois arcanos que já contam a passagem do dia para a noite.
- **Adotado da folha:** composição (cada seção é uma peça da mesma "papelaria": carta, verso, faixa), blueprints de seção e o movimento "Pinned story".

## Onde a direção do projeto passa por cima da folha

A skill prevê isso para marcas existentes (`--keep palette,type`). A direção visual do `CLAUDE.md` é a marca.

| Item da folha | Decisão | Por quê |
|---|---|---|
| Paleta "Oxblood and grey" | Cores das cartas e do `CLAUDE.md`, com as proporções da folha (um fundo, uma tinta, um acento turquesa, um campo vermelho) | O `CLAUDE.md` fixa solar/lunar/turquesa |
| Bodoni Moda (títulos) | **Cormorant Garamond** | "Misticidade, seriedade e acalento": a Bodoni é fria e de moda; a Cormorant é ancestral e calorosa |
| Jost (texto) | **Mantida** | Sans geométrica dos anos 1920, conversa com o art déco |
| "Sem cream + terracota" | Fundo pergaminho mantido, mas com tinta de hera (verde quase preto) e vermelho do sol, não terracota | O pergaminho é o material do verso das cartas |
| "Sem numeração" | Só os algarismos romanos dos arcanos nos selos | É o artefato do assunto, não índice |
| "Sem gradientes" | **Mantido.** A passagem sol → lua é feita com camadas de cor sólida trocando por opacidade; o brilho Y2K é a estrela de quatro pontas sólida | Cumpre a regra e o `CLAUDE.md` |
| "Sem linhas finas" | **Mantido.** Moldura da carta é faixa preenchida; ornamentos têm traço de 4–7px | — |

## Tokens

- Fonte: `src/styles/_tokens.scss` (cores por fase em `[data-phase]`, tipografia, espaço, forma).
- Contraste: `src/styles/tokens.test.ts` confere WCAG AA (4,5:1) de cada par de texto nas três fases. Ornamentos (`--gold`, `--olive`) não levam texto.
- Bootstrap: `src/styles/_bootstrap-config.scss` (cantos retos, sem sombras nem gradientes, foco turquesa) e `src/styles/_themes.scss` (liga `--bs-*` à fase).
- Tipografia: duas famílias, cinco tamanhos (`--step-small`, `--step-body`, `--step-lead`, `--step-head`, `--step-display`), servidas pelo próprio site via `next/font`.

## Componentes

| Componente | Arquivo | Uso |
|---|---|---|
| `Carta` | `src/components/ui/Carta.tsx` | painel com moldura dourada chanfrada, selo romano e faixa; `formato="carta"` usa a proporção 7:11 do baralho |
| `Botao` | `src/components/ui/Botao.tsx` | um formato no site todo: `principal` (turquesa sólido) e `texto` (link sublinhado) |
| `Citacao` | `src/components/ui/Citacao.tsx` | `figure` + `blockquote` + autoria |
| `Divisor` | `src/components/ui/Divisor.tsx` | ramo de hera, pentagrama, ramo espelhado |
| Ornamentos | `src/components/ornaments/` | `Sol`, `Lua` (crescente/cheia), `Estrela`, `Pentagrama` (de galhos), `Hera` (espelhada) — desenhos próprios, nada copiado das cartas |

## Movimento (F3)

Código em `src/animations/` (`CamadaDeMovimento.tsx` carrega GSAP, ScrollTrigger e Lenis depois da primeira pintura; `cenas.ts` monta as cenas).

| Cena | O que faz | Onde | Desliga em |
|---|---|---|---|
| **Pôr do sol** (assinatura) | ao sair da carta XIX, o sol gira e afunda e a carta recua (escala e posição, sem transparência) | abertura | movimento reduzido |
| **Fio turquesa** | linha na margem esquerda que cresce com a página; o disco desce de sol a lua | página toda | celular/tablet, movimento reduzido |
| **Cartas dadas** | as cartas sobem da borda da seção, uma a uma, presas à rolagem | baralho | celular/tablet (vira fileira rolável), movimento reduzido |
| Entradas | título, texto e detalhes sobem 24px com opacidade, em ordem, uma vez | todas as seções (o formulário nunca anima) | movimento reduzido |
| Hera | os ramos crescem a partir da base | quem sou | movimento reduzido |
| Estrelas (Y2K) | acendem uma vez, sem loop | citações, agendamento | movimento reduzido |
| Lua | sobe devagar (paralaxe de 8%) | agendamento | movimento reduzido |
| Rolagem suave | Lenis com lerp 0,12 | página toda | toque e movimento reduzido |

Regras aplicadas:
- só `transform` e `opacity`;
- estados iniciais criados pelo JavaScript (sem JS, tudo aparece);
- `opacity` em vez de `visibility`, para o conteúdo continuar acessível a leitores de tela;
- cada entrada dispara uma vez.

Testes: `tests/e2e/movimento.spec.ts` e `tests/perf/quadros.spec.ts` (CPU 4×: mediana de 16,7 ms por quadro).
