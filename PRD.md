# PRD.md

## Problema
O grupo de louvor utiliza um app atual com experiência de uso ruim para organizar escalas e colaboração entre membros.

## Objetivo
Evoluir o MVP local-first para um fluxo de escala completo para igreja/louvor, sem backend e sem complexidade de SaaS.

## Escopo v1 atualizado
- In:
  - Autenticação local simples (sem backend)
  - Perfis de acesso `master`, `admin` (por congregação) e `membro`
  - Cadastro e edição de membros/equipes/funções
  - Funções por equipe e vínculo membro-função (cadastro operacional)
  - Criação e edição de escala/evento por congregação, com múltiplos membros escalados
  - `DatePicker` para data de escala
  - `TagGroup` para seleção múltipla (membros e ministérios secundários)
  - Convite interno com status (`pendente`, `aceito`, `recusado`)
  - Músicas do evento + sugestões de músicas
  - Observações do evento + link da playlist
  - Avatar com upload local (`FileTrigger`)
  - Gestão de papel (`admin`/`membro`) e ministério principal na tabela de membros
  - Campo de senha de apoio visível/ajustável no admin para suporte operacional
  - Copiar escala para WhatsApp
  - Busca/filtros locais
  - Persistência em `localStorage`
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
7. Edições básicas e filtros locais funcionam sem backend.
8. Somente o usuário canônico master pode manter papel `master`.
9. Permissões de exclusão:
   - `master` exclui `admin` e `membro` (exceto a si mesmo)
   - `admin` exclui apenas `membro`

## Requisitos não-funcionais
- Performance: interface responsiva em desktop/mobile.
- Segurança: sem dados sensíveis críticos; armazenamento local no navegador.
- Qualidade: `typecheck`, `lint`, `test`, `build` obrigatórios.

## Critérios de aceite
1. Fluxo completo: criar escala -> convidar -> aceitar/recusar -> detalhar evento.
2. Músicas e observações persistem no evento.
3. Busca/filtros retornam resultados corretos e empty states.
4. Pipeline de qualidade permanece verde.

## Métricas de sucesso
- KPI 1: tempo para criar uma escala completa < 4 minutos.
- KPI 2: taxa de resposta de convite registrada corretamente.
