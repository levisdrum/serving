# Project Start

## Resumo do kickoff
- Problema: app atual de louvor possui UX/UI fraca para gestão de escala.
- Usuário-alvo:
  - Admin: gerencia acesso, pessoas e equipes.
  - Membros: aceitam escala, sugerem músicas, atualizam perfil e função.
- Escopo v1: gestão local-first com `localStorage`, sem backend complexo.
- Restrições: sem SaaS comercial e sem infraestrutura de e-mail transacional.

## Confirmação
- `Posso começar?` respondido com: `sim`

## Decisões de produto
1. Incluir sugestão de músicas no v1.
2. Tratar convites como fluxo interno no app.
3. Envio de e-mail real fica fora do v1 local-first.

## Próximos passos
1. Modelar entidades locais (usuário, equipe, evento, escala, convite, sugestão).
2. Implementar telas base: login, dashboard admin, perfil membro, escala.
3. Aplicar QA Gate (typecheck/lint/test/build) após primeira entrega funcional.
