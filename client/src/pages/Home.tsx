import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Flame,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";

type Product = {
  id: string;
  category: "pizzas" | "bebidas";
  name: string;
  description: string;
  price: number;
  image: string;
  tag?: string;
  size?: string;
};

type CartItem = Product & { quantity: number };

const WHATSAPP_NUMBER = "5563991181347";

const products: Product[] = [
  {
    id: "4-queijos",
    category: "pizzas",
    name: "Pizza Napolitana de 4 Queijos",
    description: "Molho de tomate artesanal, muçarela, provolone, parmesão e gorgonzola.",
    price: 69.9,
    image: "/assets/pizza-4queijos.png",
  },
  {
    id: "calabresa",
    category: "pizzas",
    name: "Pizza Napolitana de Calabresa",
    description: "Molho de tomate artesanal, muçarela e calabresa fatiada.",
    price: 49.9,
    image: "/assets/pizza-calabresa.png",
  },
  {
    id: "lombo",
    category: "pizzas",
    name: "Pizza Napolitana de Lombo Defumado com Geleia de Abacaxi Picante",
    description: "Molho de tomate artesanal, muçarela, lombo defumado e geleia de abacaxi picante.",
    price: 69.9,
    image: "/assets/pizza-lombo.png",
  },
  {
    id: "margherita",
    category: "pizzas",
    name: "Pizza Napolitana de Margherita",
    description: "Molho de tomate artesanal, muçarela, tomate fresco e manjericão.",
    price: 49.9,
    image: "/assets/pizza-margherita.png",
  },
  {
    id: "frango-parmesao",
    category: "pizzas",
    name: "Pizza Napolitana de Frango com Parmesão",
    description: "Molho de tomate artesanal, muçarela, frango desfiado e parmesão.",
    price: 59.9,
    image: "/assets/pizza-frango.png",
  },
  {
    id: "pepperoni",
    category: "pizzas",
    name: "Pizza Napolitana de Pepperoni",
    description: "Molho de tomate artesanal, muçarela e pepperoni artesanal.",
    price: 59.9,
    image: "/assets/pizza-pepperoni.png",
  },
  {
    id: "frango-bacon-requeijao",
    category: "pizzas",
    name: "Pizza Napolitana de Frango, Bacon e Requeijão",
    description: "Molho de tomate artesanal, muçarela, frango desfiado, bacon e requeijão cremoso.",
    price: 69.9,
    image: "/assets/pizza-frango-bacon.png",
    tag: "Novidade",
  },
  {
    id: "h2o-limao",
    category: "bebidas",
    name: "H2O sabor limão",
    description: "",
    size: "1,5 L",
    price: 12,
    image: "/assets/drink-h2o-limao-premium.webp",
  },
  {
    id: "guarana-15",
    category: "bebidas",
    name: "Guaraná Antarctica",
    description: "",
    size: "1,5 L",
    price: 12,
    image: "/assets/drink-guarana-15-premium.webp",
  },
  {
    id: "guarana-2",
    category: "bebidas",
    name: "Guaraná Antarctica",
    description: "",
    size: "2 L",
    price: 15,
    image: "/assets/drink-guarana-2l-premium.webp",
  },
  {
    id: "pepsi-black",
    category: "bebidas",
    name: "Pepsi Black",
    description: "",
    size: "2 L",
    price: 14,
    image: "/assets/drink-pepsi-black-premium.webp",
  },
  {
    id: "coca-cola",
    category: "bebidas",
    name: "Coca-Cola",
    description: "",
    size: "2 L",
    price: 17,
    image: "/assets/drink-coca-cola-premium.webp",
  },
  {
    id: "coca-cola-zero",
    category: "bebidas",
    name: "Coca-Cola Zero",
    description: "",
    size: "2 L",
    price: 17,
    image: "/assets/drink-coca-zero-premium.webp",
  },
  {
    id: "suco-laranja",
    category: "bebidas",
    name: "Suco natural de laranja",
    description: "",
    size: "500 ml",
    price: 12,
    image: "/assets/drink-orange-juice-premium.webp",
  },
];

const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const initialCart: CartItem[] = [];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [activeSection, setActiveSection] = useState<"pizzas" | "bebidas">("pizzas");
  const [cartOpen, setCartOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const openOrder = () => {
    if (window.innerWidth <= 860) {
      setCartOpen(true);
      return;
    }
    document.querySelector(".desktop-order-card")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setSent(false);
  };

  const changeQuantity = (id: string, delta: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
    setSent(false);
  };

  const removeItem = (id: string) => {
    setCart((current) => current.filter((item) => item.id !== id));
    setSent(false);
  };

  const orderMessage = useMemo(() => {
    const lines = [
      "Olá! Gostaria de fazer um pedido na VITTA Pizzaria Napolitana.",
      "",
      "*Meu pedido:*",
      ...cart.map(
        (item) => `• ${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ""} — ${money(item.price * item.quantity)}`,
      ),
      "",
      `*Total: ${money(total)}*`,
    ];
    return lines.join("\n");
  }, [cart, total]);

  const sendToWhatsApp = async () => {
    if (cart.length === 0) return;
    try {
      await navigator.clipboard?.writeText(orderMessage);
    } catch {
      // O link continua funcionando mesmo quando a área de transferência está bloqueada.
    }

    // Tenta usar Web Share API para enviar direto sem abrir aba
    if (navigator.share && WHATSAPP_NUMBER) {
      try {
        await navigator.share({
          title: 'Pedido VITTA Pizzaria',
          text: orderMessage,
        });
        setSent(true);
        return;
      } catch (error) {
        // Se o usuário cancelar ou Web Share não funcionar, fallback para link
        console.log('Web Share não suportado ou cancelado, usando fallback');
      }
    }

    // Fallback: abre o link do WhatsApp
    const destination = WHATSAPP_NUMBER
      ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(orderMessage)}`;
    window.open(destination, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const visibleProducts = products.filter((product) => product.category === activeSection);

  return (
    <div className="vitta-page">
      <div className="grain" aria-hidden="true" />
      <header className="site-header">
        <div className="header-inner">
          <a href="#top" className="mini-brand" aria-label="VITTA Pizzaria Napolitana">
            <span className="mini-brand-mark"><Flame size={15} strokeWidth={2.5} /></span>
            <span>VITTA</span>
          </a>
          <nav className="top-nav" aria-label="Navegação principal">
            <a href="#menu-content" onClick={() => setActiveSection("pizzas")}>Pizzas</a>
            <a href="#menu-content" onClick={() => setActiveSection("bebidas")}>Bebidas</a>
          </nav>
          <button className="header-order" onClick={openOrder} aria-label="Abrir meu pedido">
            <ShoppingBag size={17} />
            <span>Meu pedido</span>
            {totalItems > 0 && <b>{totalItems}</b>}
          </button>
        </div>
      </header>

      <main id="top" className="site-main">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Sabores disponíveis <span /></div>
            <img className="brand-logo" src="/assets/vitta-logo-transparent.png" alt="VITTA Pizzaria Napolitana" decoding="async" fetchPriority="high" />
            <h1 id="hero-title">O sabor que<br /><em>acolhe.</em></h1>
            <p className="hero-description">Pizza napolitana artesanal, fermentação natural e ingredientes escolhidos para uma experiência feita com calma.</p>
            <a className="hero-cta" href="#menu-content" onClick={() => setActiveSection("pizzas")}>
              Escolher meu pedido <ArrowRight size={17} />
            </a>
            <div className="hero-details">
              <span><UtensilsCrossed size={15} /> Massa napolitana</span>
              <span><Flame size={15} /> Forno de alta temperatura</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-ring" aria-hidden="true" />
            <img src="/assets/pizza-hero-restored.png" alt="Pizza napolitana com manjericão" decoding="async" fetchPriority="high" />
            <div className="hero-stamp"><span>VITTA</span><strong>NAPOLITANA</strong><small>feito com amor</small></div>
          </div>
        </section>

        <section className="menu-section" aria-labelledby="menu-title">
          <div className="section-heading">
            <div>
              <div className="eyebrow eyebrow-left"><span /> Cardápio <span /></div>
              <h2 id="menu-title">Escolha sua <em>VITTA</em></h2>
            </div>
            <p>Selecione seus sabores e envie o pedido pronto pelo WhatsApp.</p>
          </div>

          <div className="section-tabs" role="tablist" aria-label="Categorias do cardápio">
            <button
              className={activeSection === "pizzas" ? "active" : ""}
              onClick={() => setActiveSection("pizzas")}
              role="tab"
              aria-selected={activeSection === "pizzas"}
            >
              <span>01</span> Pizzas
            </button>
            <button
              className={activeSection === "bebidas" ? "active" : ""}
              onClick={() => setActiveSection("bebidas")}
              role="tab"
              aria-selected={activeSection === "bebidas"}
            >
              <span>02</span> Bebidas
            </button>
          </div>

          <div className="menu-layout">
            <div className="product-column" id="menu-content">
              <div className="category-caption">
                <span className="category-number">{activeSection === "pizzas" ? "01" : "02"}</span>
                <div>
                  <h3>{activeSection === "pizzas" ? "Pizzas napolitanas" : "Bebidas"}</h3>
                  <p>{activeSection === "pizzas" ? "Bordas aeradas, pontos tostados e ingredientes em equilíbrio." : "Acompanhamentos que completam sua experiência."}</p>
                </div>
              </div>

              <div className={`product-list ${activeSection === "bebidas" ? "drink-list" : ""}`}>
                {visibleProducts.map((product, index) => (
                  <article className="product-card" key={product.id}>
                    <div className="product-index">{String(index + 1).padStart(2, "0")}</div>
                    <div className="product-image-wrap">
                      <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
                      {product.tag && <span className="product-tag">{product.tag}</span>}
                    </div>
                    <div className="product-info">
                      <div className="product-title-line">
                        <h4>{product.name}</h4>
                        {product.size && <span className="size-pill">{product.size}</span>}
                      </div>
                      {product.description && <p>{product.description}</p>}
                    </div>
                    <div className="product-action">
                      <strong>{money(product.price)}</strong>
                      <button className="add-button" onClick={() => addToCart(product)} aria-label={`Adicionar ${product.name}`}>
                        <Plus size={17} /> <span>Adicionar</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="desktop-order-card" aria-label="Resumo do pedido">
              <OrderSummary
                cart={cart}
                total={total}
                totalItems={totalItems}
                changeQuantity={changeQuantity}
                removeItem={removeItem}
                sendToWhatsApp={sendToWhatsApp}
                sent={sent}
                onClose={() => setCartOpen(false)}
                compact
              />
            </aside>
          </div>
        </section>

        <section className="closing-section">
          <div className="closing-line" />
          <p>Feita com amor, para você.</p>
          <div className="closing-line" />
        </section>
      </main>

      {totalItems > 0 && (
        <button className="mobile-cart-bar" onClick={() => setCartOpen(true)} aria-label="Abrir meu pedido">
          <span className="mobile-cart-count">{totalItems}</span>
          <span>Ver meu pedido</span>
          <strong>{money(total)}</strong>
          <ChevronUp size={18} />
        </button>
      )}

      {cartOpen && (
        <div className="cart-overlay" role="presentation" onClick={() => setCartOpen(false)}>
          <div className="mobile-order-sheet" role="dialog" aria-modal="true" aria-label="Meu pedido" onClick={(event) => event.stopPropagation()}>
            <div className="sheet-handle" />
            <button className="sheet-close" onClick={() => setCartOpen(false)} aria-label="Fechar pedido"><X size={18} /></button>
            <OrderSummary
              cart={cart}
              total={total}
              totalItems={totalItems}
              changeQuantity={changeQuantity}
              removeItem={removeItem}
              sendToWhatsApp={sendToWhatsApp}
              sent={sent}
              onClose={() => setCartOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function OrderSummary({
  cart,
  total,
  totalItems,
  changeQuantity,
  removeItem,
  sendToWhatsApp,
  sent,
  compact = false,
}: {
  cart: CartItem[];
  total: number;
  totalItems: number;
  changeQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  sendToWhatsApp: () => void;
  sent: boolean;
  onClose?: () => void;
  compact?: boolean;
}) {
  return (
    <div className={`order-summary ${compact ? "order-summary-compact" : ""}`}>
      <div className="order-heading">
        <div>
          <span className="order-kicker">Seu pedido</span>
          <h3>À mesa, <em>VITTA.</em></h3>
        </div>
        <span className="order-count" aria-live="polite">{totalItems} {totalItems === 1 ? "item" : "itens"}</span>
      </div>

      {cart.length === 0 ? (
        <div className="empty-order">
          <div className="empty-icon"><ShoppingBag size={22} /></div>
          <p>Seu pedido começa<br />com uma boa escolha.</p>
          <small>Adicione uma pizza ou bebida ao lado.</small>
        </div>
      ) : (
        <>
          <div className="order-items">
            {cart.map((item) => (
              <div className="order-item" key={item.id}>
                <div className="order-item-copy">
                  <strong>{item.name}</strong>
                  <span>{item.size || "Pizza napolitana"}</span>
                </div>
                <div className="order-item-controls">
                  <button onClick={() => changeQuantity(item.id, -1)} aria-label={`Diminuir ${item.name}`}><Minus size={13} /></button>
                  <b>{item.quantity}</b>
                  <button onClick={() => changeQuantity(item.id, 1)} aria-label={`Aumentar ${item.name}`}><Plus size={13} /></button>
                </div>
                <strong className="order-item-price">{money(item.price * item.quantity)}</strong>
                <button className="remove-item" onClick={() => removeItem(item.id)} aria-label={`Remover ${item.name}`}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <div className="order-total"><span>Total do pedido</span><strong>{money(total)}</strong></div>
          <button className="whatsapp-button" onClick={sendToWhatsApp}>
            {sent ? <Check size={18} /> : <span className="whatsapp-dot" />}
            {sent ? "Pedido copiado — abrir novamente" : "Enviar pedido pelo WhatsApp"}
          </button>
          {sent && <p className="sent-note">A mensagem foi copiada e o WhatsApp foi aberto para você enviar.</p>}
        </>
      )}
    </div>
  );
}
