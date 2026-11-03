---
name: data-economy
description: Análise de custo-benefício de dados, prontidão e governança
allowed-tools:
  - read
  - grep
  - exec
triggers:
  - user
---

# Análise de Economia de Dados

Esta skill analisa a prontidão, custo e benefício de dados e features baseadas em dados.

## Checklist de Prontidão

Execute este checklist para avaliar se os dados estão prontos para uso:

1. **Existência de dados**
   - Dados existem? Onde? Qual volume?
   - Fontes: banco de dados, APIs, arquivos, logs

2. **Qualidade dos dados**
   - Missing values (porcentagem)
   - Duplicatas
   - Outliers
   - Consistência de tipos

3. **Custo de processamento**
   - Custo atual (compute + armazenamento)
   - Custo projetado com nova feature
   - Comparação local vs cloud

4. **ROI esperado**
   - Benefício esperado da análise/feature
   - Métricas de sucesso
   - Custo-benefício

## Output Esperado

Gere um relatório com:

- **Scorecard de prontidão** (0-100)
- **Lista de bloqueadores** (críticos, não-críticos)
- **Recomendação** go/no-go
- **Estimativa de custo** (compute + armazenamento)
- **Riscos e mitigações**

## Instruções para o Agente

1. Para o projeto Vitta, analise:
   - Dados do cardápio (itens, categorias, preços)
   - Dados de pedidos (se houver)
   - Logs de uso (se houver)
   - Armazenamento AWS S3 (imagens do cardápio)
2. Use o schema Drizzle em `drizzle/` para entender a estrutura
3. Considere custos reais do AWS S3 e MySQL
4. Documente suposições com `[SUPOSIÇÃO]`
