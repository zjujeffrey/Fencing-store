import {useEffect, useState} from 'react';
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
    mediaNodes: media?.nodes,
  });
  const mainImage =
    galleryImages[0] || featuredImage || selectedVariant?.image;
  const detailCopy =
    description ||
    product.seo?.description ||
    'Competition-ready equipment with verified Shopify variants and availability.';
  const proxiedDescriptionHtml = rewriteDescriptionImageUrls(descriptionHtml);
  const variantNodes = variants?.nodes || [];
  const productMeta = [
    vendor,
    productType,
    selectedVariant?.sku ? `SKU ${selectedVariant.sku}` : null,
  ].filter(Boolean);

  return (
    <main className="product-page grid gap-8 px-5 py-8 md:grid-cols-[1.05fr_.78fr] md:px-14 md:py-14">
      <section className="min-w-0 grid gap-4">
        <ProductGallery
          fallbackImage={mainImage}
          images={galleryImages}
          title={title}
        />
      </section>

      <section className="product-buy-panel min-w-0 self-start rounded-lg border border-[#d9e0e7] bg-white p-5 shadow-sm md:p-6">
        <p className="mb-3 flex flex-wrap gap-2 text-xs font-black uppercase text-[#61707f]">
          {productMeta.map((item) => (
            <span className="rounded bg-[#f7f8fa] px-2 py-1" key={item}>
              {item}
            </span>
          ))}
        </p>
        <h1 className="mb-4 text-[clamp(2rem,4vw,3.5rem)] font-black leading-none">
          {title}
        </h1>

        <div className="my-6 grid gap-4 border-y border-[#d9e0e7] py-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <strong className="text-3xl leading-none">
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
          </strong>
          <span className={`inline-flex min-h-9 items-center justify-center rounded px-3 text-sm font-black ${
            selectedVariant?.availableForSale
              ? 'bg-[#0a7c86]/10 text-[#0a7c86]'
              : 'bg-[#c92337]/10 text-[#c92337]'
          }`}>
            {selectedVariant?.availableForSale ? 'In stock' : 'Sold out'}
          </span>
        </div>

        <ProductForm
          productOptions={productOptions}
          selectedVariant={selectedVariant}
        />

        <dl className="mt-6 grid gap-3 border-t border-[#d9e0e7] pt-5 text-sm">
          {selectedVariant?.sku ? (
            <div className="flex justify-between gap-4">
              <dt className="font-black text-[#101820]">SKU</dt>
              <dd className="text-right text-[#61707f]">{selectedVariant.sku}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4">
            <dt className="font-black text-[#101820]">Dispatch</dt>
            <dd className="text-right text-[#61707f]">Ships in 1-2 business days</dd>
          </div>
          {productType ? (
            <div className="flex justify-between gap-4">
              <dt className="font-black text-[#101820]">Type</dt>
              <dd className="text-right text-[#61707f]">{productType}</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            'FIE sourcing',
            'Club orders',
            'Secure checkout',
          ].map((label) => (
            <div className="product-assurance" key={label}>
              <span aria-hidden="true">◆</span>
              <strong>{label}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="min-w-0 md:col-span-2">
        <ProductDetailsTabs
          descriptionHtml={proxiedDescriptionHtml}
          detailCopy={detailCopy}
          galleryImages={galleryImages}
          product={{
            title,
            vendor,
            productType,
            tags,
          }}
          selectedVariant={selectedVariant}
          variantNodes={variantNodes}
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

function ProductDetailsTabs({
  descriptionHtml,
  detailCopy,
  galleryImages,
  product,
  selectedVariant,
  variantNodes,
}) {
  const tabs = [
    {id: 'description', label: 'Description'},
    {id: 'specifications', label: 'Specifications'},
    {id: 'sizing', label: 'Sizing & care'},
    {id: 'shipping', label: 'Shipping'},
    {id: 'variants', label: `Variants (${variantNodes.length})`},
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="product-info-tabs">
      <div className="product-info-tablist" role="tablist" aria-label="Product information">
        {tabs.map((tab) => (
          <button
            aria-controls={`product-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            className="product-info-tab"
            id={`product-tab-button-${tab.id}`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="product-info-panel" id={`product-tab-${activeTab}`} role="tabpanel">
        {activeTab === 'description' ? (
          <ProductDescription
            descriptionHtml={descriptionHtml}
            detailCopy={detailCopy}
            galleryImages={galleryImages}
            title={product.title}
          />
        ) : null}

        {activeTab === 'specifications' ? (
          <ProductSpecifications
            product={product}
            selectedVariant={selectedVariant}
          />
        ) : null}

        {activeTab === 'sizing' ? <SizingAndCare /> : null}

        {activeTab === 'shipping' ? <ShippingPanel /> : null}

        {activeTab === 'variants' ? <VariantList variantNodes={variantNodes} /> : null}
      </div>
    </div>
  );
}

function ProductDescription({descriptionHtml, detailCopy, galleryImages, title}) {
  if (descriptionHtml) {
    return (
      <>
        <p className="mb-3 text-xs font-black uppercase text-[#c92337]">
          Product details
        </p>
        <div
          className="product-detail-copy max-w-4xl leading-8 text-[#61707f]"
          dangerouslySetInnerHTML={{__html: descriptionHtml}}
        />
      </>
    );
  }

  if (galleryImages.length) {
    return (
      <div className="product-detail-gallery grid gap-4 md:grid-cols-2">
        {galleryImages.map((image) => (
          <img
            alt={image.altText || title}
            className="w-full rounded-lg border border-[#d9e0e7] bg-[#f7f8fa] object-contain"
            key={image.id || image.url}
            src={image.url}
          />
        ))}
      </div>
    );
  }

  return <p className="max-w-4xl leading-8 text-[#61707f]">{detailCopy}</p>;
}

function ProductSpecifications({product, selectedVariant}) {
  const rows = [
    ['Brand', product.vendor || 'BladeCraft'],
    ['Product type', product.productType || 'Fencing equipment'],
    ['SKU', selectedVariant?.sku || 'Pending'],
    ['Availability', selectedVariant?.availableForSale ? 'Available' : 'Sold out'],
    ['Tags', product.tags?.length ? product.tags.join(', ') : 'Not specified'],
  ];

  return (
    <dl className="product-spec-table">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SizingAndCare() {
  return (
    <div className="grid gap-5 leading-7 text-[#61707f] md:grid-cols-2">
      <div>
        <h3 className="mb-2 text-lg font-black text-[#101820]">Sizing</h3>
        <p>
          Confirm height, weight, dominant hand, and competition category before
          checkout. Club orders can be checked size-by-size before fulfillment.
        </p>
      </div>
      <div>
        <h3 className="mb-2 text-lg font-black text-[#101820]">Care</h3>
        <p>
          Follow the garment label. Keep masks and weapons dry after use, and
          inspect cords, seams, and protective layers before competition.
        </p>
      </div>
    </div>
  );
}

function ShippingPanel() {
  return (
    <div className="grid gap-5 leading-7 text-[#61707f] md:grid-cols-3">
      {[
        ['Dispatch', 'Most available items ship in 1-2 business days after payment confirmation.'],
        ['Club orders', 'Bulk orders can be quoted and confirmed before checkout.'],
        ['Returns', 'Return eligibility depends on product condition, sizing, and customization.'],
      ].map(([title, copy]) => (
        <div key={title}>
          <h3 className="mb-2 text-lg font-black text-[#101820]">{title}</h3>
          <p>{copy}</p>
        </div>
      ))}
    </div>
  );
}

function VariantList({variantNodes}) {
  if (!variantNodes.length) {
    return <p className="text-[#61707f]">No variant information available.</p>;
  }

  return (
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
  );
}

function ProductGallery({fallbackImage, images, title}) {
  const galleryImages = images.length ? images : fallbackImage ? [fallbackImage] : [];
  const firstImage = fallbackImage || galleryImages[0];
  const [activeImage, setActiveImage] = useState(firstImage);

  useEffect(() => {
    setActiveImage(firstImage);
  }, [firstImage]);

  return (
    <div className="product-gallery grid gap-4">
      <div className="overflow-hidden rounded-lg bg-[#d9e0e7]">
        <ProductImage image={activeImage} />
      </div>
      {galleryImages.length > 1 ? (
        <div className="product-gallery-thumbs flex gap-3 overflow-x-auto pb-1">
          {galleryImages.map((image, index) => {
            const isActive = getImageKey(image) === getImageKey(activeImage);

            return (
              <button
                aria-label={`View ${title} image ${index + 1}`}
                aria-pressed={isActive}
                className={`product-gallery-thumb${isActive ? ' active' : ''}`}
                key={getImageKey(image)}
                onClick={() => setActiveImage(image)}
                type="button"
              >
                <img alt={image.altText || title} src={image.url} />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function getGalleryImages({mediaNodes}) {
  const images = (mediaNodes || [])
    .filter((node) => node?.mediaContentType === 'IMAGE')
    .map((node) => node.image || node.previewImage)
    .filter(Boolean)
    .slice(0, 6);

  return images.filter((image, index, allImages) => {
    const key = image.url || image.id;
    return key && allImages.findIndex((item) => (item.url || item.id) === key) === index;
  });
}

function getImageKey(image) {
  return image?.id || image?.url || '';
}

function rewriteDescriptionImageUrls(html) {
  if (!html) return '';

  return html.replace(
    /(<img\b[^>]*?\bsrc=)(["'])(https?:\/\/[^"']+)(\2)/gi,
    (match, prefix, quote, sourceUrl, suffix) => {
      if (!shouldProxyImageUrl(sourceUrl)) return match;

      return `${prefix}${quote}/api/image-proxy?url=${encodeURIComponent(
        sourceUrl,
      )}${suffix}`;
    },
  );
}

function shouldProxyImageUrl(sourceUrl) {
  try {
    const url = new URL(sourceUrl);
    return /(^|\.)((alicdn|taobao|tbcdn)\.com|alicdn\.com)$/i.test(url.hostname);
  } catch {
    return false;
  }
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
    media(first: 6) {
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
