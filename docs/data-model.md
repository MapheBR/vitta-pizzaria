# Modelo de Dados — Vitta Pizzaria Napolitana

**Data**: 2026-10-28
**Banco de Dados**: MySQL
**ORM**: Drizzle ORM
**Versão**: 1.0.0 (MVP)

---

## Diagrama ER (Mermaid)

```mermaid
erDiagram
    %% AUTHENTICATION
    users {
        int id PK
        varchar openId UK
        text name
        varchar email
        varchar loginMethod
        enum role
        timestamp createdAt
        timestamp updatedAt
        timestamp lastSignedIn
    }

    %% DOMÍNIO 1 — CARDÁPIO
    categories {
        int id PK
        varchar slug UK
        varchar nome
        text descricao
        int ordemExibicao
        boolean ativo
        timestamp createdAt
        timestamp updatedAt
    }

    products {
        int id PK
        varchar slug UK
        varchar nome
        text descricao
        json ingredientes
        int precoBaseCentavos
        varchar imageKey
        int categoryId FK
        boolean disponivel
        int tempoPreparoMin
        boolean destaque
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
    }

    product_variants {
        int id PK
        int productId FK
        varchar nome
        int multiplicadorPreco
        boolean ativo
        timestamp createdAt
        timestamp updatedAt
    }

    addons {
        int id PK
        varchar nome
        enum tipo
        int precoCentavos
        boolean disponivel
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
    }

    product_addons {
        int productId FK
        int addonId FK
        boolean obrigatorio
        int maxSelecoes
        timestamp createdAt
    }

    %% DOMÍNIO 2 — PEDIDOS
    customers {
        int id PK
        int userId FK UK
        varchar nome
        varchar telefone
        varchar cpfHash
        timestamp dataNascimento
        int pontosFidelidade
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
    }

    addresses {
        int id PK
        int customerId FK
        varchar logradouro
        varchar numero
        varchar complemento
        varchar bairro
        varchar cidade
        varchar uf
        varchar cep
        text referencia
        boolean principal
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
    }

    orders {
        int id PK
        int customerId FK
        enum status
        int subtotalCentavos
        int taxaEntregaCentavos
        int descontoCentavos
        int totalCentavos
        int enderecoId FK
        text observacoes
        int couponId FK
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
    }

    order_items {
        int id PK
        int orderId FK
        int productId FK
        int variantId FK
        int quantity
        int precoUnitarioCentavos
        json addonsSelecionados
        text observacoes
        timestamp createdAt
    }

    order_status_history {
        int id PK
        int orderId FK
        enum statusAnterior
        enum statusNovo
        int changedBy FK
        text motivo
        timestamp createdAt
    }

    %% DOMÍNIO 3 — PROMOÇÕES
    coupons {
        int id PK
        varchar codigo UK
        enum tipo
        int valor
        timestamp validadeInicio
        timestamp validadeFim
        int usoMaximo
        int usoAtual
        int valorMinimoPedidoCentavos
        boolean ativo
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
    }

    coupon_orders {
        int couponId FK
        int orderId FK
        int descontoAplicadoCentavos
        timestamp createdAt
    }

    %% RELAÇÕES
    users ||--o{ customers : "1:1"
    users ||--o{ order_status_history : "1:N"
    categories ||--o{ products : "1:N"
    products ||--o{ product_variants : "1:N"
    products ||--o{ product_addons : "1:N"
    products ||--o{ order_items : "1:N"
    addons ||--o{ product_addons : "1:N"
    customers ||--o{ addresses : "1:N"
    customers ||--o{ orders : "1:N"
    addresses ||--o{ orders : "1:N"
    orders ||--o{ order_items : "1:N"
    orders ||--o{ order_status_history : "1:N"
    orders ||--o{ coupon_orders : "1:N"
    coupons ||--o{ orders : "1:N"
    coupons ||--o{ coupon_orders : "1:N"
```

---

## Tabelas Descritivas

### AUTHENTICATION

#### `users`
Tabela existente de autenticação OAuth (Manus). **NÃO MODIFICAR**.

| Coluna | Tipo | Constraints | Descrição |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Surrogate key |
| openId | VARCHAR(64) | NOT NULL, UNIQUE | Identificador OAuth Manus |
| name | TEXT | NULL | Nome do usuário |
| email | VARCHAR(320) | NULL | Email |
| loginMethod | VARCHAR(64) | NULL | Método de login |
| role | ENUM | NOT NULL, DEFAULT 'user' | user/admin |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updatedAt | TIMESTAMP | NOT NULL, ON UPDATE NOW() | Data de atualização |
| lastSignedIn | TIMESTAMP | NOT NULL, DEFAULT NOW() | Último login |

**Índices**: PRIMARY (id), UNIQUE (openId)

---

### DOMÍNIO 1 — CARDÁPIO

#### `categories`
Categorias do cardápio (pizzas, bebidas, sobremesas).

| Coluna | Tipo | Constraints | Descrição |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Surrogate key |
| slug | VARCHAR(100) | NOT NULL, UNIQUE | Slug para URL (ex: pizzas-classicas) |
| nome | VARCHAR(100) | NOT NULL | Nome da categoria |
| descricao | TEXT | NULL | Descrição |
| ordemExibicao | INT | NOT NULL, DEFAULT 0 | Ordem de exibição no menu |
| ativo | BOOLEAN | NOT NULL, DEFAULT TRUE | Categoria ativa/inativa |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updatedAt | TIMESTAMP | NOT NULL, ON UPDATE NOW() | Data de atualização |

**Índices**: PRIMARY (id), UNIQUE (slug)

---

#### `products`
Produtos do cardápio (pizzas, bebidas, etc.).

| Coluna | Tipo | Constraints | Descrição |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Surrogate key |
| slug | VARCHAR(100) | NOT NULL, UNIQUE | Slug para URL |
| nome | VARCHAR(200) | NOT NULL | Nome do produto |
| descricao | TEXT | NULL | Descrição |
| ingredientes | JSON | NOT NULL, DEFAULT [] | Array de ingredientes |
| precoBaseCentavos | INT | NOT NULL | Preço em centavos (R$ 29,90 = 2990) |
| imageKey | VARCHAR(500) | NULL | Chave do arquivo no S3 |
| categoryId | INT | NOT NULL, FK | FK para categories (onDelete: RESTRICT) |
| disponivel | BOOLEAN | NOT NULL, DEFAULT TRUE | Produto disponível |
| tempoPreparoMin | INT | NOT NULL, DEFAULT 20 | Tempo de preparo em minutos |
| destaque | BOOLEAN | NOT NULL, DEFAULT FALSE | Produto em destaque |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updatedAt | TIMESTAMP | NOT NULL, ON UPDATE NOW() | Data de atualização |
| deletedAt | TIMESTAMP | NULL | Soft delete |

**Índices**: PRIMARY (id), UNIQUE (slug), INDEX (categoryId), INDEX (disponivel)

---

#### `product_variants`
Variantes de tamanho (broto, médio, grande, família).

| Coluna | Tipo | Constraints | Descrição |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Surrogate key |
| productId | INT | NOT NULL, FK | FK para products (onDelete: CASCADE) |
| nome | VARCHAR(50) | NOT NULL | Nome da variante |
| multiplicadorPreco | INT | NOT NULL, DEFAULT 100 | Multiplicador (100 = 1x, 130 = 1.3x) |
| ativo | BOOLEAN | NOT NULL, DEFAULT TRUE | Variante ativa |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updatedAt | TIMESTAMP | NOT NULL, ON UPDATE NOW() | Data de atualização |

**Índices**: PRIMARY (id), INDEX (productId)

---

#### `addons`
Adicionais e bordas (queijo extra, borda recheada).

| Coluna | Tipo | Constraints | Descrição |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Surrogate key |
| nome | VARCHAR(100) | NOT NULL | Nome do adicional |
| tipo | ENUM | NOT NULL | borda/extra |
| precoCentavos | INT | NOT NULL | Preço em centavos |
| disponivel | BOOLEAN | NOT NULL, DEFAULT TRUE | Adicional disponível |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updatedAt | TIMESTAMP | NOT NULL, ON UPDATE NOW() | Data de atualização |
| deletedAt | TIMESTAMP | NULL | Soft delete |

**Índices**: PRIMARY (id)

---

#### `product_addons`
Relação N:N entre produtos e adicionais.

| Coluna | Tipo | Constraints | Descrição |
|---|---|---|---|
| productId | INT | NOT NULL, FK | FK para products (onDelete: CASCADE) |
| addonId | INT | NOT NULL, FK | FK para addons (onDelete: CASCADE) |
| obrigatorio | BOOLEAN | NOT NULL, DEFAULT FALSE | Seleção obrigatória |
| maxSelecoes | INT | NULL | Máximo de seleções |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |

**Índices**: UNIQUE (productId, addonId), INDEX (productId), INDEX (addonId)

---

### DOMÍNIO 2 — PEDIDOS

#### `customers`
Clientes vinculados ao OAuth users.

| Coluna | Tipo | Constraints | Descrição |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Surrogate key |
| userId | INT | NOT NULL, UNIQUE, FK | FK para users (onDelete: CASCADE) |
| nome | VARCHAR(200) | NOT NULL | Nome do cliente |
| telefone | VARCHAR(20) | NOT NULL | Telefone |
| cpfHash | VARCHAR(64) | NULL | Hash SHA-256 do CPF (LGPD) |
| dataNascimento | TIMESTAMP | NULL | Data de nascimento |
| pontosFidelidade | INT | NOT NULL, DEFAULT 0 | Pontos de fidelidade |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updatedAt | TIMESTAMP | NOT NULL, ON UPDATE NOW() | Data de atualização |
| deletedAt | TIMESTAMP | NULL | Soft delete |

**Índices**: PRIMARY (id), UNIQUE (userId), INDEX (cpfHash)

---

#### `addresses`
Endereços de entrega.

| Coluna | Tipo | Constraints | Descrição |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Surrogate key |
| customerId | INT | NOT NULL, FK | FK para customers (onDelete: CASCADE) |
| logradouro | VARCHAR(200) | NOT NULL | Logradouro |
| numero | VARCHAR(20) | NOT NULL | Número |
| complemento | VARCHAR(100) | NULL | Complemento |
| bairro | VARCHAR(100) | NOT NULL | Bairro |
| cidade | VARCHAR(100) | NOT NULL | Cidade |
| uf | VARCHAR(2) | NOT NULL | UF |
| cep | VARCHAR(8) | NOT NULL | CEP |
| referencia | TEXT | NULL | Referência |
| principal | BOOLEAN | NOT NULL, DEFAULT FALSE | Endereço principal |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updatedAt | TIMESTAMP | NOT NULL, ON UPDATE NOW() | Data de atualização |
| deletedAt | TIMESTAMP | NULL | Soft delete |

**Índices**: PRIMARY (id), INDEX (customerId), INDEX (principal)

---

#### `orders`
Pedidos.

| Coluna | Tipo | Constraints | Descrição |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Surrogate key |
| customerId | INT | NOT NULL, FK | FK para customers (onDelete: RESTRICT) |
| status | ENUM | NOT NULL, DEFAULT 'pending' | pending/confirmed/preparing/delivering/delivered/cancelled |
| subtotalCentavos | INT | NOT NULL, DEFAULT 0 | Subtotal em centavos |
| taxaEntregaCentavos | INT | NOT NULL, DEFAULT 0 | Taxa de entrega em centavos |
| descontoCentavos | INT | NOT NULL, DEFAULT 0 | Desconto em centavos |
| totalCentavos | INT | NOT NULL, DEFAULT 0 | Total em centavos |
| enderecoId | INT | FK | FK para addresses (onDelete: SET NULL) |
| observacoes | TEXT | NULL | Observações |
| couponId | INT | FK | FK para coupons (onDelete: SET NULL) |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updatedAt | TIMESTAMP | NOT NULL, ON UPDATE NOW() | Data de atualização |
| deletedAt | TIMESTAMP | NULL | Soft delete |

**Índices**: PRIMARY (id), INDEX (status), INDEX (customerId), INDEX (createdAt)

---

#### `order_items`
Itens do pedido.

| Coluna | Tipo | Constraints | Descrição |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Surrogate key |
| orderId | INT | NOT NULL, FK | FK para orders (onDelete: CASCADE) |
| productId | INT | NOT NULL, FK | FK para products (onDelete: RESTRICT) |
| variantId | INT | FK | FK para product_variants (onDelete: RESTRICT) |
| quantity | INT | NOT NULL, DEFAULT 1 | Quantidade |
| precoUnitarioCentavos | INT | NOT NULL | Snapshot do preço unitário |
| addonsSelecionados | JSON | NOT NULL, DEFAULT [] | Snapshot de adicionais |
| observacoes | TEXT | NULL | Observações |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |

**Índices**: PRIMARY (id), INDEX (orderId), INDEX (productId)

---

#### `order_status_history`
Histórico de mudanças de status do pedido.

| Coluna | Tipo | Constraints | Descrição |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Surrogate key |
| orderId | INT | NOT NULL, FK | FK para orders (onDelete: CASCADE) |
| statusAnterior | ENUM | NULL | Status anterior |
| statusNovo | ENUM | NOT NULL | Status novo |
| changedBy | INT | FK | FK para users (onDelete: SET NULL) |
| motivo | TEXT | NULL | Motivo da mudança |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data da mudança |

**Índices**: PRIMARY (id), INDEX (orderId), INDEX (createdAt)

---

### DOMÍNIO 3 — PROMOÇÕES

#### `coupons`
Cupons de desconto.

| Coluna | Tipo | Constraints | Descrição |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Surrogate key |
| codigo | VARCHAR(50) | NOT NULL, UNIQUE | Código do cupom |
| tipo | ENUM | NOT NULL | percentual/fixo |
| valor | INT | NOT NULL | Valor (basis points ou centavos) |
| validadeInicio | TIMESTAMP | NOT NULL | Início da validade |
| validadeFim | TIMESTAMP | NOT NULL | Fim da validade |
| usoMaximo | INT | NULL | Máximo de usos (null = ilimitado) |
| usoAtual | INT | NOT NULL, DEFAULT 0 | Usos atuais |
| valorMinimoPedidoCentavos | INT | NULL | Valor mínimo do pedido |
| ativo | BOOLEAN | NOT NULL, DEFAULT TRUE | Cupom ativo |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updatedAt | TIMESTAMP | NOT NULL, ON UPDATE NOW() | Data de atualização |
| deletedAt | TIMESTAMP | NULL | Soft delete |

**Índices**: PRIMARY (id), UNIQUE (codigo), INDEX (ativo)

---

#### `coupon_orders`
Histórico de aplicação de cupons em pedidos (N:N).

| Coluna | Tipo | Constraints | Descrição |
|---|---|---|---|
| couponId | INT | NOT NULL, FK | FK para coupons (onDelete: CASCADE) |
| orderId | INT | NOT NULL, FK | FK para orders (onDelete: CASCADE) |
| descontoAplicadoCentavos | INT | NOT NULL | Desconto aplicado (snapshot) |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de aplicação |

**Índices**: UNIQUE (couponId, orderId), INDEX (couponId), INDEX (orderId)

---

## Decisões de Design

### 1. Preços em Centavos (Integer vs Decimal)

**Decisão**: Preços armazenados como `INT` em centavos (R$ 29,90 = 2990).

**Justificativa**:
- Evita erros de arredondamento de ponto flutuante (ex: 0.1 + 0.2 ≠ 0.3 em JavaScript)
- Cálculos financeiros são exatos
- Facilita comparações e ordenações
- Padrão da indústria (Stripe, PayPal, etc.)

**Risco**: Desenvolvedores podem esquecer de converter centavos → reais na UI.

**Mitigação**: Documentar no README e usar helper functions (ex: `formatMoney(cents)`).

---

### 2. JSON em `addonsSelecionados` (Snapshot Histórico)

**Decisão**: `order_items.addonsSelecionados` como JSON array com snapshot de preços.

**Justificativa**:
- Se preço de adicional muda, pedidos antigos não devem ter preço alterado
- Estrutura flexível para expansão futura
- Evita joins complexos para reconstruir preço histórico

**Estrutura**:
```json
[
  { "addonId": 1, "nome": "Queijo Extra", "precoCentavos": 500 },
  { "addonId": 2, "nome": "Borda Recheada", "precoCentavos": 800 }
]
```

**Risco**: Dados inconsistentes se snapshot não for populado corretamente.

**Mitigação**: Validação no momento do pedido + testes unitários.

---

### 3. Soft Delete

**Decisão**: Soft delete em `products`, `addons`, `customers`, `orders`, `addresses`, `coupons`.

**Justificativa**:
- Manter histórico de clientes (compliance LGPD)
- Preservar dados para analytics
- Permite recuperação de erros
- Pedidos antigos não devem desaparecer

**Tabelas SEM soft delete**:
- `order_items` (cascada via orders)
- `product_addons` (cascada via products/addons)
- `coupon_orders` (cascada via coupons/orders)
- `users` (OAuth gerencia)

**Risco**: Tabelas crescem indefinidamente.

**Mitigação**: Job de cleanup periódico (ex: soft deletes > 2 anos → hard delete).

---

### 4. Hash de CPF (LGPD)

**Decisão**: CPF armazenado como `VARCHAR(64)` contendo hash SHA-256 com salt.

**Justificativa LGPD**:
- Art. 46 da LGPD: dados pessoais sensíveis devem ser tratados com segurança
- CPF é dado sensível (pode identificar pessoa física)
- Hash irreversível protege contra vazamento

**Implementação Recomendada**:
```typescript
import crypto from 'crypto';

const salt = crypto.randomBytes(16).toString('hex');
const cpfHash = crypto
  .createHash('sha256')
  .update(salt + cpf)
  .digest('hex');
```

**Risco**: Hash reversível com rainbow table se salt não for forte.

**Mitigação**:
- Salt aleatório por usuário (não global)
- Usar bcrypt/argon2 em vez de SHA-256 (mais seguro)
- Documentar processo em `docs/security/lgpd.md`

---

### 5. `order_status_history` Separado (Auditoria)

**Decisão**: Tabela separada para histórico de mudanças de status.

**Justificativa**:
- Obrigatório para suporte e resolução de disputas
- Rastreabilidade completa ("quem cancelou quando e por quê")
- Compliance com regulamentações de entregas

**Alternativa Rejeitada**: Log em arquivo ou serviço externo.
- Risco: Perda de dados, difícil de consultar, latência.

---

### 6. Multiplicador de Preço em Variantes

**Decisão**: `product_variants.multiplicadorPreco` como integer (100 = 1x, 130 = 1.3x).

**Justificativa**:
- Facilita manutenção: se preço base muda, variantes mudam automaticamente
- Menos dados para manter (não precisa atualizar preço de cada variante)

**Risco**: Se variante tem desconto próprio, multiplicador não funciona.

**Mitigação**: Se necessário no futuro, mudar para preço absoluto e migrar dados.

---

## Índices Criados

| Índice | Tabela | Colunas | Justificativa |
|---|---|---|---|
| `categories_slug_idx` | categories | slug (UNIQUE) | Slug único para URLs amigáveis |
| `products_slug_idx` | products | slug (UNIQUE) | Slug único para URLs amigáveis |
| `products_category_idx` | products | categoryId | Query: "todos os produtos de uma categoria" |
| `products_disponivel_idx` | products | disponivel | Query: "produtos disponíveis" |
| `product_variants_product_idx` | product_variants | productId | Query: "variantes de um produto" |
| `product_addons_product_idx` | product_addons | productId | Query: "adicionais de um produto" |
| `product_addons_addon_idx` | product_addons | addonId | Query: "produtos que têm este adicional" |
| `orders_status_idx` | orders | status | Query: "pedidos pendentes/confirmados" |
| `orders_customer_idx` | orders | customerId | Query: "histórico de pedidos de um cliente" |
| `orders_created_at_idx` | orders | createdAt | Query: "pedidos dos últimos 7 dias" |
| `order_items_order_idx` | order_items | orderId | Query: "itens de um pedido" |
| `order_items_product_idx` | order_items | productId | Query: "pedidos que contêm este produto" |
| `order_status_history_order_idx` | order_status_history | orderId | Query: "histórico de status de um pedido" |
| `order_status_history_created_at_idx` | order_status_history | createdAt | Query: "mudanças de status nas últimas 24h" |
| `addresses_customer_idx` | addresses | customerId | Query: "endereços de um cliente" |
| `addresses_principal_idx` | addresses | principal | Query: "endereço principal de um cliente" |
| `customers_user_id_idx` | customers | userId (UNIQUE) | Relação 1:1 com users (OAuth) |
| `customers_cpf_hash_idx` | customers | cpfHash | Query: "verificar duplicidade de CPF" |
| `coupons_codigo_idx` | coupons | codigo (UNIQUE) | Código único de cupom |
| `coupons_ativo_idx` | coupons | ativo | Query: "cupons ativos" |
| `coupon_orders_coupon_idx` | coupon_orders | couponId | Query: "pedidos que usaram este cupom" |
| `coupon_orders_order_idx` | coupon_orders | orderId | Query: "cupom usado neste pedido" |

---

## Estratégia de Soft Delete

### Tabelas com Soft Delete

| Tabela | Coluna | Justificativa |
|---|---|---|
| `products` | `deletedAt` | Manter histórico de produtos descontinuados |
| `addons` | `deletedAt` | Manter histórico de adicionais |
| `customers` | `deletedAt` | LGPD: direito ao esquecimento requer processo |
| `orders` | `deletedAt` | Manter histórico de pedidos (analytics, suporte) |
| `addresses` | `deletedAt` | Manter histórico de endereços |
| `coupons` | `deletedAt` | Manter histórico de promoções |

### Tabelas SEM Soft Delete

| Tabela | Justificativa |
|---|---|
| `users` | OAuth gerencia, fora do escopo do app |
| `categories` | Raramente deletadas, não há histórico relevante |
| `product_variants` | Cascada via products |
| `order_items` | Cascada via orders |
| `product_addons` | Cascada via products/addons |
| `order_status_history` | Audtoria imutável |
| `coupon_orders` | Cascada via coupons/orders |

### Query Pattern

```typescript
// Produtos ativos
const activeProducts = await db
  .select()
  .from(products)
  .where(isNull(products.deletedAt));

// Todos os produtos (incluindo deletados)
const allProducts = await db.select().from(products);
```

---

## Riscos LGPD Identificados

### 1. CPF Hash

**Risco**: Hash reversível com rainbow table se salt não for forte.

**Mitigação**:
- Salt aleatório por usuário (não global)
- Usar bcrypt/argon2 em vez de SHA-256
- Documentar processo em `docs/security/lgpd.md`
- Implementar direito ao esquecimento (soft delete + hard delete após período)

**Status**: ⚠️ **REQUER IMPLEMENTAÇÃO DETALHADA**

---

### 2. Soft Delete em Customers

**Risco**: Soft delete não cumpre direito ao esquecimento completo.

**Mitigação**:
- Processo de solicitação de exclusão via suporte
- Hard delete após período de retenção (ex: 30 dias)
- Documentar processo em `docs/security/lgpd.md`

**Status**: ⚠️ **REQUER POLÍTICA DE RETENÇÃO**

---

### 3. Histórico de Pedidos

**Risco**: Dados pessoais sensíveis (endereços, telefone) em histórico de pedidos.

**Mitigação**:
- Acesso restrito a administradores
- Anonimização após período (ex: 2 anos)
- Documentar política de retenção

**Status**: ⚠️ **REQUER POLÍTICA DE RETENÇÃO**

---

## Próximos Passos

1. **Configurar DATABASE_URL** em `.env` para gerar migração
2. **Executar `pnpm drizzle-kit generate`** para gerar SQL
3. **Testar migração** em banco de desenvolvimento
4. **Implementar LGPD policies** (CPF hash, retenção de dados)
5. **Criar helper functions** (formatMoney, formatCPF, etc.)
6. **Escrever testes** de integridade de dados

---

**Status**: Schema Drizzle completo, pronto para geração de migração.
**Próxima tarefa**: TAREFA 3 — ADRs (Architecture Decision Records)
