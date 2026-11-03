-- Migration: 0001_initial_vitta_schema
-- Description: Schema completo do MVP Vitta Pizzaria Napolitana
-- Database: MySQL
-- ORM: Drizzle
-- Date: 2026-10-28

-- ============================================================================
-- DOMÍNIO 1 — CARDÁPIO
-- ============================================================================

-- Categorias do cardápio
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `nome` VARCHAR(100) NOT NULL,
  `descricao` TEXT,
  `ordemExibicao` INT NOT NULL DEFAULT 0,
  `ativo` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `categories_slug_idx` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Produtos do cardápio
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `nome` VARCHAR(200) NOT NULL,
  `descricao` TEXT,
  `ingredientes` JSON NOT NULL DEFAULT ('[]'),
  `precoBaseCentavos` INT NOT NULL,
  `imageKey` VARCHAR(500),
  `categoryId` INT NOT NULL,
  `disponivel` BOOLEAN NOT NULL DEFAULT TRUE,
  `tempoPreparoMin` INT NOT NULL DEFAULT 20,
  `destaque` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` TIMESTAMP NULL,
  INDEX `products_slug_idx` (`slug`),
  INDEX `products_category_idx` (`categoryId`),
  INDEX `products_disponivel_idx` (`disponivel`),
  FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Variantes de tamanho (broto, médio, grande, família)
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `productId` INT NOT NULL,
  `nome` VARCHAR(50) NOT NULL,
  `multiplicadorPreco` INT NOT NULL DEFAULT 100,
  `ativo` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `product_variants_product_idx` (`productId`),
  FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adicionais e bordas
CREATE TABLE IF NOT EXISTS `addons` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL,
  `tipo` ENUM('borda', 'extra') NOT NULL,
  `precoCentavos` INT NOT NULL,
  `disponivel` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Relação N:N entre produtos e adicionais
CREATE TABLE IF NOT EXISTS `product_addons` (
  `productId` INT NOT NULL,
  `addonId` INT NOT NULL,
  `obrigatorio` BOOLEAN NOT NULL DEFAULT FALSE,
  `maxSelecoes` INT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`productId`, `addonId`),
  INDEX `product_addons_product_idx` (`productId`),
  INDEX `product_addons_addon_idx` (`addonId`),
  FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`addonId`) REFERENCES `addons`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DOMÍNIO 2 — PEDIDOS
-- ============================================================================

-- Clientes (complementar ao OAuth users)
CREATE TABLE IF NOT EXISTS `customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL UNIQUE,
  `nome` VARCHAR(200) NOT NULL,
  `telefone` VARCHAR(20) NOT NULL,
  `cpfHash` VARCHAR(64),
  `dataNascimento` TIMESTAMP NULL,
  `pontosFidelidade` INT NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` TIMESTAMP NULL,
  INDEX `customers_user_id_idx` (`userId`),
  INDEX `customers_cpf_hash_idx` (`cpfHash`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Endereços de entrega
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customerId` INT NOT NULL,
  `logradouro` VARCHAR(200) NOT NULL,
  `numero` VARCHAR(20) NOT NULL,
  `complemento` VARCHAR(100),
  `bairro` VARCHAR(100) NOT NULL,
  `cidade` VARCHAR(100) NOT NULL,
  `uf` VARCHAR(2) NOT NULL,
  `cep` VARCHAR(8) NOT NULL,
  `referencia` TEXT,
  `principal` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` TIMESTAMP NULL,
  INDEX `addresses_customer_idx` (`customerId`),
  INDEX `addresses_principal_idx` (`principal`),
  FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pedidos
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customerId` INT NOT NULL,
  `status` ENUM('pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  `subtotalCentavos` INT NOT NULL DEFAULT 0,
  `taxaEntregaCentavos` INT NOT NULL DEFAULT 0,
  `descontoCentavos` INT NOT NULL DEFAULT 0,
  `totalCentavos` INT NOT NULL DEFAULT 0,
  `enderecoId` INT,
  `observacoes` TEXT,
  `couponId` INT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` TIMESTAMP NULL,
  INDEX `orders_status_idx` (`status`),
  INDEX `orders_customer_idx` (`customerId`),
  INDEX `orders_created_at_idx` (`createdAt`),
  FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`enderecoId`) REFERENCES `addresses`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`couponId`) REFERENCES `coupons`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Itens do pedido
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderId` INT NOT NULL,
  `productId` INT NOT NULL,
  `variantId` INT,
  `quantity` INT NOT NULL DEFAULT 1,
  `precoUnitarioCentavos` INT NOT NULL,
  `addonsSelecionados` JSON NOT NULL DEFAULT ('[]'),
  `observacoes` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `order_items_order_idx` (`orderId`),
  INDEX `order_items_product_idx` (`productId`),
  FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`variantId`) REFERENCES `product_variants`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Histórico de mudanças de status do pedido
CREATE TABLE IF NOT EXISTS `order_status_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderId` INT NOT NULL,
  `statusAnterior` ENUM('pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'),
  `statusNovo` ENUM('pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled') NOT NULL,
  `changedBy` INT,
  `motivo` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `order_status_history_order_idx` (`orderId`),
  INDEX `order_status_history_created_at_idx` (`createdAt`),
  FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`changedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DOMÍNIO 3 — PROMOÇÕES
-- ============================================================================

-- Cupons de desconto
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo` VARCHAR(50) NOT NULL UNIQUE,
  `tipo` ENUM('percentual', 'fixo') NOT NULL,
  `valor` INT NOT NULL,
  `validadeInicio` TIMESTAMP NOT NULL,
  `validadeFim` TIMESTAMP NOT NULL,
  `usoMaximo` INT,
  `usoAtual` INT NOT NULL DEFAULT 0,
  `valorMinimoPedidoCentavos` INT,
  `ativo` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` TIMESTAMP NULL,
  INDEX `coupons_codigo_idx` (`codigo`),
  INDEX `coupons_ativo_idx` (`ativo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Histórico de aplicação de cupons em pedidos (N:N)
CREATE TABLE IF NOT EXISTS `coupon_orders` (
  `couponId` INT NOT NULL,
  `orderId` INT NOT NULL,
  `descontoAplicadoCentavos` INT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`couponId`, `orderId`),
  INDEX `coupon_orders_coupon_idx` (`couponId`),
  INDEX `coupon_orders_order_idx` (`orderId`),
  FOREIGN KEY (`couponId`) REFERENCES `coupons`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
