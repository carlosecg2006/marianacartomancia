# Mariana Dayrell — site

Site one-page de apresentação da taróloga Mariana Dayrell, com painel administrativo.

- Regras do projeto: [`CLAUDE.md`](CLAUDE.md)
- Produto: [`PRODUTO.md`](PRODUTO.md)
- Plano e fases: [`docs/PLANO.md`](docs/PLANO.md)

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção |
| `npm run lint` / `npm run typecheck` | ESLint e TypeScript |
| `npm run format` | formata com Prettier |
| `npm test` | testes de unidade (Vitest) |
| `npm run test:e2e` | testes no navegador (Playwright + axe); rode `npm run build` antes |

Variáveis de ambiente: copie `.env.example` para `.env.local`. Nunca faça commit do `.env.local`.

Para rodar a varredura de segredos localmente:

```bash
go install github.com/zricethezav/gitleaks/v8@v8.30.1
gitleaks git --no-banner --redact .
```
