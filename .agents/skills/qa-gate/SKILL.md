# Skill: qa-gate

## Quando usar
Obrigatória após implementação significativa, antes de considerar a entrega concluída.

## Objetivo
Aplicar gate rígido de qualidade com validação técnica e regressão funcional.

## Protocolo
1. Executar validações técnicas no projeto:
   - `pnpm typecheck`
   - `pnpm lint`
   - `pnpm test`
   - `pnpm build`
2. Se qualquer comando falhar, o gate reprova.
3. Revisar regressão funcional com checklist mínimo:
   - Fluxo principal da feature.
   - Estado de erro esperado.
   - Estado vazio/loading (quando aplicável).
   - Compatibilidade desktop/mobile.
4. Preencher relatório usando `templates/qa-report.md`.
5. Só aprovar handoff após relatório com status `PASS`.

## Regra de rigidez
- Não há bypass silencioso.
- Exceções exigem justificativa explícita no relatório QA.
