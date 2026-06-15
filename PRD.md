# PRD.md

## Problema
O grupo de louvor utiliza um app atual com experiência de uso ruim para organizar escalas e colaboração entre membros.

## Objetivo
Evoluir o MVP local-first para um fluxo de escala completo para igreja/louvor, sem backend e sem complexidade de SaaS.

## Escopo v1 atualizado
- In:
  - Autenticação local simples (sem backend)
  - Redefinição local de senha, sem e-mail e sem backend
  - Perfis de acesso `master`, `admin` (por congregação) e `membro`
  - Cadastro e edição de membros/equipes/funções
  - Funções por equipe e vínculo membro-função (cadastro operacional)
  - Criação e edição de escala/evento por congregação, com múltiplos membros escalados
  - `DatePicker` para data de escala
  - `TagGroup` para seleção múltipla (membros e ministérios secundários)
  - Convite interno com status (`pendente`, `aceito`, `recusado`)
  - Link de playlist do evento + sugestões gerais de músicas
  - Observações do evento + link da playlist
  - Avatar com upload local (`FileTrigger`)
  - Gestão de papel (`admin`/`membro`) e ministério principal na tabela de membros
  - Campo para redefinir senha no admin/master, sem exibir senha persistida
  - Busca/filtros locais
  - Persistência em `localStorage`
  - Bootstrap sem credenciais seedadas: primeiro cadastro local inicializa `master`
  - Importação opcional de token minificado para configuração inicial local
- Out:
  - SaaS multi-tenant
  - Backend/DB
  - Pagamento/assinatura

## Requisitos funcionais
1. Admin opera páginas separadas para cada bloco de gestão.
2. Admin comum visualiza e gerencia somente dados da própria congregação.
3. Master visualiza e gerencia dados globais de todas as congregações.
4. Admin cria escala com data, membros, observações e playlist.
5. Admin visualiza resumo (KPIs) e próximas escalas.
6. Membro responde convites e vê detalhe do evento (incluindo playlist).
7. Usuário consegue redefinir senha local informando e-mail cadastrado e nova senha.
8. Edições básicas e filtros locais funcionam sem backend.
9. O primeiro cadastro local recebe papel `master`; cadastros seguintes entram como `membro`.
10. Permissões de exclusão:
   - `master` exclui `admin` e `membro` (exceto a si mesmo)
   - `admin` exclui apenas `membro`

## Requisitos não-funcionais
- Performance: interface responsiva em desktop/mobile.
- Segurança: sem dados sensíveis críticos; armazenamento local no navegador.
- Qualidade: `typecheck`, `lint`, `test`, `build` obrigatórios.

## Critérios de aceite
1. Fluxo completo: criar escala -> convidar -> aceitar/recusar -> detalhar evento.
2. Playlist e observações persistem no evento.
3. Busca/filtros retornam resultados corretos e empty states.
4. Pipeline de qualidade permanece verde.

## Métricas de sucesso
- KPI 1: tempo para criar uma escala completa < 4 minutos.
- KPI 2: taxa de resposta de convite registrada corretamente.
