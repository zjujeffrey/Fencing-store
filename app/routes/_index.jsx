import {Await, Link, useLoaderData} from 'react-router';
import {Suspense} from 'react';

export const meta = () => [{title: 'BladeCraft Fencing Supply'}];

export async function loader({context}) {
  const featuredProducts = context.storefront
    .query(FEATURED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {featuredProducts};
}

export default function Homepage() {
  const {featuredProducts} = useLoaderData();

  return (
    <main>
      <section className="relative grid min-h-[640px] items-end overflow-hidden bg-[#101820] md:min-h-[calc(100vh-108px)]">
        <div className="absolute inset-0 scale-[1.02] bg-[linear-gradient(90deg,rgba(16,24,32,.92),rgba(16,24,32,.67)_38%,rgba(16,24,32,.12)),url('/assets/fencer-mask.jpg')] bg-cover bg-center" />
        <div className="relative mb-10 ml-5 w-[min(760px,calc(100%-36px))] text-white md:mb-24 md:ml-20">
          <p className="mb-3 text-xs font-black uppercase text-[#d59b24]">
            Competition season edit
          </p>
          <h1 className="mb-5 text-[clamp(2.8rem,8vw,6.8rem)] font-black leading-[.93]">
            Fencing equipment built for precise, fearless bouts.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-white/85">
            Shop curated masks, blades, whites, bags, and scoring essentials
            for foil, epee, and sabre athletes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/shop">Shop New Gear</Button>
            <Button to="/club" variant="secondary">
              Outfit A Club
            </Button>
          </div>
        </div>
      </section>

      <section className="grid border-b border-[#d9e0e7] bg-white md:grid-cols-4">
        {['Masks', 'Weapons', 'Whites', 'Scoring'].map((item, index) => (
          <Link
            className="flex min-h-20 items-center justify-between border-b border-[#d9e0e7] px-6 py-5 md:min-h-24 md:border-r"
            key={item}
            to="/shop"
          >
            <span className="text-xs font-black text-[#61707f]">
              0{index + 1}
            </span>
            <strong className="text-xl md:text-2xl">{item}</strong>
          </Link>
        ))}
      </section>

      <section className="px-5 py-16 md:px-14 md:py-28">
        <p className="mb-3 text-xs font-black uppercase text-[#c92337]">
          Shop by discipline
        </p>
        <h2 className="mb-9 max-w-4xl text-[clamp(2rem,4vw,4.2rem)] font-black leading-none">
          Everything a fencer needs, organized by the bout.
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['Foil', 'Fast point work', 'from-[#103448] to-[#0a7c86]'],
            ['Epee', 'Full target control', 'from-[#282f3f] to-[#d59b24]'],
            ['Sabre', 'Explosive attacks', 'from-[#101820] to-[#c92337]'],
          ].map(([name, line, gradient]) => (
            <Link
              className={`relative flex min-h-80 items-end justify-between overflow-hidden rounded-lg bg-gradient-to-br ${gradient} p-7 text-white`}
              key={name}
              to="/shop"
            >
              <div className="absolute right-[-20px] top-5 h-[82%] w-[62%] bg-white/20 [clip-path:polygon(88%_0,100%_4%,16%_100%,0_94%)]" />
              <div className="relative">
                <p className="mb-2 font-black uppercase text-white/70">
                  {name}
                </p>
                <h3 className="max-w-[220px] text-4xl font-black leading-none">
                  {line}
                </h3>
              </div>
              <span className="relative grid min-h-11 min-w-20 place-items-center rounded-md border border-white/40 font-black">
                Shop
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:px-14 md:py-28">
        <div className="mb-9 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase text-[#c92337]">
              Shopify powered
            </p>
            <h2 className="text-[clamp(2rem,4vw,4.2rem)] font-black leading-none">
              Live products from your Shopify backend.
            </h2>
          </div>
          <Button to="/shop" variant="outline">
            View Catalog
          </Button>
        </div>
        <Suspense fallback={<p>Loading products...</p>}>
          <Await resolve={featuredProducts}>
            {(response) => (
              <ProductGrid products={response?.products?.nodes || []} />
            )}
          </Await>
        </Suspense>
      </section>

      <section className="grid gap-8 bg-[#101820] px-5 py-16 text-white md:grid-cols-[1fr_.68fr] md:px-14 md:py-24">
        <div>
          <p className="mb-3 text-xs font-black uppercase text-[#d59b24]">
            Club services
          </p>
          <h2 className="text-[clamp(2rem,4vw,4.2rem)] font-black leading-none">
            Outfit a whole salle without the guesswork.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-white/75">
            Size runs, weapon standardization, spare parts, and reorder lists
            are prepared for coaches, clubs, and school programs.
          </p>
        </div>
        <div className="grid gap-3">
          {['Sizing support', 'Safety spec checks', 'Parts and repairs'].map(
            (label) => (
              <div
                className="flex min-h-20 items-center gap-4 rounded-lg border border-white/20 bg-white/5 p-5 font-black"
                key={label}
              >
                <span className="text-[#d59b24]">◆</span>
                <span>{label}</span>
              </div>
            ),
          )}
        </div>
      </section>
    </main>
  );
}

function ProductGrid({products}) {
  if (!products.length) {
    return (
      <div className="rounded-lg border border-[#d9e0e7] bg-[#f7f8fa] p-6">
        No Shopify products are published yet. Add products in Shopify Admin and
        refresh this page.
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({product}) {
  const price = product.priceRange.minVariantPrice;
  return (
    <article className="overflow-hidden rounded-lg border border-[#d9e0e7] bg-white shadow-sm">
      <Link className="group block aspect-[4/3] overflow-hidden bg-[#d9e0e7]" to={`/products/${product.handle}`}>
        {product.featuredImage ? (
          <img
            alt={product.featuredImage.altText || product.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            src={product.featuredImage.url}
          />
        ) : (
          <img
            alt=""
            className="h-full w-full object-cover"
            src="/assets/fencer-mask.jpg"
          />
        )}
      </Link>
      <div className="p-5">
        <p className="mb-3 inline-flex rounded bg-[#c92337]/10 px-2 py-1 text-xs font-black uppercase text-[#c92337]">
          Shopify
        </p>
        <h3 className="mb-2 text-lg font-black">
          <Link className="hover:text-[#c92337]" to={`/products/${product.handle}`}>
            {product.title}
          </Link>
        </h3>
        <p className="text-xl font-black">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price.currencyCode,
          }).format(Number(price.amount))}
        </p>
      </div>
    </article>
  );
}

function Button({children, to, variant = 'primary'}) {
  const classes =
    variant === 'secondary'
      ? 'border border-white/40 bg-white/15 text-white'
      : variant === 'outline'
        ? 'border border-[#d9e0e7] bg-white text-[#101820]'
        : 'border border-[#c92337] bg-[#c92337] text-white';

  return (
    <Link
      className={`inline-flex min-h-12 items-center justify-center rounded-md px-5 font-black ${classes}`}
      to={to}
    >
      {children}
    </Link>
  );
}

const FEATURED_PRODUCTS_QUERY = `#graphql
  query FeaturedProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;
