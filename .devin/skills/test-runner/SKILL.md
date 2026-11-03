---
name: test-runner
description: Executa testes Vitest e gera relatório de cobertura para o projeto Vitta
allowed-tools:
  - read
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

# Test Runner — Projeto Vitta

Esta skill executa testes e gera relatórios de cobertura para o projeto Vitta.

## Comandos Disponíveis

### Executar Todos os Testes
```bash
pnpm test
```

### Executar em Watch Mode
```bash
pnpm test --watch
```

### Executar com Cobertura
```bash
pnpm test --coverage
```

### Executar Testes Específicos
```bash
pnpm test <file-pattern>
```

## Checklist de Testes

### Cobertura de Testes
- [ ] Testes de componentes React?
- [ ] Testes de tRPC procedures?
- [ ] Testes de Drizzle queries?
- [ ] Testes de integração?
- [ ] Testes de edge cases?

### Qualidade dos Testes
- [ ] Testes independentes (isolados)?
- [ ] Testes descritivos (nomes claros)?
- [ ] AAA pattern (Arrange, Act, Assert)?
- [ ] Mocks usados corretamente?
- [ ] Testes rápidos (unitários) vs lentos (integração)?

## Relatório de Cobertura

Gere um relatório com:
- % de cobertura por módulo (client, server, shared)
- Linhas não cobertas
- Arquivos sem testes
- Gaps críticos (sem testes em código crítico)

## Instruções para o Agente

1. Execute `pnpm test --coverage` se disponível
2. Analise o relatório de cobertura
3. Liste arquivos sem testes
4. Priorize:
   - Código de negócio (tRPC routers)
   - Componentes React complexos
   - Queries de banco de dados
5. Sugira quais testes criar primeiro

## Métricas de Sucesso

- Cobertura ≥ 70% para código de negócio
- Todos os testes passando
- Sem testes flaky (intermitentes)
- Tempo de execução < 30s
