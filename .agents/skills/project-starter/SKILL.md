# Skill: project-starter

## Quando usar
Use esta skill quando o usuário pedir para iniciar um projeto do zero, especialmente com comandos como:
- `Começar projeto`
- `Iniciar projeto`
- `Start project`

## Objetivo
Executar kickoff com segurança, reduzindo implementação prematura e erro de escopo.

## Protocolo obrigatório
1. Rodar limpeza automática de artefatos de scaffold:
   - `bash .agents/skills/project-starter/scripts/clean-framework-artifacts.sh`
2. Fazer até 4 perguntas curtas, uma por vez, cobrindo:
   - objetivo do produto
   - público-alvo
   - escopo inicial
   - restrições técnicas
3. Resumir entendimento em PT-BR.
4. Pedir confirmação explícita: `Posso começar?`.
5. Antes do `sim`: não criar arquivos de implementação.
6. Após o `sim`: criar artefatos iniciais e registrar kickoff.

## Artefatos após confirmação
- Atualizar `CONTEXT.md`.
- Atualizar `PRD.md` (rascunho v1).
- Criar/atualizar `templates/project-start.md` com resumo do kickoff.

## Critério de conclusão
- Perguntas realizadas.
- Resumo validado pelo usuário.
- Confirmação explícita recebida.
- Artefatos iniciais atualizados.
