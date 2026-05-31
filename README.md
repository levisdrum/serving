# Servin — MVP Local-First

Ferramenta de escalas da Estação 337 com `React + TypeScript + Vite`, persistência local e arquitetura modular.

## Scripts
- `pnpm dev`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build`

## Acesso local (seed)
- `master@337` → perfil `master` (visão global)
- `adminsppm@337` → admin `SP PM`
- `adminspam@337` → admin `SP AM`
- `adminbh@337` → admin `BH`
- `adminpf@337` → admin `PF`
- Senhas seed:
  - `master@337` → `Master337!`
  - `adminsppm@337`, `adminspam@337`, `adminbh@337`, `adminpf@337` → `Lider337!`
  - `ana@337`, `bruno@337` → `Membro337!`

## Funcionalidades atuais
- Tela inicial com fluxo separado de `Login` e `Novo cadastro`.
- Login/cadastro local com campos ministeriais (sem backend).
- Perfis de acesso:
  - `master` (visão global)
  - `admin` por congregação (`SP AM`, `SP PM`, `BH`, `PF`) com escopo restrito
  - `membro`
- Admin (menu no sidebar):
  - painel com resumo (KPIs + próximas escalas)
  - cadastrar/editar/remover membros
  - editar `papel`, `ministério principal` e `senha` do membro em `admin/membros`
  - criar/editar/remover equipes
  - criar/editar/remover funções por equipe
  - vincular membro à função
  - criar escala por congregação com:
    - `DatePicker` (React Aria)
    - seleção de múltiplos membros via `TagGroup`
    - observações adicionais
    - link da playlist
  - detalhe de escala (músicas, observações, copiar escala)
- Membro:
  - área de escala com convites
  - aceitar/recusar convite
  - filtrar convites por status
  - sugerir música
  - ver músicas, observações e link da playlist do evento
- Perfil:
  - edição de avatar via `FileTrigger` (upload local/base64)
  - separação entre papel de acesso (`admin`/`membro`) e ministério principal
  - suporte a múltiplos ministérios secundários com `TagGroup`, telefone e observação
- Persistência local com `localStorage`.
- Migração automática de e-mails legados `@local` para `@337`.

## Arquitetura
- `src/domain`: modelos, store e helpers.
- `src/features`: módulos de tela com `tsx + css + types + vitest`.
- `src/design-system`: tokens e componentes reutilizáveis.
- `docs/ARCHITECTURE.md`: decisões técnicas e roadmap por lotes.

## Limitações do MVP
- Sem backend.
- Sem sincronização multiusuário/dispositivo.

## Regras de permissão (usuários)
- Somente `u-master` pode ser `master` (não existe promoção para master via UI).
- `master` pode excluir `admin` e `membro` (não pode excluir a si mesmo; `master` não é excluível).
- `admin` pode excluir apenas `membro`.
