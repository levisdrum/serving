# CONTEXT.md

## Contexto atual
- Projeto em React + TypeScript + Vite.
- Arquitetura modular para design system e features.
- Persistência local via `localStorage`.

## Produto
- Domínio: gestão de escala para igreja/louvor.
- Público: admin e membros voluntários.
- Restrições: sem backend, sem SaaS, sem billing.
- Marca: `Servin` (Estação 337).

## Estado da iniciativa
- Lote A/B/C concluídos no MVP.
- Escopo de acesso concluído: `master` global + `admin` restrito por congregação.
- Escala simplificada concluída: sem seleção de equipe/função, com membros via `TagGroup`, `DatePicker`, observação e playlist.
- UI evoluída para shell de dashboard com sidebar/topbar.
- Gestão de membros refinada: papel, ministério principal e senha de apoio visíveis no admin.
- Regras de exclusão e guardrails de master implementados no domínio.

## Decisões vigentes
- Fluxo de convite é interno no app.
- Identidade visual alinhada ao padrão dashboard (TailAdmin-like).
- Papel de acesso e perfil ministerial são conceitos separados.
- Upload local de avatar e múltiplos ministérios via componentes React Aria.
- Somente `u-master` pode ser `master` (UI e domínio bloqueiam promoção indevida).
- Exclusão de usuários segue regra explícita por papel com validação no domínio.
- Evolução incremental por lotes com QA Gate rígido.
