# PLANS.md

## Como usar
- Registrar planos curtos antes de mudanças substanciais.
- Cada plano deve conter: objetivo, passos, validação, riscos.
- Marcar status conforme execução.

## Template

### [AAAA-MM-DD] Título do plano
- Objetivo:
- Escopo:
- Passos:
1.
2.
3.
- Validação:
- Riscos:
- Status: `planned | in_progress | done | blocked`

### [2026-05-28] MVP local-first para gestão de louvor
- Objetivo: entregar v1 sem backend complexo para substituir fluxo atual com UX melhor.
- Escopo: autenticação local, perfis, equipes, escala, convites internos, aceite/recusa, sugestões de músicas.
- Passos:
1. Definir modelo de dados no cliente e camada de persistência `localStorage`.
2. Construir interfaces principais para admin e membros.
3. Validar fluxo completo de escala e executar QA Gate.
- Validação: fluxo `criar escala -> convidar -> aceitar/recusar` funcional e persistente após refresh.
- Riscos: limitação de envio de e-mail real sem backend.
- Status: `done`

### [2026-05-29] Lote A — funções por equipe e escala por papel
- Objetivo: tornar a escala útil para operação real de equipe (função + membro).
- Escopo: atualizar tipos, store, helpers e telas Admin/Membro para novo modelo.
- Passos:
1. Migrar `Team` para incluir `roles` e `roleAssignments`.
2. Migrar `EventScale` para `assignments` com status por designação.
3. Atualizar UI Admin/Membro e testes para o novo fluxo.
- Validação: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`.
- Riscos: migração de estado legado no navegador.
- Status: `done`

### [2026-05-29] Lote B/C — detalhe de escala, resumo e filtros
- Objetivo: completar o MVP funcional de operação do ministério sem backend.
- Escopo: resumo admin, detalhe da escala, playlist/observações, edição simples e filtros/busca.
- Passos:
1. Estender modelos e store com playlist/notes/edição.
2. Atualizar páginas Admin e Membro com os novos fluxos.
3. Ajustar documentação e cobertura de testes.
- Validação: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`.
- Riscos: complexidade de UI sem roteamento dedicado.
- Status: `done`

### [2026-05-29] Ajuste de escopo — remover disponibilidade
- Objetivo: simplificar o MVP para fluxo principal de convite (`enviar -> aceitar/recusar`).
- Escopo: remover disponibilidade do domínio, store, telas, testes e documentação.
- Passos:
1. Remover `MemberAvailability` e ações associadas no store.
2. Remover UI de disponibilidade em Admin/Membro.
3. Atualizar testes e documentos de arquitetura/produto.
- Validação: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`.
- Riscos: estados antigos em `localStorage` com campo extra legado.
- Status: `done`

### [2026-05-29] Escopo por congregação + escala simplificada
- Objetivo: aplicar governança de acesso real (master/admin) e simplificar o fluxo de criação de escala.
- Escopo:
  - adicionar perfil `master` global;
  - restringir `admin` por congregação (`SP AM`, `SP PM`, `BH`, `PF`);
  - remover dependência de equipe/função no formulário de escala;
  - adicionar `DatePicker`, `TagGroup` de membros, observação e link da playlist;
  - substituir campo textual de ministérios secundários por `TagGroup`;
  - habilitar avatar com `FileTrigger`.
- Passos:
1. Atualizar tipos e store (seed, migração e regras de escopo).
2. Atualizar App/Admin/Member para novo fluxo e filtros.
3. Atualizar testes e validar QA Gate.
- Validação: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`.
- Riscos: necessidade de migração de estado legado no `localStorage`.
- Status: `done`
