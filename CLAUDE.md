# CLAUDE.md

## Front-end

- Em toda tarefa de front-end (páginas, componentes, estilos, redesign, revisão visual), siga a skill
  `design-taste-frontend` (Taste Skill, `.claude/skills/design-taste-frontend`). Carregue-a antes de escrever código de UI.
- Para checar o resultado no navegador, use a skill `playwright-cli` (configurada em `.playwright/cli.config.json`
  para usar o Chromium do container em `/opt/pw-browsers/chromium`).

## Skills do projeto

As skills ficam em `.claude/skills/` e as origens estão em `skills-lock.json`.
Para atualizar: `npx skills update -p`.
