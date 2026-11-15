import React, { useEffect, useMemo, useState } from "react";
import { catalogCategories, products } from "./catalog.js";

const formatPrice = (price) => `₹${price.toLocaleString("en-IN")}`;
const WHATSAPP_NUMBER = "918688492212";

function getWhatsAppOrderLink(cart) {
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const lines = [
    "Hello Loom & Leaf! I'd like to place this order:",
    "",
    ...cart.map((item) => `• ${item.name} | Size: ${item.size} | Qty: ${item.quantity} | ${formatPrice(item.price)} each | ${formatPrice(item.price * item.quantity)}`),
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    "Please confirm availability, delivery charges, and payment details.",
    "I understand this is an order request; payment has not been processed online.",
  ];

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function Icon({ name }) {
  const paths = {
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    heart: <path d="M20.8 8.6c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10a4.6 4.6 0 0 1 8.8-2.2 4.6 4.6 0 0 1 8.8 2.2Z" />,
    chevron: <path d="m9 18 6-6-6-6" />,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function readCart() {
  try {
    const stored = JSON.parse(localStorage.getItem("loom-leaf-cart") || "[]");
    if (!Array.isArray(stored)) return [];
    return stored.filter((item) =>
      products.some((product) => product.key === item.key && product.sizes.includes(item.size))
      && Number.isInteger(item.quantity)
      && item.quantity > 0,
    );
  } catch (error) {
    console.error("Could not read the saved shopping bag.", error);
    return [];
  }
}

function Header({ category, setCategory, search, setSearch, itemCount, openBag, showCatalog }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function chooseCategory(id) {
    setCategory(id);
    setMenuOpen(false);
    showCatalog();
  }

  return (
    <>
      <div className="announcement">
        <span>Little outfits for the big moments</span>
        <i>✦</i>
        <span>Free delivery on orders over ₹1,999</span>
      </div>
      <header className="header">
        <button className="mobile-menu icon-button" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name="menu" />
        </button>
        <button className="wordmark" type="button" onClick={() => chooseCategory("all")} aria-label="Loom and Leaf home">
          <span className="brand-emblem">L<span>+</span></span>
          <span>loom <i>&amp;</i> leaf</span>
        </button>
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Shop departments">
          {catalogCategories.map((item) => (
            <button type="button" key={item.id} data-category={item.id} className={category === item.id ? "nav-link active" : "nav-link"} onClick={() => chooseCategory(item.id)}>
              {item.label}
            </button>
          ))}
          <a className="nav-link" href="#our-story" onClick={() => setMenuOpen(false)}>Our story</a>
        </nav>
        <div className="header-tools">
          <label className="search-field">
            <Icon name="search" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search outfits" aria-label="Search outfits" />
          </label>
          <button type="button" className="bag-button icon-button" aria-label={`Open bag, ${itemCount} items`} onClick={openBag}>
            <Icon name="bag" /><span className="bag-count">{itemCount}</span>
          </button>
        </div>
      </header>
    </>
  );
}

function ProductCard({ product, onOpen, onAdd }) {
  return (
    <article className="product-card">
      <button className="product-picture" type="button" onClick={() => onOpen(product)} aria-label={`View ${product.name}`}>
        <img src={product.image.src} alt={product.image.alt} loading="lazy" />
        <span className="image-count">{product.images.length} {product.images.length === 1 ? "view" : "views"}</span>
        <span className="image-zoom">View details <Icon name="arrow" /></span>
      </button>
      <div className="product-card-info">
        <div className="product-card-copy">
          <span className="product-category">{product.label}</span>
          <button className="product-title" type="button" onClick={() => onOpen(product)}>{product.name}</button>
          <p>{product.description}</p>
        </div>
        <div className="product-price">
          <strong>{formatPrice(product.price)}</strong>
          <span>Sample price</span>
        </div>
      </div>
      <button type="button" className="card-add" onClick={() => onAdd(product)}>Quick add <span>+</span></button>
    </article>
  );
}

function ProductGrid({ items, onOpen, onAdd, emptyText }) {
  if (!items.length) return <div className="empty-results"><span>✿</span><h3>No outfits found</h3><p>{emptyText}</p></div>;
  return (
    <div className="product-grid">
      {items.map((product) => <ProductCard key={product.key} product={product} onOpen={onOpen} onAdd={onAdd} />)}
    </div>
  );
}

function Hero({ product, onShop }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow"><span /> LITTLE CELEBRATIONS, BIG MEMORIES</p>
        <h1>Little looks.<br /><em>Big moments.</em></h1>
        <p>Colorful festive wear for little ones, family photos, and all the happy memories in between.</p>
        <button className="button button-dark" type="button" onClick={onShop}>Shop kidswear <Icon name="arrow" /></button>
        <div className="hero-note"><span>✳</span> A little extra magic for their special day</div>
      </div>
      <button className="hero-photo" type="button" onClick={() => product && window.dispatchEvent(new CustomEvent("open-product", { detail: product.key }))} aria-label="View featured family outfit">
        {product && <img src={product.image.src} alt={product.image.alt} fetchPriority="high" />}
        <span className="hero-badge">THE<br />FESTIVE<br />EDIT</span>
        <span className="hero-caption">Made for being together <b>↗</b></span>
      </button>
      <span className="hero-side-note">A LITTLE LOOK FOR A BIG DAY</span>
    </section>
  );
}

function Storefront({ visibleProducts, category, setCategory, onOpen, onAdd, search }) {
  const [sortBy, setSortBy] = useState("featured");
  const categoryName = catalogCategories.find((item) => item.id === category)?.label ?? "All kidswear";
  const sortedProducts = useMemo(() => {
    const sorted = [...visibleProducts];
    if (sortBy === "price-low") sorted.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") sorted.sort((a, b) => b.price - a.price);
    if (sortBy === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [visibleProducts, sortBy]);

  return (
    <>
      <Hero product={products.find((item) => item.category === "family") ?? products[0]} onShop={() => document.querySelector("#collection")?.scrollIntoView({ behavior: "smooth" })} />
      <div className="trust-strip">
        <span><i>✿</i> Made for little celebrations</span>
        <span><i>✿</i> Colorful, joyful details</span>
        <span><i>✿</i> Thoughtful family moments</span>
        <span><i>✿</i> Sizes from 1 to 8 years</span>
      </div>
      <main className="collection section-shell" id="collection">
        <div className="collection-heading">
          <div>
            <p className="eyebrow">DRESS-UP DAYS, AND EVERY DAY AFTER</p>
            <h2>{search ? "Search results" : categoryName}</h2>
            <p className="collection-subtitle">{visibleProducts.length} little looks to love</p>
          </div>
          <label className="sort-field">Sort by
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort products">
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
        <div className="department-tabs" aria-label="Filter by collection">
          {catalogCategories.map((item) => (
            <button type="button" key={item.id} data-category={item.id} className={category === item.id ? "department-tab active" : "department-tab"} onClick={() => setCategory(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <ProductGrid items={sortedProducts} onOpen={onOpen} onAdd={onAdd} emptyText="Try another search or choose a different kidswear collection." />
      </main>
      <section className="story" id="our-story">
        <div className="story-mark">L<span>+</span></div>
        <div><p className="eyebrow">A LITTLE ABOUT US</p><h2>Outfits they’ll remember.<br /><em>Moments you’ll keep.</em></h2></div>
        <p>We bring together joyful kidswear and family looks for birthdays, festivals, and all the little moments worth dressing up for.</p>
      </section>
    </>
  );
}

function ProductDetail({ product, onBack, onOpen, onAdd }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const related = products.filter((item) => item.category === product.category && item.key !== product.key).slice(0, 4);

  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize("");
    setQuantity(1);
  }, [product.key]);

  function addToBag() {
    if (!selectedSize) {
      document.querySelector(".size-error")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      return;
    }
    onAdd(product, selectedSize, quantity);
  }

  return (
    <main className="detail-page section-shell">
      <div className="breadcrumbs">
        <button type="button" onClick={onBack}>Home</button><Icon name="chevron" /><button type="button" onClick={onBack}>{product.label}</button><Icon name="chevron" /><span>{product.name}</span>
      </div>
      <div className="detail-layout">
        <div className={`gallery ${product.images.length === 1 ? "single-image" : ""}`}>
          {product.images.length > 1 && <div className="gallery-thumbnails" aria-label="Product images">
            {product.images.map((image, index) => (
              <button type="button" key={image.src} className={selectedImage === index ? "thumbnail active" : "thumbnail"} onClick={() => setSelectedImage(index)} aria-label={`View product image ${index + 1}`}>
                <img src={image.src} alt="" />
              </button>
            ))}
          </div>}
          <div className="gallery-main">
            <img src={product.images[selectedImage]?.src ?? product.image.src} alt={`${product.name}, view ${selectedImage + 1}`} />
            <span className="gallery-count">{selectedImage + 1} / {product.images.length}</span>
          </div>
        </div>
        <section className="product-buy">
          <button className="back-link" type="button" onClick={onBack}>← Back to kidswear</button>
          <p className="eyebrow">{product.label.toUpperCase()} · LOOM &amp; LEAF</p>
          <h1>{product.name}</h1>
          <p className="rating"><span>★★★★★</span> <b>New arrival</b> <i>·</i> Made for little celebrations</p>
          <div className="detail-price"><strong>{formatPrice(product.price)}</strong><span>Sample price</span></div>
          <p className="tax-note">Inclusive of all taxes</p>
          <p className="detail-description">{product.description} Choose their size below to add this look to your bag.</p>
          <div className="size-heading"><strong>Choose size</strong><span>Age guide</span></div>
          <div className="size-options">
            {product.sizes.map((size) => (
              <button key={size} type="button" className={selectedSize === size ? "size-option selected" : "size-option"} onClick={() => setSelectedSize(size)}>{size}</button>
            ))}
          </div>
          {!selectedSize && <p className="size-error">Please choose a size to continue.</p>}
          <div className="purchase-row">
            <div className="quantity-picker" aria-label="Quantity">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">−</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">+</button>
            </div>
            <button className="button button-dark add-to-bag" type="button" onClick={addToBag}>Add to bag <Icon name="bag" /></button>
            <button className="wishlist-button icon-button" type="button" aria-label="Save to wishlist" onClick={(event) => event.currentTarget.classList.toggle("saved")}><Icon name="heart" /></button>
          </div>
          <div className="delivery-note"><span>✧</span><p><strong>A little something special</strong><br />Easy 7-day returns · Packed with care</p></div>
          <details className="detail-disclosure"><summary>About this outfit</summary><p>{product.description} Images in this gallery are from the same product collection.</p></details>
          <details className="detail-disclosure"><summary>Size &amp; fit</summary><p>Choose an age range that matches your child. If between sizes, consider sizing up.</p></details>
        </section>
      </div>
      {related.length > 0 && <section className="related-products"><div className="related-title"><div><p className="eyebrow">MORE LITTLE LOOKS</p><h2>You may also love</h2></div><button type="button" className="text-button" onClick={onBack}>View the collection <Icon name="arrow" /></button></div><ProductGrid items={related} onOpen={onOpen} onAdd={onAdd} emptyText="" /></section>}
    </main>
  );
}

function CartDrawer({ open, onClose, cart, onQuantity, onRemove }) {
  if (!open) return null;
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="drawer-layer" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="drawer-header"><div><p className="eyebrow">YOUR LITTLE PICKS</p><h2 id="cart-title">Shopping bag <span>({count})</span></h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close shopping bag"><Icon name="close" /></button></div>
        {cart.length === 0 ? <div className="empty-bag"><span>✿</span><h3>Your bag is taking a little breather.</h3><p>Find a special outfit for their next big day.</p><button className="button button-dark" type="button" onClick={onClose}>Explore kidswear</button></div> : (
          <>
            <div className="drawer-items">{cart.map((item) => (
              <article className="drawer-item" key={`${item.key}-${item.size}`}>
                <img src={item.image} alt={item.name} />
                <div className="drawer-item-copy"><span>{item.label}</span><h3>{item.name}</h3><p>Size: {item.size}</p><strong>{formatPrice(item.price)}</strong><div className="line-quantity"><button type="button" onClick={() => onQuantity(item, -1)} aria-label="Decrease quantity">−</button><span>{item.quantity}</span><button type="button" onClick={() => onQuantity(item, 1)} aria-label="Increase quantity">+</button><button type="button" className="remove-item" onClick={() => onRemove(item)}>Remove</button></div></div>
              </article>
            ))}</div>
            <div className="drawer-footer"><div className="subtotal"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><p>Shipping and payment are confirmed with you on WhatsApp. No payment is processed on this website.</p><a className="button button-dark checkout-button" href={getWhatsAppOrderLink(cart)} target="_blank" rel="noopener noreferrer">Send order on WhatsApp <Icon name="arrow" /></a><small className="whatsapp-note">WhatsApp opens a draft. Tap Send there to place your order.</small></div>
          </>
        )}
      </aside>
    </div>
  );
}

function Footer({ onNavigateCategory, onNavigateStory }) {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand-column">
          <a className="footer-brand" href="#">loom <i>&amp;</i> leaf</a>
          <p>For little ones and big celebrations.</p>
        </div>
        <div className="footer-links">
          <h2>Shop</h2>
          {catalogCategories.map((item) => (
            <button type="button" key={item.id} onClick={() => onNavigateCategory(item.id)}>{item.label}</button>
          ))}
        </div>
        <div className="footer-links">
          <h2>Discover</h2>
          <button type="button" onClick={() => onNavigateCategory("all")}>All kidswear</button>
          <button type="button" onClick={onNavigateStory}>Our story</button>
          <button type="button" onClick={onNavigateStory}>About Loom &amp; Leaf</button>
        </div>
        <div className="footer-links">
          <h2>Need a hand?</h2>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Loom & Leaf! I have a question about your kidswear.")}`} target="_blank" rel="noopener noreferrer">Chat with us on WhatsApp</a>
          <button type="button" onClick={() => onNavigateCategory("all")}>Shopping help</button>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Loom &amp; Leaf</span>
        <span>Orders and payment are confirmed with you on WhatsApp.</span>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">WhatsApp support ↗</a>
      </div>
    </footer>
  );
}

export default function App() {
  const initialProductKey = new URLSearchParams(window.location.search).get("product");
  const [selectedProduct, setSelectedProduct] = useState(products.find((item) => item.key === initialProductKey) ?? null);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickAddProduct, setQuickAddProduct] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("loom-leaf-cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Could not save the shopping bag.", error);
    }
  }, [cart]);

  useEffect(() => {
    const onPopState = () => setSelectedProduct(products.find((item) => item.key === new URLSearchParams(window.location.search).get("product")) ?? null);
    const onOpenProduct = (event) => openProduct(products.find((item) => item.key === event.detail));
    window.addEventListener("popstate", onPopState);
    window.addEventListener("open-product", onOpenProduct);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("open-product", onOpenProduct);
    };
  });

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${product.name} ${product.label} ${product.description}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  }), [category, search]);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  function updateSearch(value) {
    setSearch(value);
    if (value.trim()) setCategory("all");
  }

  function openProduct(product) {
    if (!product) return;
    setSelectedProduct(product);
    setCategory(product.category);
    setSearch("");
    setQuickAddProduct(null);
    const url = new URL(window.location.href);
    url.searchParams.set("product", product.key);
    window.history.pushState({ product: product.key }, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showCatalog() {
    setSelectedProduct(null);
    setQuickAddProduct(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("product");
    window.history.pushState({}, "", url);
  }

  function navigateToCategory(categoryId) {
    setCategory(categoryId);
    setSearch("");
    showCatalog();
    window.setTimeout(() => document.querySelector("#collection")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  function navigateToStory() {
    showCatalog();
    window.setTimeout(() => document.querySelector("#our-story")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  function addToCart(product, size, quantity = 1) {
    if (!size) {
      setQuickAddProduct(product);
      return;
    }
    setCart((current) => {
      const existing = current.find((item) => item.key === product.key && item.size === size);
      if (existing) return current.map((item) => item === existing ? { ...item, quantity: item.quantity + quantity } : item);
      return [...current, {
        key: product.key,
        name: product.name,
        label: product.label,
        price: product.price,
        size,
        quantity,
        image: product.image.src,
      }];
    });
    setQuickAddProduct(null);
    setCartOpen(true);
  }

  function handleQuickAdd(product) {
    setQuickAddProduct(product);
  }

  function updateQuantity(cartItem, difference) {
    setCart((current) => current.map((item) => item.key === cartItem.key && item.size === cartItem.size ? { ...item, quantity: item.quantity + difference } : item).filter((item) => item.quantity > 0));
  }

  function removeFromCart(cartItem) {
    setCart((current) => current.filter((item) => item.key !== cartItem.key || item.size !== cartItem.size));
  }

  const quickAddDialog = quickAddProduct && (
    <div className="modal-layer" onMouseDown={(event) => { if (event.target === event.currentTarget) setQuickAddProduct(null); }}>
      <section className="quick-modal" role="dialog" aria-modal="true" aria-labelledby="quick-add-title">
        <button className="modal-close icon-button" type="button" onClick={() => setQuickAddProduct(null)} aria-label="Close quick add"><Icon name="close" /></button>
        <img src={quickAddProduct.image.src} alt={quickAddProduct.image.alt} />
        <div className="quick-modal-info"><p className="eyebrow">{quickAddProduct.label}</p><h2 id="quick-add-title">{quickAddProduct.name}</h2><strong>{formatPrice(quickAddProduct.price)}</strong><p>Choose a size to add to your bag.</p><div className="size-options">{quickAddProduct.sizes.map((size) => <button key={size} className="size-option" type="button" onClick={() => addToCart(quickAddProduct, size)}>{size}</button>)}</div></div>
      </section>
    </div>
  );

  return (
    <>
      <Header category={category} setCategory={setCategory} search={search} setSearch={updateSearch} itemCount={itemCount} openBag={() => setCartOpen(true)} showCatalog={showCatalog} />
      {selectedProduct
        ? <ProductDetail key={selectedProduct.key} product={selectedProduct} onBack={showCatalog} onOpen={openProduct} onAdd={addToCart} />
        : <Storefront visibleProducts={visibleProducts} category={category} setCategory={setCategory} onOpen={openProduct} onAdd={handleQuickAdd} search={search} />}
      <Footer onNavigateCategory={navigateToCategory} onNavigateStory={navigateToStory} />
      {quickAddDialog}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} onQuantity={updateQuantity} onRemove={removeFromCart} />
    </>
  );
}
