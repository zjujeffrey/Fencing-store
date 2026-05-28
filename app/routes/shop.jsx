import {Await, Link, useLoaderData} from 'react-router';
import {Suspense} from 'react';

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
    <main>
      <section className="relative grid min-h-[500px] items-end overflow-hidden bg-[#101820] px-5 py-16 text-white md:px-20 md:py-24">
        <img
          alt=""
          className="absolute inset-0 h-full w-full scale-[1.01] object-cover"
          src="/assets/fencer-weapon.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101820] via-[#101820]/50 to-[#101820]/10" />
        <div className="relative max-w-3xl">
          <p className="mb-3 text-xs font-black uppercase text-[#d59b24]">
            Equipment catalog
          </p>
          <h1 className="mb-5 text-[clamp(2.6rem,7vw,6rem)] font-black leading-none">
            Shop the full fencing kit.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-white/85">
            Products on this page come directly from Shopify, including images,
            prices, variants, and availability.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 md:px-14 md:py-24">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase text-[#c92337]">
              Shopify catalog
            </p>
            <h2 className="max-w-4xl text-[clamp(2rem,4vw,4.2rem)] font-black leading-none">
              Built for practice, tournaments, and club rooms.
            </h2>
          </div>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#d9e0e7] bg-white px-5 font-black"
            to="/club"
          >
            Club quote
          </Link>
        </div>

        <Suspense fallback={<p>Loading Shopify products...</p>}>
          <Await resolve={products}>
            {(response) => (
              <ProductGrid products={response?.products?.nodes || []} />
            )}
          </Await>
        </Suspense>
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
        <article
          className="overflow-hidden rounded-lg border border-[#d9e0e7] bg-white shadow-sm"
          key={product.id}
        >
          <Link className="block aspect-[4/3] overflow-hidden bg-[#d9e0e7]" to={`/products/${product.handle}`}>
            {product.featuredImage ? (
              <img
                alt={product.featuredImage.altText || product.title}
                className="h-full w-full object-cover"
                src={product.featuredImage.url}
              />
            ) : (
              <img alt="" className="h-full w-full object-cover" src="/assets/fencer-mask.jpg" />
            )}
          </Link>
          <div className="p-5">
            <p className="mb-3 inline-flex rounded bg-[#c92337]/10 px-2 py-1 text-xs font-black uppercase text-[#c92337]">
              {product.vendor || 'Shopify'}
            </p>
            <h3 className="mb-2 text-lg font-black">
              <Link to={`/products/${product.handle}`}>{product.title}</Link>
            </h3>
            <p className="leading-6 text-[#61707f]">
              {product.description || 'View variants and availability.'}
            </p>
            <p className="mt-5 text-xl font-black">
              {formatPrice(product.priceRange.minVariantPrice)}
            </p>
          </div>
        </article>
      ))}
    </div>
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
      }
    }
  }
`;
