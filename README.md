# Serving

Aplicação local-first para gestão de escalas, construída com `React + TypeScript + Vite`.

## Stack

- React 18
- TypeScript
- Vite
- React Aria Components
- CSS modular com tokens de Design System
- Persistência local (`localStorage`)

## Como rodar

```bash
pnpm install
pnpm dev
```

## Scripts úteis

- `pnpm dev`: ambiente local
- `pnpm typecheck`: validação TypeScript
- `pnpm lint`: validação de lint
- `pnpm test`: testes unitários (Vitest)
- `pnpm build`: build de produção

## Arquitetura do projeto

### 1) App Shell

- `src/app/`
- Responsável por roteamento, layout principal, navegação e composição das features.

### 2) Domain (regras e estado)

- `src/domain/`
- Contém tipos, store, regras de permissão e helpers.
- Camada central da lógica de negócio (sem backend).

### 3) Features (módulos por tela)

- `src/features/`
- Organização por contexto funcional:
  - `login-screen`
  - `admin-panel`
  - `member-panel`
- Cada módulo segue padrão de separação:
  - `*.tsx` (UI/comportamento)
  - `styles.css` (estilo local)
  - `types.ts` (tipos do módulo)
  - `*.vitest.tsx` (testes)

### 4) Design System

- `src/design-system/`
- Componentes reutilizáveis:
  - `button`
  - `text-field`
  - `text-area`
  - `select`
  - `date-picker`
  - `multi-select-tag-group`
  - `status-badge`
  - `avatar-field`
  - `empty-state`
- Tokens centralizados em:
  - `src/design-system/tokens/colors.css`
  - `src/design-system/tokens/spacing.css`
  - `src/design-system/tokens/typography.css`

## Fluxos principais

- Login e novo cadastro (local)
- Painel Admin:
  - membros, equipes, funções, escalas e detalhe da escala
- Visão Membro:
  - convites, resposta de escala e visualização de playlist/observações
- Perfil:
  - dados pessoais, avatar e ministérios

## Qualidade e CI

- Quality Gate local e em CI:
  - typecheck
  - lint
  - test
  - build
- Workflows em `.github/workflows/` para qualidade e deploy (quando habilitado no repositório).

## Segurança e escopo

- Projeto sem backend e sem autenticação externa.
- Dados ficam apenas no navegador do usuário (`localStorage`).
- Não há usuários ou senhas seedadas no bundle público.
- O primeiro cadastro local inicializa o perfil `master`; cadastros seguintes entram como `membro`.
- Opcionalmente, o primeiro setup pode importar um token minificado gerado localmente com `pnpm bootstrap:token ./bootstrap-users.local.json`.
- O arquivo `bootstrap-users.local.json` não deve ser commitado e está coberto por `.gitignore`.
- Criptografia local existe para reduzir exposição casual, mas não substitui segurança de servidor.
- Não publicar credenciais reais em documentação.
