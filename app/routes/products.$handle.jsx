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
  useSelectedOptionInUrlParam(selectedVariant?.selectedOptions || []);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {
    title,
    descriptionHtml,
    description,
    vendor,
    productType,
    tags = [],
    featuredImage,
    media,
    variants,
  } = product;
  const galleryImages = getGalleryImages({
    selectedImage: selectedVariant?.image,
    featuredImage,
    mediaNodes: media?.nodes,
  });
  const mainImage = selectedVariant?.image || featuredImage || galleryImages[0];
  const detailCopy =
    description ||
    product.seo?.description ||
    'Competition-ready equipment with verified Shopify variants and availability.';
  const hasDescriptionHtml = Boolean(descriptionHtml?.trim());
  const hasUnsupportedDetailImages = hasExternalMarketImages(descriptionHtml);
  const variantNodes = variants?.nodes || [];

  return (
    <main className="grid gap-8 px-5 py-10 md:grid-cols-[1.08fr_.72fr] md:px-14 md:py-16">
      <section className="grid gap-4">
        <div className="overflow-hidden rounded-lg bg-[#d9e0e7]">
          <ProductImage image={mainImage} />
        </div>
        {galleryImages.length > 1 ? (
          <div className="grid grid-cols-3 gap-3">
            {galleryImages.slice(0, 6).map((image) => (
              <img
                alt={image.altText || title}
                className="aspect-square w-full rounded-lg border border-[#d9e0e7] object-cover"
                key={image.id || image.url}
                src={image.url}
              />
            ))}
          </div>
        ) : null}
      </section>

      <section className="self-start rounded-lg border border-[#d9e0e7] bg-white p-6 shadow-sm md:sticky md:top-28">
        <p className="mb-3 inline-flex rounded bg-[#c92337]/10 px-2 py-1 text-xs font-black uppercase text-[#c92337]">
          {vendor || productType || 'Shopify'}
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
        <div className="mt-6 grid gap-2 text-sm text-[#61707f]">
          {selectedVariant?.sku ? <p><strong>SKU:</strong> {selectedVariant.sku}</p> : null}
          {productType ? <p><strong>Type:</strong> {productType}</p> : null}
          {tags.length ? <p><strong>Tags:</strong> {tags.slice(0, 6).join(', ')}</p> : null}
        </div>
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
          Product details
        </p>
        <h2 className="product-detail-title max-w-4xl font-black leading-tight">
          {product.seo?.title || title}
        </h2>
        {hasDescriptionHtml && !hasUnsupportedDetailImages ? (
          <div
            className="product-detail-copy mt-5 max-w-4xl leading-8 text-[#61707f]"
            dangerouslySetInnerHTML={{__html: descriptionHtml}}
          />
        ) : galleryImages.length ? (
          <div className="product-detail-gallery mt-6 grid gap-4 md:grid-cols-2">
            {galleryImages.map((image) => (
              <img
                alt={image.altText || title}
                className="w-full rounded-lg border border-[#d9e0e7] bg-[#f7f8fa] object-contain"
                key={image.id || image.url}
                src={image.url}
              />
            ))}
          </div>
        ) : (
          <p className="mt-5 max-w-4xl leading-8 text-[#61707f]">
            {detailCopy}
          </p>
        )}
      </section>

      <section className="grid gap-4 md:col-span-2 md:grid-cols-3">
        <div className="rounded-lg border border-[#d9e0e7] bg-white p-5">
          <h3 className="mb-3 text-lg font-black">Specifications</h3>
          <dl className="grid gap-3 text-sm text-[#61707f]">
            <div>
              <dt className="font-black text-[#101820]">Vendor</dt>
              <dd>{vendor || 'BladeCraft'}</dd>
            </div>
            <div>
              <dt className="font-black text-[#101820]">Product type</dt>
              <dd>{productType || 'Fencing equipment'}</dd>
            </div>
            <div>
              <dt className="font-black text-[#101820]">Availability</dt>
              <dd>{selectedVariant?.availableForSale ? 'Available' : 'Sold out'}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-[#d9e0e7] bg-white p-5">
          <h3 className="mb-3 text-lg font-black">Shipping</h3>
          <p className="leading-7 text-[#61707f]">
            Orders are prepared after payment confirmation. Club and bulk orders
            can be quoted separately before checkout.
          </p>
        </div>

        <div className="rounded-lg border border-[#d9e0e7] bg-white p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-lg font-black">Variants</h3>
            {variantNodes.length ? (
              <span className="rounded bg-[#f7f8fa] px-2 py-1 text-xs font-black text-[#61707f]">
                {variantNodes.length}
              </span>
            ) : null}
          </div>
          {variantNodes.length ? (
            <ul className="product-variant-list grid gap-2 text-sm text-[#61707f]">
              {variantNodes.map((variant) => (
                <li className="flex justify-between gap-4" key={variant.id}>
                  <span>{variant.title}</span>
                  <span className="font-black text-[#101820]">
                    <ProductPrice price={variant.price} />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#61707f]">No variant information available.</p>
          )}
        </div>
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

function getGalleryImages({selectedImage, featuredImage, mediaNodes}) {
  const images = [
    selectedImage,
    featuredImage,
    ...(mediaNodes || [])
      .filter((node) => node?.mediaContentType === 'IMAGE')
      .map((node) => node.image || node.previewImage),
  ].filter(Boolean);

  return images.filter((image, index, allImages) => {
    const key = image.url || image.id;
    return key && allImages.findIndex((item) => (item.url || item.id) === key) === index;
  });
}

function hasExternalMarketImages(html) {
  return /<img[^>]+src=["']https?:\/\/[^"']*(alicdn|taobao|tbcdn)[^"']*["']/i.test(
    html || '',
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
    productType
    tags
    descriptionHtml
    description
    featuredImage {
      id
      url
      altText
      width
      height
    }
    media(first: 12) {
      nodes {
        mediaContentType
        alt
        previewImage {
          id
          url
          altText
          width
          height
        }
        ... on MediaImage {
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
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
