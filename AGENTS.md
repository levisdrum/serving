# AGENTS.md — Starter Codex v5.1 (PT-BR)

## Objetivo
Este repositório usa um runtime AI-native para Codex com governança, kickoff controlado e QA Gate rígido.

## Stack padrão
- React
- TypeScript
- Vite
- CSS Nesting + BEM

## Fluxo operacional (hot/warm/cold)
- hot: este `AGENTS.md` + regras mínimas sempre ativas.
- warm: skill ativa da tarefa/sprint em `.agents/skills/*/SKILL.md`.
- cold: templates e documentação sob demanda em `templates/`, `PRD.md`, `CONTEXT.md`, `PLANS.md`.

## Trigger oficial de kickoff
Quando o usuário disser `Começar projeto` (ou equivalente):
1. Executar `bash .agents/skills/project-starter/scripts/clean-framework-artifacts.sh`.
2. Fazer até 4 perguntas curtas, uma por vez.
3. Resumir entendimento e pedir confirmação explícita: `Posso começar?`.
4. Não criar/editar arquivos de implementação antes de um `sim` explícito.
5. Após confirmação, seguir o fluxo da skill `project-starter`.

## Regras de execução
- Antes de mudanças relevantes, usar plano curto e objetivo.
- Sempre validar mudanças com QA Gate (skill `qa-gate`) após implementação significativa.
- Nunca pular testes silenciosamente; qualquer pendência deve ser reportada.
- Preferir comandos determinísticos e não interativos.

## Contrato mínimo de qualidade (Definition of Done)
Uma entrega só pode ser considerada concluída quando:
1. `typecheck` passa.
2. `lint` passa.
3. `test` passa.
4. `build` passa.
5. Checklist de regressão funcional foi revisado.
6. Relatório QA foi registrado (template `templates/qa-report.md`).

## Comandos esperados do projeto
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build`

Se o projeto usar `npm`, substituir `pnpm` por `npm run` sem alterar o gate lógico.
