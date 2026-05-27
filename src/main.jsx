import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Box,
  CheckCircle,
  ClipboardList,
  Menu,
  PackageSearch,
  Ruler,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Wrench,
  X
} from "lucide-react";
import "./styles.css";

const fallbackProducts = [
  {
    id: "prod_mask_apex_xcell",
    slug: "apex-x-cell-mask",
    title: "Apex X-Cell Mask",
    category: "mask",
    badge: "FIE",
    description: "1600N bib, replaceable padding, low-profile contour.",
    details:
      "A low-profile competition mask with secure bib geometry, replaceable padding, and balanced visibility for foil, epee, and sabre training.",
    price: "$289.00",
    priceCents: 28900,
    imageUrl: "/assets/fencer-mask.jpg",
    variants: [{ id: "var_mask_m", name: "Medium" }]
  },
  {
    id: "prod_epee_maraging",
    slug: "maraging-epee-complete",
    title: "Maraging Epee Complete",
    category: "weapon",
    badge: "Electric",
    description: "Wired blade, pistol grip, balanced guard assembly.",
    details: "Competition-ready wired epee with maraging blade and balanced guard assembly.",
    price: "$219.00",
    priceCents: 21900,
    imageUrl: "/assets/fencer-weapon.jpg",
    variants: [{ id: "var_epee_right", name: "Right Hand" }]
  },
  {
    id: "prod_starter_bundle",
    slug: "club-starter-bundle",
    title: "Club Starter Bundle",
    category: "kit",
    badge: "Starter",
    description: "Mask, jacket, glove, weapon bag, and training blade.",
    details: "A first-season kit bundle for foil, epee, or sabre programs.",
    price: "$399.00",
    priceCents: 39900,
    imageUrl: "/assets/fencer-pair.jpg",
    variants: [{ id: "var_kit_foil", name: "Foil Kit" }]
  },
  {
    id: "prod_pulse_pair",
    slug: "pulse-pair-scoring-set",
    title: "Pulse Pair Scoring Set",
    category: "wireless",
    badge: "Wireless",
    description: "Compact transmitters with club-mode pairing and USB-C charging.",
    details: "Two wireless scoring transmitters designed for fast club pairing.",
    price: "$459.00",
    priceCents: 45900,
    imageUrl: "/assets/fencer-scoring.jpg",
    variants: [{ id: "var_pulse_pair", name: "Pair" }]
  }
];

function money(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format((cents || 0) / 100);
}

function useProducts() {
  const [products, setProducts] = useState(fallbackProducts);

  useEffect(() => {
    fetch("/api/shopify/products")
      .then((response) => response.json())
      .then((payload) => {
        if (payload.products?.length) {
          setProducts(payload.products);
          return;
        }
        throw new Error(payload.error || "No Shopify products");
      })
      .catch(() => {
        fetch("/api/products")
          .then((response) => response.json())
          .then((payload) => {
            if (payload.products?.length) {
              setProducts(payload.products);
            }
          })
          .catch(() => setProducts(fallbackProducts));
      });
  }, []);

  return products;
}

function PromoBar() {
  return (
    <div className="flex gap-4 overflow-x-auto whitespace-nowrap bg-ink px-5 py-2.5 text-center text-xs font-black uppercase text-white md:justify-center md:gap-14">
      <span>Free shipping over $149</span>
      <span>Club orders welcome</span>
      <span>FIE-ready gear</span>
    </div>
  );
}

function Header({ cartCount, onOpenCart }) {
  const [open, setOpen] = useState(false);
  const links = [
    ["Clothing", "/shop#clothing"],
    ["Masks", "/shop#mask"],
    ["Weapons", "/shop#weapons"],
    ["Bags", "/shop#bags"],
    ["Wireless", "/shop#wireless"],
    ["Starter Kits", "/shop#kits"]
  ];

  return (
    <header className="sticky top-0 z-30 grid grid-cols-[auto_auto_1fr] items-center gap-3 border-b border-line/80 bg-paper/95 px-4 py-4 backdrop-blur md:grid-cols-[auto_1fr_auto] md:gap-6 md:px-14">
      <a href="/" className="inline-flex items-center gap-3 font-black">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-brandRed text-xs text-white">BC</span>
        <span>BladeCraft</span>
      </a>
      <button className="grid h-11 w-11 place-items-center rounded-md border border-line bg-white md:hidden" onClick={() => setOpen(!open)} aria-label="Open menu">
        <Menu size={19} />
      </button>
      <nav className={`${open ? "flex" : "hidden"} absolute left-4 right-4 top-[73px] flex-col gap-4 rounded-lg border border-line bg-white p-5 shadow-panel md:static md:flex md:flex-row md:justify-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
        {links.map(([label, href]) => (
          <a key={label} href={href} className="font-black text-sm hover:text-brandRed">
            {label}
          </a>
        ))}
      </nav>
      <div className="flex justify-end gap-2">
        <button className="grid h-11 w-11 place-items-center rounded-md border border-line bg-white" aria-label="Search">
          <Search size={19} />
        </button>
        <button className="relative grid h-11 w-11 place-items-center rounded-md border border-line bg-white" onClick={onOpenCart} aria-label="Open cart">
          <ShoppingBag size={19} />
          <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-teal px-1 text-xs font-black text-white">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}

function Button({ children, href, variant = "primary", className = "", ...props }) {
  const classes =
    variant === "secondary"
      ? "border border-white/40 bg-white/15 text-white"
      : variant === "outline"
        ? "border border-line bg-white text-ink"
        : "border border-brandRed bg-brandRed text-white";
  const all = `inline-flex min-h-12 items-center justify-center rounded-md px-5 font-black ${classes} ${className}`;
  return href ? (
    <a className={all} href={href}>
      {children}
    </a>
  ) : (
    <button className={all} {...props}>
      {children}
    </button>
  );
}

function ProductCard({ product, onAdd }) {
  const variant = product.variants?.[0];
  return (
    <article className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
      <a href={`/product?slug=${product.slug}`} className="group block aspect-[4/3] overflow-hidden bg-line">
        <img className="h-full w-full object-cover transition duration-300 group-hover:scale-105" src={product.imageUrl} alt={product.title} />
      </a>
      <div className="p-5">
        <p className="mb-3 inline-flex rounded bg-brandRed/10 px-2 py-1 text-xs font-black uppercase text-brandRed">{product.badge}</p>
        <h3 className="mb-2 text-lg font-black">
          <a href={`/product?slug=${product.slug}`} className="hover:text-brandRed">
            {product.title}
          </a>
        </h3>
        <p className="min-h-12 text-sm leading-6 text-muted">{product.description}</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <strong className="text-xl">{product.price}</strong>
          <button className="min-h-10 rounded-md bg-ink px-5 font-black text-white" onClick={() => onAdd(product, variant)}>
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

function CartDrawer({ open, cart, onClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkout() {
    if (!cart.length) {
      setMessage("Add at least one product before checkout.");
      return;
    }
    setLoading(true);
    setMessage("Creating secure checkout...");
    try {
      const hasShopifyItems = cart.every((item) => item.product.source === "shopify");
      const response = await fetch(hasShopifyItems ? "/api/shopify/cart" : "/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          hasShopifyItems
            ? {
                email: email || undefined,
                lines: cart.map((item) => ({
                  variantId: item.variant?.id,
                  quantity: item.quantity
                }))
              }
            : {
                email: email || "guest@example.com",
                items: cart.map((item) => ({
                  productId: item.product.id,
                  variantId: item.variant?.id,
                  quantity: item.quantity
                }))
              }
        )
      });
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.message || payload.error || "Checkout could not be started.");
        return;
      }
      window.location.href = payload.checkoutUrl;
    } catch (error) {
      setMessage("Checkout server is not reachable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className={`${open ? "flex" : "hidden"} fixed inset-0 z-50 justify-end bg-ink/50`}>
      <div className="grid h-full w-full max-w-[430px] grid-rows-[auto_1fr_auto] bg-white p-6 shadow-panel">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Your bag</h2>
          <button className="grid h-11 w-11 place-items-center rounded-md border border-line" onClick={onClose} aria-label="Close cart">
            <X size={19} />
          </button>
        </div>
        <div className="grid content-start gap-3 py-6">
          {cart.length === 0 ? (
            <p className="text-muted">No products added yet.</p>
          ) : (
            cart.map((item) => (
              <div key={`${item.product.id}-${item.variant?.id}`} className="flex justify-between gap-4 border-b border-line py-3">
                <span>
                  {item.product.title} <small className="font-black text-muted">x{item.quantity}</small>
                </span>
                <strong>{money(item.product.priceCents * item.quantity)}</strong>
              </div>
            ))
          )}
        </div>
        <div>
          <label className="mb-3 grid gap-2 text-sm font-black">
            <span>Email for receipt</span>
            <input className="min-h-11 rounded-md border border-line px-3" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="coach@example.com" type="email" />
          </label>
          <p className="min-h-6 text-sm font-bold text-brandRed">{message}</p>
          <Button className="w-full" onClick={checkout} disabled={loading}>
            {loading ? "Starting..." : "Checkout"}
          </Button>
        </div>
      </div>
    </aside>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col justify-between gap-7 border-t border-line bg-white px-5 py-10 md:flex-row md:px-14">
      <div>
        <a href="/" className="inline-flex items-center gap-3 font-black">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-brandRed text-xs text-white">BC</span>
          <span>BladeCraft</span>
        </a>
        <p className="mt-4 max-w-sm text-muted">Independent fencing supply for athletes, clubs, and coaches.</p>
      </div>
      <div className="flex flex-wrap gap-5 font-black">
        <a href="/shop">Shop</a>
        <a href="/product">Product</a>
        <a href="/club">Club Orders</a>
        <a href="/admin">Admin</a>
      </div>
    </footer>
  );
}

function HomePage({ products, onAdd }) {
  const featured = products.slice(0, 4);
  return (
    <main>
      <section className="relative grid min-h-[640px] items-end overflow-hidden bg-ink md:min-h-[calc(100vh-108px)]">
        <div className="absolute inset-0 scale-[1.02] bg-[linear-gradient(90deg,rgba(16,24,32,.92),rgba(16,24,32,.67)_38%,rgba(16,24,32,.12)),url('/assets/fencer-mask.jpg')] bg-cover bg-center" />
        <div className="relative mb-10 ml-5 w-[min(760px,calc(100%-36px))] text-white md:mb-24 md:ml-20">
          <p className="mb-3 text-xs font-black uppercase text-gold">Competition season edit</p>
          <h1 className="mb-5 text-[clamp(2.8rem,8vw,6.8rem)] font-black leading-[.93]">Fencing equipment built for precise, fearless bouts.</h1>
          <p className="max-w-xl text-lg leading-8 text-white/85">Shop curated masks, blades, whites, bags, and scoring essentials for foil, epee, and sabre athletes.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/shop">Shop New Gear</Button>
            <Button href="/shop#kits" variant="secondary">
              Build A Starter Kit
            </Button>
          </div>
        </div>
      </section>
      <section className="grid border-b border-line bg-white md:grid-cols-4">
        {["Masks", "Weapons", "Whites", "Scoring"].map((item, index) => (
          <a key={item} href="/shop" className="flex min-h-20 items-center justify-between border-b border-line px-6 py-5 md:min-h-24 md:border-r">
            <span className="text-xs font-black text-muted">0{index + 1}</span>
            <strong className="text-xl md:text-2xl">{item}</strong>
          </a>
        ))}
      </section>
      <section className="px-5 py-16 md:px-14 md:py-28">
        <p className="mb-3 text-xs font-black uppercase text-brandRed">Shop by discipline</p>
        <h2 className="mb-9 max-w-4xl text-[clamp(2rem,4vw,4.2rem)] font-black leading-none">Everything a fencer needs, organized by the bout.</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Foil", "Fast point work", "from-[#103448] to-teal"],
            ["Epee", "Full target control", "from-[#282f3f] to-gold"],
            ["Sabre", "Explosive attacks", "from-ink to-brandRed"]
          ].map(([name, line, gradient]) => (
            <a key={name} href="/shop" className={`relative flex min-h-80 items-end justify-between overflow-hidden rounded-lg bg-gradient-to-br ${gradient} p-7 text-white`}>
              <div className="absolute right-[-20px] top-5 h-[82%] w-[62%] bg-white/20 [clip-path:polygon(88%_0,100%_4%,16%_100%,0_94%)]" />
              <div className="relative">
                <p className="mb-2 font-black uppercase text-white/70">{name}</p>
                <h3 className="max-w-[220px] text-4xl font-black leading-none">{line}</h3>
              </div>
              <span className="relative grid min-h-11 min-w-20 place-items-center rounded-md border border-white/40 font-black">Shop</span>
            </a>
          ))}
        </div>
      </section>
      <section className="bg-white px-5 py-16 md:px-14 md:py-28">
        <div className="mb-9 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase text-brandRed">Featured equipment</p>
            <h2 className="text-[clamp(2rem,4vw,4.2rem)] font-black leading-none">Competition-ready picks.</h2>
          </div>
          <Button href="/shop" variant="outline">
            View Catalog
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </div>
      </section>
      <FeatureBand />
    </main>
  );
}

function FeatureBand() {
  return (
    <section className="grid gap-8 bg-ink px-5 py-16 text-white md:grid-cols-[1fr_.68fr] md:px-14 md:py-24">
      <div>
        <p className="mb-3 text-xs font-black uppercase text-gold">Club services</p>
        <h2 className="text-[clamp(2rem,4vw,4.2rem)] font-black leading-none">Outfit a whole salle without the guesswork.</h2>
        <p className="mt-5 max-w-2xl leading-7 text-white/75">Size runs, weapon standardization, spare parts, and reorder lists are prepared for coaches, clubs, and school programs.</p>
      </div>
      <div className="grid gap-3">
        {[
          [Ruler, "Sizing support"],
          [ShieldCheck, "Safety spec checks"],
          [Wrench, "Parts and repairs"]
        ].map(([Icon, label]) => (
          <div key={label} className="flex min-h-20 items-center gap-4 rounded-lg border border-white/20 bg-white/5 p-5 font-black">
            <Icon className="text-gold" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ShopPage({ products, onAdd }) {
  return (
    <main>
      <InnerHero title="Shop the full fencing kit." eyebrow="Equipment catalog" image="/assets/fencer-weapon.jpg">
        Find competition masks, whites, weapons, bags, scoring sets, and entry-level bundles for foil, epee, and sabre.
      </InnerHero>
      <section className="grid gap-8 px-5 py-16 md:grid-cols-[220px_1fr] md:px-14 md:py-24">
        <aside className="hidden self-start rounded-lg border border-line bg-white p-3 md:sticky md:top-24 md:grid">
          {["clothing", "mask", "weapon", "bag", "wireless", "kit"].map((item) => (
            <a key={item} href={`#${item}`} className="rounded-md px-3 py-3 font-black capitalize text-muted hover:bg-paper hover:text-ink">
              {item}
            </a>
          ))}
        </aside>
        <div>
          <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-black uppercase text-brandRed">Featured categories</p>
              <h2 className="max-w-4xl text-[clamp(2rem,4vw,4.2rem)] font-black leading-none">Built for practice, tournaments, and club rooms.</h2>
            </div>
            <Button href="/club" variant="outline">
              Club quote
            </Button>
          </div>
          <div className="mb-8 grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
            <CategoryTile title="Clothing" copy="Jackets, plastrons, breeches, lames" image="/assets/fencer-clothing.jpg" />
            <CategoryTile title="Masks" copy="Foil, epee, sabre, club, coaching" image="/assets/fencer-mask.jpg" />
            <CategoryTile title="Bags" copy="Rolling bags, weapon bags, coach kits" image="/assets/gear-bag.jpg" />
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div id={product.category} key={product.id}>
                <ProductCard product={product} onAdd={onAdd} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function CategoryTile({ title, copy, image }) {
  return (
    <a href="/shop" className="group relative flex min-h-64 flex-col justify-end overflow-hidden rounded-lg p-6 text-white">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-ink/10" />
      <span className="relative mb-2 text-xs font-black uppercase text-gold">{title}</span>
      <strong className="relative max-w-sm text-2xl leading-tight">{copy}</strong>
    </a>
  );
}

function InnerHero({ title, eyebrow, image, children }) {
  return (
    <section className="relative grid min-h-[500px] items-end overflow-hidden bg-ink px-5 py-16 text-white md:px-20 md:py-24">
      <img src={image} alt="" className="absolute inset-0 h-full w-full scale-[1.01] object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/50 to-ink/10" />
      <div className="relative max-w-3xl">
        <p className="mb-3 text-xs font-black uppercase text-gold">{eyebrow}</p>
        <h1 className="mb-5 text-[clamp(2.6rem,7vw,6rem)] font-black leading-none">{title}</h1>
        <p className="max-w-2xl text-lg leading-8 text-white/85">{children}</p>
      </div>
    </section>
  );
}

function ProductPage({ products, onAdd }) {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const product = products.find((item) => item.slug === slug) || products[0] || fallbackProducts[0];
  const variant = product.variants?.[0];

  return (
    <main className="grid gap-8 px-5 py-10 md:grid-cols-[1.08fr_.72fr] md:px-14 md:py-16">
      <section className="grid gap-4">
        <img className="aspect-[5/4] min-h-[330px] w-full rounded-lg object-cover md:min-h-[430px]" src={product.imageUrl} alt={product.title} />
        <div className="grid grid-cols-2 gap-4">
          <img className="aspect-[4/3] rounded-lg object-cover" src="/assets/fencer-weapon.jpg" alt="" />
          <img className="aspect-[4/3] rounded-lg object-cover" src="/assets/fencer-pair.jpg" alt="" />
        </div>
      </section>
      <section className="self-start rounded-lg border border-line bg-white p-6 shadow-sm md:sticky md:top-24">
        <p className="mb-3 inline-flex rounded bg-brandRed/10 px-2 py-1 text-xs font-black uppercase text-brandRed">{product.badge}</p>
        <h1 className="mb-4 text-[clamp(2.4rem,5vw,4.4rem)] font-black leading-none">{product.title}</h1>
        <p className="leading-7 text-muted">{product.details || product.description}</p>
        <div className="my-6 flex items-center justify-between gap-4 border-y border-line py-5">
          <strong className="text-3xl">{product.price}</strong>
          <span className="font-bold text-muted">Ships in 1-2 business days</span>
        </div>
        <label className="mb-5 grid gap-2 text-sm font-black uppercase">
          <span>Variant</span>
          <select className="min-h-12 rounded-md border border-line bg-white px-3">
            {product.variants?.map((item) => (
              <option key={item.id}>{item.name}</option>
            ))}
          </select>
        </label>
        <Button className="w-full" onClick={() => onAdd(product, variant)}>
          Add To Bag
        </Button>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            [ShieldCheck, "1600N bib"],
            [Box, "Club order ready"],
            [CheckCircle, "Verified fit"]
          ].map(([Icon, label]) => (
            <div key={label} className="grid min-h-24 place-items-center rounded-lg border border-line p-3 text-center text-xs font-black">
              <Icon className="text-teal" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="md:col-span-2">
        <p className="mb-3 text-xs font-black uppercase text-brandRed">Details</p>
        <h2 className="max-w-4xl text-[clamp(2rem,4vw,4.2rem)] font-black leading-none">Protection with a clean competitive fit.</h2>
        <p className="mt-5 max-w-3xl leading-8 text-muted">{product.details}</p>
      </section>
    </main>
  );
}

function ClubPage() {
  return (
    <main>
      <InnerHero title="Order for the whole salle with one clean plan." eyebrow="Club outfitting" image="/assets/fencer-pair.jpg">
        Standardize sizing, starter bundles, weapon parts, and reorder lists for clubs, schools, camps, and coaching programs.
      </InnerHero>
      <section className="grid gap-5 px-5 py-16 md:grid-cols-3 md:px-14 md:py-24">
        {[
          [ClipboardList, "1. Build the kit list", "Choose weapon type, athlete count, safety level, and spare part ratios."],
          [Ruler, "2. Confirm sizing", "Map jacket, breeches, glove, mask, and lame sizes by athlete group."],
          [Truck, "3. Ship in batches", "Receive labeled cartons for teams, coaches, or equipment rooms."]
        ].map(([Icon, title, copy]) => (
          <article key={title} className="min-h-64 rounded-lg border border-line bg-white p-7">
            <Icon className="mb-10 h-9 w-9 text-brandRed" />
            <h2 className="mb-3 text-3xl font-black leading-none">{title}</h2>
            <p className="leading-7 text-muted">{copy}</p>
          </article>
        ))}
      </section>
      <section className="grid gap-8 bg-[linear-gradient(90deg,rgba(16,24,32,.96),rgba(16,24,32,.76)),url('/assets/fencer-weapon.jpg')] bg-cover bg-center px-5 py-16 text-white md:grid-cols-[1fr_.68fr] md:px-14 md:py-24">
        <div>
          <p className="mb-3 text-xs font-black uppercase text-gold">Recommended pack</p>
          <h2 className="text-[clamp(2rem,4vw,4.2rem)] font-black leading-none">Foil starter room for 12 athletes.</h2>
          <p className="mt-5 max-w-2xl leading-7 text-white/75">Twelve masks, twelve jackets, twelve gloves, eight electric foils, bodycords, two test boxes, and repair parts for a full semester.</p>
        </div>
        <div className="rounded-lg border border-white/25 bg-white/10 p-6">
          <h3 className="mb-4 text-2xl font-black">Request a club quote</h3>
          <input className="mb-3 min-h-12 w-full rounded-md border border-white/30 px-3 text-ink" placeholder="coach@example.com" />
          <Button>Send</Button>
        </div>
      </section>
    </main>
  );
}

function OrderPage() {
  const [orderNumber, setOrderNumber] = useState(new URLSearchParams(window.location.search).get("order") || "");
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");

  async function loadOrder(number = orderNumber) {
    if (!number) return;
    setMessage("Loading order...");
    const response = await fetch(`/api/checkout/orders/${encodeURIComponent(number)}`);
    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error || "Order not found.");
      setOrder(null);
      return;
    }
    setOrder(payload.order);
    setMessage("");
  }

  useEffect(() => {
    if (orderNumber) loadOrder(orderNumber);
  }, []);

  return (
    <StatusShell icon={PackageSearch} eyebrow="Order lookup" title="Check order status.">
      <form className="my-6 grid gap-3" onSubmit={(event) => { event.preventDefault(); loadOrder(); }}>
        <label className="font-black">Order number</label>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input className="min-h-12 rounded-md border border-line px-3" value={orderNumber} onChange={(event) => setOrderNumber(event.target.value)} placeholder="BC-260526-ABCD" />
          <Button>Check</Button>
        </div>
      </form>
      <OrderResult order={order} message={message} />
    </StatusShell>
  );
}

function SuccessPage() {
  return (
    <StatusShell icon={CheckCircle} eyebrow="Checkout complete" title="Thanks. Your order is being confirmed.">
      <p className="text-muted">Stripe notifies the store by webhook. This page shows the latest order status from the BladeCraft order module.</p>
      <OrderPageInline />
      <Button href="/shop">Continue Shopping</Button>
    </StatusShell>
  );
}

function OrderPageInline() {
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const orderNumber = new URLSearchParams(window.location.search).get("order");
    if (!orderNumber) return;
    setMessage("Loading order...");
    fetch(`/api/checkout/orders/${encodeURIComponent(orderNumber)}`)
      .then((response) => response.json().then((payload) => ({ ok: response.ok, payload })))
      .then(({ ok, payload }) => {
        if (!ok) {
          setMessage(payload.error || "Order not found.");
          return;
        }
        setOrder(payload.order);
        setMessage("");
      });
  }, []);
  return <OrderResult order={order} message={message} />;
}

function StatusShell({ icon: Icon, eyebrow, title, children }) {
  return (
    <main className="min-h-[calc(100vh-79px)] px-5 py-14 md:px-14 md:py-24">
      <section className="w-full max-w-3xl rounded-lg border border-line bg-white p-7 shadow-sm md:p-11">
        <Icon className="mb-5 h-11 w-11 text-teal" />
        <p className="mb-3 text-xs font-black uppercase text-brandRed">{eyebrow}</p>
        <h1 className="mb-5 text-[clamp(2.4rem,5vw,4.8rem)] font-black leading-none">{title}</h1>
        {children}
      </section>
    </main>
  );
}

function OrderResult({ order, message }) {
  if (message) return <p className="my-5 font-bold text-brandRed">{message}</p>;
  if (!order) return null;
  return (
    <div className="my-6">
      <div className="mb-4 grid gap-3 md:grid-cols-4">
        {[
          ["Order", order.orderNumber],
          ["Status", order.status],
          ["Fulfillment", order.fulfillmentStatus],
          ["Total", money(order.totalCents)]
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-line bg-paper p-4">
            <span className="block text-sm font-bold text-muted">{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="grid gap-2">
        {order.items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="flex justify-between rounded-lg border border-line bg-paper p-4">
            <span>
              {item.title} - {item.variantName} x{item.quantity}
            </span>
            <strong>{money(item.unitPriceCents * item.quantity)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("Loading orders...");
  useEffect(() => {
    fetch("/api/admin/orders")
      .then((response) => response.json())
      .then((payload) => {
        setOrders(payload.orders || []);
        setMessage("");
      })
      .catch(() => setMessage("Could not load orders."));
  }, []);
  return (
    <main className="min-h-screen px-5 py-14 md:px-14 md:py-24">
      <p className="mb-3 text-xs font-black uppercase text-brandRed">Back office</p>
      <h1 className="mb-8 text-[clamp(2.8rem,7vw,6rem)] font-black leading-none">Orders</h1>
      {message && <p>{message}</p>}
      <section className="grid gap-3">
        {orders.length === 0 && !message ? <p>No orders yet.</p> : null}
        {orders.map((order) => (
          <article key={order.orderNumber} className="grid gap-4 rounded-lg border border-line bg-white p-5 md:grid-cols-[1.2fr_.7fr_1fr]">
            <div className="grid gap-1">
              <strong>{order.orderNumber}</strong>
              <span className="text-sm font-bold text-muted">{order.email}</span>
            </div>
            <div className="grid gap-1">
              <span className="text-sm font-bold text-muted">{order.status}</span>
              <strong>{money(order.totalCents)}</strong>
            </div>
            <div className="grid gap-1">
              <span className="text-sm font-bold text-muted">{order.items.length} line item(s)</span>
              <span className="text-sm font-bold text-muted">{new Date(order.createdAt).toLocaleString()}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function App() {
  const products = useProducts();
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  function addToCart(product, variant) {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id && item.variant?.id === variant?.id);
      if (existing) {
        return current.map((item) => (item === existing ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...current, { product, variant, quantity: 1 }];
    });
    setCartOpen(true);
  }

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const path = window.location.pathname.replace(/\/$/, "") || "/";

  let page;
  if (path === "/shop") page = <ShopPage products={products} onAdd={addToCart} />;
  else if (path === "/product") page = <ProductPage products={products} onAdd={addToCart} />;
  else if (path === "/club") page = <ClubPage />;
  else if (path === "/success") page = <SuccessPage />;
  else if (path === "/order") page = <OrderPage />;
  else if (path === "/admin") page = <AdminPage />;
  else page = <HomePage products={products} onAdd={addToCart} />;

  return (
    <>
      <PromoBar />
      <Header cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />
      {page}
      <Footer />
      <CartDrawer open={cartOpen} cart={cart} onClose={() => setCartOpen(false)} />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
