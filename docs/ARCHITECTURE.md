# Arquitetura do MVP (Design System + Features Modulares)

## Visão geral
Aplicação `React + TypeScript + Vite`, local-first, com persistência em `localStorage`.

## Camadas
- `src/domain`: tipos, store, helpers de negócio.
- `src/features`: telas modulares por contexto (`admin-panel`, `member-panel`, `login-screen`).
- `src/design-system`: tokens + componentes base com contrato estável.
- `src/app`: shell da aplicação e regras globais.

## Modelo de dados atual
- `Team`: `memberIds`, `roles`, `roleAssignments`.
- `EventScale`:
  - `congregacao`
  - `assignments[]` (por membro, sem `teamRoleId`)
  - `songs[]`
  - `notes`
  - `playlistLink`
- `MemberProfile`:
  - papel de acesso (`role`: `master` | `admin` | `membro`)
  - hash de senha local (`passwordHash`)
  - ministério principal (`ministerioPrincipal`)
  - ministérios secundários (`ministeriosSecundarios`)
  - dados de perfil (`fotoUrl`, `telefone`, `observacao`)

## Helpers de domínio
- `scale-helpers`: resumo de status e próximas escalas.
- `canRemoveUser`: regra central de permissão para exclusão de usuários.

## Fluxo operacional entregue
- Shell com sidebar escura + topbar de perfil.
- Admin com páginas por funcionalidade no sidebar e painel inicial.
- Admin por congregação com escopo de dados restrito.
- Master com visão global de todas as congregações.
- Guardrail de papel: o primeiro cadastro local inicializa `master`; cadastros seguintes entram como `membro`.
- Bootstrap por token minificado decodifica usuários localmente e persiste apenas `passwordHash`.
- Membro com área de escala, convites e leitura de detalhe do evento.
- Edição e filtros locais sem backend.
- Fallback de compatibilidade para usuários antigos no `localStorage`.
- Formulários React Aria avançados:
  - `DatePicker` para data de escala
  - `TagGroup` para múltiplos ministérios e membros escalados
  - `FileTrigger` para avatar

## Limitações vigentes
- Sem backend e sem sincronização entre dispositivos.
- Login local simplificado, sem autenticação real.
- Sem credenciais seedadas no bundle público.
- Token de bootstrap é mecanismo de setup local, não segredo de produção.
- Sem envio real de e-mail (fluxo de convite é interno no app).

## Regras de segurança funcional
- `master` exclui `admin` e `membro`, exceto a si mesmo.
- `admin` exclui apenas `membro`.
- `master` não é excluível.
- Atualizações críticas de usuário (`updateUser`/`removeUser`) usam commit atômico para evitar condição de corrida no `localStorage`.
