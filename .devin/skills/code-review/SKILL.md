---
name: code-review
description: Review código do projeto Vitta seguindo padrões React/Express/tRPC
allowed-tools:
  - read
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

# Code Review — Projeto Vitta

Esta skill realiza code review sistemático do projeto Vitta Pizzaria Napolitana.

## Checklist de Code Review

### Funcionalidade
- [ ] Código implementa a funcionalidade requerida?
- [ ] Lógica correta sem bugs óbvios?
- [ ] Edge cases tratados?
- [ ] Validação de inputs (Zod schemas)?
- [ ] Error handling adequado?

### tRPC & API
- [ ] tRPC routers bem estruturados?
- [ ] Procedures tipadas corretamente?
- [ ] Input/output Zod schemas definidos?
- [ ] Autenticação/autorização aplicada quando necessário?
- [ ] CORS configurado corretamente?

### React & Frontend
- [ ] Componentes bem divididos?
- [ ] Props tipadas com TypeScript?
- [ ] Hooks usados corretamente (sem violar regras)?
- [ ] Estado gerenciado adequadamente (TanStack Query)?
- [ ] Radix UI componentes usados corretamente?
- [ ] Tailwind classes bem organizadas?

### Banco de Dados (Drizzle)
- [ ] Schema Drizzle bem definido?
- [ ] Índices onde necessário?
- [ ] Queries otimizadas?
- [ ] Migrations incluídas?
- [ ] SQL injection prevenido (Drizzle já protege)?

### TypeScript
- [ ] Tipagem estrita (no `any`)?
- [ ] Tipos reutilizáveis quando apropriado?
- [ ] Interfaces vs types usados consistentemente?
- [ ] Generics usados corretamente?

### Segurança
- [ ] Secrets expostos? (uso de .env)
- [ ] JWT validado corretamente?
- [ ] Inputs sanitizados?
- [ ] SQL injection prevenido?
- [ ] XSS prevenido (React já protege)?

### Performance
- [ ] Queries desnecessárias (N+1)?
- [ ] Re-renders evitados?
- [ ] Lazy loading implementado quando necessário?
- [ ] Imagens otimizadas (AWS S3)?

### Estilo & Convenções
- [ ] Nomes descritivos?
- [ ] Funções pequenas e focadas?
- [ ] Comentários apenas quando necessário?
- [ ] Prettier formatting aplicado?
- [ ] Consistência com resto do código?

## Como Usar

1. Execute `/code-review` para revisar mudanças recentes
2. O agente rodará `git diff` e analisará as mudanças
3. Será gerado um relatório com:
   - Problemas críticos (bloqueantes)
   - Problemas não-críticos (sugestões)
   - Pontos positivos
   - Recomendações específicas

## Comandos Disponíveis

- `/code-review` — Review de mudanças não-commitadas
- `/code-review --all` — Review de todo o projeto
- `/code-review <file>` — Review de arquivo específico
