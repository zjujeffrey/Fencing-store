import {Await, Link, useLoaderData} from 'react-router';
import {Suspense} from 'react';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import fencerClothing from '~/assets/fencer-clothing.jpg';
import fencerMask from '~/assets/fencer-mask.jpg';
import fencerWeapon from '~/assets/fencer-weapon.jpg';
import gearBag from '~/assets/gear-bag.jpg';
import {
  FENCING_CATEGORIES,
  getCategoryId,
  getCollectionPath,
} from '~/lib/fencingCategories';

export const meta = () => [{title: 'Shop Fencing Gear | BladeCraft'}];

export async function loader({context}) {
  const products = context.storefront
    .query(SHOP_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {products};
}

export default function Shop() {
  const {products} = useLoaderData();

  return (
    <main className="bc-shop">
      <InnerHero
        title="Shop the full fencing kit."
        eyebrow="Equipment catalog"
        image={fencerWeapon}
      >
        Find competition masks, whites, weapons, bags, scoring sets, and
        entry-level bundles for foil, epee, and sabre.
      </InnerHero>

      <section className="bc-shop-catalog grid gap-8 px-5 py-16 md:grid-cols-[220px_1fr] md:px-14 md:py-24">
        <aside className="bc-shop-sidebar hidden self-start rounded-lg border border-[#d9e0e7] bg-white p-3 md:sticky md:top-28 md:grid">
          {FENCING_CATEGORIES.map((category) => (
              <a
                className="rounded-md px-3 py-3 font-black text-[#61707f] hover:bg-[#f7f8fa] hover:text-[#101820]"
                href={getCollectionPath(category)}
                key={category.id}
              >
                {category.label}
              </a>
            ))}
        </aside>

        <div className="bc-shop-content">
          <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-black uppercase text-[#c92337]">
                Featured categories
              </p>
              <h2 className="max-w-4xl text-[clamp(2rem,4vw,4.2rem)] font-black leading-none">
                Built for practice, tournaments, and club rooms.
              </h2>
            </div>
            <Button to="/club" variant="outline">
              Club quote
            </Button>
          </div>

          <div className="bc-shop-category-grid mb-8 grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
            <CategoryTile
              title={FENCING_CATEGORIES[0].label}
              copy={FENCING_CATEGORIES[0].copy}
              href={getCollectionPath(FENCING_CATEGORIES[0])}
              image={fencerWeapon}
            />
            <CategoryTile
              title={FENCING_CATEGORIES[2].label}
              copy={FENCING_CATEGORIES[2].copy}
              href={getCollectionPath(FENCING_CATEGORIES[2])}
              image={fencerMask}
            />
            <CategoryTile
              title={FENCING_CATEGORIES[3].label}
              copy={FENCING_CATEGORIES[3].copy}
              href={getCollectionPath(FENCING_CATEGORIES[3])}
              image={fencerClothing}
            />
            <CategoryTile
              title={FENCING_CATEGORIES[5].label}
              copy={FENCING_CATEGORIES[5].copy}
              href={getCollectionPath(FENCING_CATEGORIES[5])}
              image={fencerWeapon}
            />
            <CategoryTile
              title={FENCING_CATEGORIES[6].label}
              copy={FENCING_CATEGORIES[6].copy}
              href={getCollectionPath(FENCING_CATEGORIES[6])}
              image={gearBag}
            />
            <CategoryTile
              title={FENCING_CATEGORIES[7].label}
              copy={FENCING_CATEGORIES[7].copy}
              href={getCollectionPath(FENCING_CATEGORIES[7])}
              image={fencerClothing}
            />
          </div>

          <Suspense fallback={<p>Loading Shopify products...</p>}>
            <Await resolve={products}>
              {(response) => (
                <ProductGrid products={response?.products?.nodes || []} />
              )}
            </Await>
          </Suspense>
        </div>
      </section>
    </main>
  );
}

function ProductGrid({products}) {
  if (!products.length) {
    return (
      <div className="rounded-lg border border-[#d9e0e7] bg-white p-6">
        No published Shopify products were found.
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({product}) {
  const selectedVariant = product.selectedOrFirstAvailableVariant;

  return (
    <article
      className="overflow-hidden rounded-lg border border-[#d9e0e7] bg-white shadow-sm"
      id={getCategoryId(product)}
    >
      <Link
        className="group block aspect-[4/3] overflow-hidden bg-[#d9e0e7]"
        to={`/products/${product.handle}`}
      >
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
            src={fencerMask}
          />
        )}
      </Link>
      <div className="p-5">
        <p className="mb-3 inline-flex rounded bg-[#c92337]/10 px-2 py-1 text-xs font-black uppercase text-[#c92337]">
          {product.vendor || 'Shopify'}
        </p>
        <h3 className="mb-2 text-lg font-black">
          <Link className="hover:text-[#c92337]" to={`/products/${product.handle}`}>
            {product.title}
          </Link>
        </h3>
        <p className="min-h-12 text-sm leading-6 text-[#61707f]">
          {product.description || 'View variants and availability.'}
        </p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <strong className="text-xl">
            {formatPrice(product.priceRange.minVariantPrice)}
          </strong>
          <CardAddButton product={product} selectedVariant={selectedVariant} />
        </div>
      </div>
    </article>
  );
}

function CardAddButton({product, selectedVariant}) {
  const {open} = useAside();

  if (!selectedVariant) {
    return (
      <Link
        className="min-h-10 rounded-md bg-[#101820] px-5 py-2.5 font-black text-white"
        to={`/products/${product.handle}`}
      >
        View
      </Link>
    );
  }

  return (
    <AddToCartButton
      className="min-h-10 rounded-md bg-[#101820] px-5 font-black text-white disabled:opacity-60"
      disabled={!selectedVariant.availableForSale}
      lines={[
        {
          merchandiseId: selectedVariant.id,
          quantity: 1,
        },
      ]}
      onClick={() => open('cart')}
    >
      {selectedVariant.availableForSale ? 'Add' : 'Sold out'}
    </AddToCartButton>
  );
}

function CategoryTile({title, copy, href, image}) {
  return (
    <a
      className="bc-shop-category-tile group relative flex min-h-64 flex-col justify-end overflow-hidden rounded-lg p-6 text-white"
      href={href}
    >
      <img
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        src={image}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/85 to-[#101820]/10" />
      <span className="relative mb-2 text-xs font-black uppercase text-[#d59b24]">
        {title}
      </span>
      <strong className="relative max-w-sm text-2xl leading-tight">
        {copy}
      </strong>
    </a>
  );
}

function InnerHero({title, eyebrow, image, children}) {
  return (
    <section className="bc-shop-hero relative grid min-h-[500px] items-end overflow-hidden bg-[#101820] px-5 py-16 text-white md:px-20 md:py-24">
      <img
        alt=""
        className="absolute inset-0 h-full w-full scale-[1.01] object-cover"
        src={image}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#101820] via-[#101820]/50 to-[#101820]/10" />
      <div className="relative max-w-3xl">
        <p className="mb-3 text-xs font-black uppercase text-[#d59b24]">
          {eyebrow}
        </p>
        <h1 className="mb-5 text-[clamp(2.6rem,7vw,6rem)] font-black leading-none">
          {title}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-white/85">
          {children}
        </p>
      </div>
    </section>
  );
}

function Button({children, to, variant = 'primary'}) {
  const classes =
    variant === 'outline'
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

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(Number(price.amount));
}

const SHOP_PRODUCTS_QUERY = `#graphql
  query ShopProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 24, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        vendor
        productType
        tags
        description
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
        selectedOrFirstAvailableVariant {
          id
          availableForSale
          title
          price {
            amount
            currencyCode
          }
          product {
            title
            handle
          }
        }
      }
    }
  }
`;
