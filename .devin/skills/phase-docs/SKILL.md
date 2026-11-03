---
name: phase-docs
description: Gera documentação estruturada por etapa do SDLC para projeto existente
allowed-tools:
  - read
  - grep
  - glob
  - write
triggers:
  - user
  - model
---

# Documentação por Etapa

Esta skill gera documentação estruturada para cada fase do ciclo de vida do desenvolvimento de software.

## Como usar

Execute esta skill para gerar documentação completa do projeto. A skill criará arquivos em `docs/` organizados por fase.

## Fases de Documentação

### Fase 1 — Planejamento
- Ler README, issues, PRDs existentes
- Output: `docs/01-planning.md` (escopo, stakeholders, restrições)

### Fase 2 — Design
- Ler arquivos de arquitetura, ADRs, schema
- Output: `docs/02-design.md` (arquitetura, modelo de dados, APIs)

### Fase 3 — Desenvolvimento
- Ler código-fonte, rotas de API
- Output: `docs/03-api.md` (endpoints, contratos, exemplos)

### Fase 4 — Testes
- Ler arquivos de teste, relatórios de cobertura
- Output: `docs/04-testing.md` (estratégia, cobertura, gaps)

### Fase 5 — Release
- Ler git log, changelog
- Output: `docs/05-release-notes.md` (mudanças, breaking changes)

## Instruções para o Agente

1. Primeiro, verifique se existe o diretório `docs/`. Se não, crie.
2. Para cada fase, leia os arquivos relevantes e gere documentação estruturada.
3. Use tabelas, listas e código quando apropriado.
4. Documente também o que NÃO existe (lacunas de documentação).
5. Para o projeto Vitta, foque em:
   - Stack: React, Express, tRPC, Drizzle, MySQL
   - Domínio: Cardápio digital para pizzaria
   - Integrações: AWS S3, JWT (jose)
