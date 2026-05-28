import {useLoaderData} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import fencerPair from '~/assets/fencer-pair.jpg';
import fencerWeapon from '~/assets/fencer-weapon.jpg';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [
    {title: `${data?.product.title ?? 'Product'} | BladeCraft`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context, params}) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product} = useLoaderData();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, description, vendor} = product;
  const detailCopy = description || 'Competition-ready equipment with verified Shopify variants and availability.';

  return (
    <main className="grid gap-8 px-5 py-10 md:grid-cols-[1.08fr_.72fr] md:px-14 md:py-16">
      <section className="grid gap-4">
        <div className="overflow-hidden rounded-lg bg-[#d9e0e7]">
          <ProductImage image={selectedVariant?.image} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img
            alt=""
            className="aspect-[4/3] w-full rounded-lg object-cover"
            src={fencerWeapon}
          />
          <img
            alt=""
            className="aspect-[4/3] w-full rounded-lg object-cover"
            src={fencerPair}
          />
        </div>
      </section>

      <section className="self-start rounded-lg border border-[#d9e0e7] bg-white p-6 shadow-sm md:sticky md:top-28">
        <p className="mb-3 inline-flex rounded bg-[#c92337]/10 px-2 py-1 text-xs font-black uppercase text-[#c92337]">
          {vendor || 'Shopify'}
        </p>
        <h1 className="mb-4 text-[clamp(2.4rem,5vw,4.4rem)] font-black leading-none">
          {title}
        </h1>
        <p className="leading-7 text-[#61707f]">{detailCopy}</p>
        <div className="my-6 flex items-center justify-between gap-4 border-y border-[#d9e0e7] py-5">
          <strong className="text-3xl">
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
          </strong>
          <span className="font-bold text-[#61707f]">
            Ships in 1-2 business days
          </span>
        </div>
        <ProductForm
          productOptions={productOptions}
          selectedVariant={selectedVariant}
        />
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {['Verified fit', 'Club ready', 'Secure checkout'].map((label) => (
            <div
              className="grid min-h-24 place-items-center rounded-lg border border-[#d9e0e7] p-3 text-center text-xs font-black"
              key={label}
            >
              <span className="text-2xl text-[#0a7c86]">◆</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="md:col-span-2">
        <p className="mb-3 text-xs font-black uppercase text-[#c92337]">
          Details
        </p>
        <h2 className="max-w-4xl text-[clamp(2rem,4vw,4.2rem)] font-black leading-none">
          Protection with a clean competitive fit.
        </h2>
        <div
          className="mt-5 max-w-3xl leading-8 text-[#61707f]"
          dangerouslySetInnerHTML={{__html: descriptionHtml}}
        />
      </section>
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </main>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
