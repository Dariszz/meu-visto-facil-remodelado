# Fases 19 a 24: processos e checklist

Implementadas em 18/11/2026 na branch `feature/processos`.

## O que mudou

- **Banco** (migration `20261118000000_processes_checklists`): `ImmigrationProcess`, `ProcessSnapshot`, `Checklist`, `ChecklistItem` e `ChecklistItemSource`. Todas pertencem ao `UserProfile` (cascade ao excluir o perfil) e nascem sem acesso público, como `UserProfile` e `ProfileAnswer`. Nova categoria de requisito `ENTRY`.
- **Etapas como requisitos**: as três etapas da Critical Skills aprovadas na Fase 5 (solicitar, verificar visto de entrada, registrar residência) entraram no catálogo como requisitos de ação revisados, com o mesmo texto e a mesma fonte. A página pública continua mostrando só as condições em "Principais requisitos"; as etapas seguem na seção de etapas.
- **Fase 19**: "Iniciar processo" nas recomendações. O navegador envia só o visto; perfil, respostas, compatibilidade e requisitos são recalculados no servidor. Caminho não recomendado, visto sem checklist revisado ou questionário incompleto não criam processo. Se já existe processo aberto para o visto, a recomendação mostra "Abrir processo" e a criação devolve o existente.
- **Fase 20**: snapshot com perfil normalizado, visto, requisitos revisados, resultado da recomendação e `ruleEngineVersion` (`ireland-work-v1`). `promptVersion` fica nulo até existir IA.
- **Fase 21**: `buildBaseChecklist` (sem IA, versão `base-checklist-v1`) usa só requisitos `REVIEWED` com fonte não arquivada, agrupa por etapa (Requisitos, Solicitação, Entrada no país, Após a chegada) e tem um ponto de extensão para condições por perfil; "não sei" nunca remove item.
- **Fase 22**: rota autenticada `/processes/[id]`, usando a tela aprovada na prévia. Processo inexistente ou de outra pessoa responde 404, sem distinção.
- **Fase 23**: marcar itens salva no servidor (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `NOT_APPLICABLE`); concluir registra a data. Se o servidor recusar, a tela desfaz a mudança e avisa. Progresso é calculado, não armazenado. O painel lista os processos com a régua e o próximo passo.
- **Fase 24**: toda consulta e alteração filtra pelo perfil da sessão. Testes de integração: outra pessoa não lê, não lista e não altera o processo, nem combinando o próprio processo com item alheio; processo arquivado some; excluir o perfil apaga tudo; nenhuma tabela nova tem grants públicos.

## Verificação

- 393 testes de unidade, 11 de integração em PostgreSQL 18 local, lint, typecheck e build.
- Supabase dev: migration aplicada e registrada, etapas inseridas, grants conferidos.
- Site real (18/11/2026, conta de teste): iniciar processo pelas recomendações, checklist com 7 itens e 3 fontes, concluir e marcar em andamento persistindo após recarregar, painel com progresso e próximo passo, recomendação trocando para "Abrir processo" e id inexistente respondendo 404.

## Pendências

- Não dá para gerar a migration com o Prisma no ambiente remoto (sem schema engine). A SQL foi escrita à mão no padrão das anteriores e validada aplicando em PostgreSQL. Para conferir no PC: `pnpm prisma migrate diff --from-migrations prisma/migrations --to-schema prisma/schema.prisma --shadow-database-url <banco vazio>`.
- Itens pessoais (criados pela pessoa) e arquivar/pausar processo ficam para depois.
