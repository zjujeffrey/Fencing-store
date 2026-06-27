import {Suspense, useEffect, useState} from 'react';
import {Await, Link, useLoaderData} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  Money,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {
  getProductDetailContent,
  getProductDisplayDescription,
  getProductDisplayTitle,
} from '~/lib/productPresentation';
import {
  filterShopifyGalleryImages,
  getLocalizedGalleryImages,
  getProductCardImage,
  getSelectableVariantImage,
} from '~/lib/productImageLocalization';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  const displayTitle = getProductDisplayTitle(data?.product);
  return [
    {title: `${displayTitle} | BladeCraft`},
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
  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);
  const deferredData = loadDeferredData(args, criticalData.product.id);

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
function loadDeferredData({context}, productId) {
  const recommendations = context.storefront
    .query(PRODUCT_RECOMMENDATIONS_QUERY, {
      variables: {productId},
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {recommendations};
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product, recommendations} = useLoaderData();

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
    description,
    vendor,
    productType,
    tags = [],
    featuredImage,
    media,
  } = product;
  const displayTitle = getProductDisplayTitle(product);
  const displayDescription = getProductDisplayDescription(product);
  const shopifyGalleryImages = filterShopifyGalleryImages(
    product.handle,
    getGalleryImages({
      mediaNodes: media?.nodes,
    }),
  );
  const localizedGalleryImages = getLocalizedGalleryImages(product.handle);
  const variantImage = getSelectableVariantImage(product.handle, selectedVariant);
  const preferLocalizedGallery = localizedGalleryImages.length > 1;
  const galleryImages = dedupeImages([
    variantImage,
    ...(preferLocalizedGallery ? localizedGalleryImages : shopifyGalleryImages),
    ...(preferLocalizedGallery ? shopifyGalleryImages : localizedGalleryImages),
  ].filter(Boolean));
  const mainImage =
    variantImage ||
    (preferLocalizedGallery ? localizedGalleryImages[0] : shopifyGalleryImages[0]) ||
    featuredImage ||
    (preferLocalizedGallery ? shopifyGalleryImages[0] : localizedGalleryImages[0]);
  const fallbackDescription = getFallbackProductDescription({
    productType,
    title,
  });
  const detailCopy =
    description ||
    displayDescription ||
    product.seo?.description ||
    fallbackDescription;
  const shortDescription = getShortDescription(detailCopy);
  const detailContent = getProductDetailContent(product);

  return (
    <main className="product-page">
      <nav className="product-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/shop">Shop</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{displayTitle}</span>
      </nav>

      <section className="product-gallery-column min-w-0">
        <ProductGallery
          fallbackImage={mainImage}
          images={galleryImages}
          title={displayTitle}
        />
        <Suspense fallback={<RecommendationSkeleton />}>
          <Await resolve={recommendations}>
            {(data) => (
              <ProductRecommendations
                currentProductId={product.id}
                products={data?.productRecommendations || []}
              />
            )}
          </Await>
        </Suspense>
      </section>

      <section className="product-buy-panel min-w-0 self-start">
        <p className="product-kicker">
          {productType || 'Performance fencing equipment'}
        </p>
        <h1>{displayTitle}</h1>
        <p className="product-short-description">{shortDescription}</p>
        <ul className="product-highlight-list">
          {detailContent.features.slice(0, 3).map(([label]) => (
            <li key={label}>{label}</li>
          ))}
        </ul>

        <div className="product-price-row">
          <div>
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
            <p>Taxes and shipping calculated at checkout.</p>
          </div>
          <span className={`product-stock-status ${
            selectedVariant?.availableForSale
              ? 'is-available'
              : 'is-unavailable'
          }`}>
            {selectedVariant?.availableForSale ? 'In stock' : 'Sold out'}
          </span>
        </div>

        <ProductForm
          productOptions={productOptions}
          selectedVariant={selectedVariant}
        />

        <ProductPurchaseMeta
          productType={productType}
          selectedVariant={selectedVariant}
          vendor={vendor}
        />
      </section>

      <section className="product-details-section min-w-0">
        <ProductDetailsTabs
          detailCopy={detailCopy}
          product={{
            handle: product.handle,
            title,
            vendor,
            productType,
            tags,
          }}
          selectedVariant={selectedVariant}
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

function ProductRecommendations({currentProductId, products}) {
  const {open} = useAside();
  const recommendations = products
    .filter((product) => product.id !== currentProductId)
    .slice(0, 4);

  if (!recommendations.length) return null;

  return (
    <section className="product-recommendations min-w-0">
      <header>
        <p className="bc-eyebrow">Complete your kit</p>
        <h2>You might also need.</h2>
      </header>
      <div className="product-recommendation-grid">
        {recommendations.map((product) => {
          const displayTitle = getProductDisplayTitle(product);
          const image = getProductCardImage(product);
          const variant = product.selectedOrFirstAvailableVariant;
          const canQuickAdd =
            variant?.availableForSale && product.variants?.nodes.length === 1;

          return (
            <article className="product-recommendation-card" key={product.id}>
              <Link
                className="product-recommendation-image"
                to={`/products/${product.handle}`}
              >
                {image ? (
                  <img
                    alt={image.altText || displayTitle}
                    loading="lazy"
                    src={image.url}
                  />
                ) : null}
              </Link>
              <div className="product-recommendation-copy">
                <Link to={`/products/${product.handle}`}>
                  <h3>{displayTitle}</h3>
                </Link>
                <Money data={product.priceRange.minVariantPrice} />
              </div>
              {canQuickAdd ? (
                <AddToCartButton
                  analytics={{
                    products: [
                      {
                        productGid: product.id,
                        variantGid: variant.id,
                        name: product.title,
                        price: variant.price.amount,
                        quantity: 1,
                      },
                    ],
                  }}
                  className="product-recommendation-action"
                  lines={[{merchandiseId: variant.id, quantity: 1}]}
                  onClick={() => open('cart')}
                >
                  Quick add
                </AddToCartButton>
              ) : (
                <Link
                  className="product-recommendation-action"
                  to={`/products/${product.handle}`}
                >
                  Choose options
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function RecommendationSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="product-recommendations product-recommendations-loading"
    />
  );
}

function ProductPurchaseMeta({productType, selectedVariant, vendor}) {
  const rows = [
    ['Reference', selectedVariant?.sku || 'Confirmed at checkout'],
    ['Brand', vendor || 'BladeCraft'],
    ['Category', productType || 'Fencing equipment'],
    ['Dispatch', 'Usually ships in 1-2 business days'],
  ];

  return (
    <aside className="product-purchase-meta">
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

function ProductDetailsTabs({
  detailCopy,
  product,
  selectedVariant,
}) {
  const tabs = [
    {id: 'description', label: 'Description'},
    {id: 'specifications', label: 'Specifications'},
    {id: 'sizing', label: 'Fit & care'},
    {id: 'shipping', label: 'Delivery'},
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
            detailCopy={detailCopy}
            product={product}
          />
        ) : null}

        {activeTab === 'specifications' ? (
          <ProductSpecifications
            product={product}
            selectedVariant={selectedVariant}
          />
        ) : null}

        {activeTab === 'sizing' ? <SizingAndCare product={product} /> : null}

        {activeTab === 'shipping' ? <ShippingPanel /> : null}
      </div>
    </div>
  );
}

function ProductDescription({detailCopy, product}) {
  const content = getProductDetailContent(product);

  return (
    <div className="product-overview">
      <div className="product-overview-intro">
        <p className="bc-eyebrow">{content.eyebrow}</p>
        <h2>{content.heading}</h2>
        <p>{content.intro || detailCopy}</p>
      </div>
      <div className="product-description-callout">
        <strong>BladeCraft note</strong>
        <p>
          Selected for fencers who need equipment that is easy to understand,
          practical to fit, and ready for regular club use.
        </p>
      </div>
      <div className="product-overview-features">
        {content.features.map(([title, copy]) => (
          <article key={title}>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
      <aside className="product-overview-note">
        <strong>Before you order</strong>
        <p>{content.note}</p>
      </aside>
    </div>
  );
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
    <div className="product-spec-layout">
      <dl className="product-spec-table">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <aside className="product-spec-checklist">
        <h3>Before adding to cart</h3>
        <ul>
          <li>Confirm size, color, handedness, and weapon compatibility.</li>
          <li>Review the gallery images for charts or option details.</li>
          <li>Ask your coach or club armorer when ordering competition gear.</li>
        </ul>
      </aside>
    </div>
  );
}

function SizingAndCare({product}) {
  const isFootwear = /shoe|footwear/i.test(
    `${product.title} ${product.productType || ''}`,
  );

  return (
    <div className="product-guidance-grid">
      <div>
        <h3>Choosing your size</h3>
        <p>
          {isFootwear
            ? 'Select your usual EU shoe size. If you are between sizes or prefer extra room for fencing socks, choose the larger size.'
            : 'Confirm height, weight, dominant hand, and competition category before checkout. Club orders can be checked size-by-size before fulfillment.'}
        </p>
      </div>
      <div>
        <h3>Product care</h3>
        <p>
          {isFootwear
            ? 'Air dry after training, remove loose dirt with a soft brush, and avoid machine washing or direct heat.'
            : 'Follow the garment label. Keep masks and weapons dry after use, and inspect cords, seams, and protective layers before competition.'}
        </p>
      </div>
    </div>
  );
}

function ShippingPanel() {
  return (
    <div className="product-guidance-grid product-guidance-grid-three">
      {[
        ['Dispatch', 'Most available items ship in 1-2 business days after payment confirmation.'],
        ['Club orders', 'Bulk orders can be quoted and confirmed before checkout.'],
        ['Returns', 'Return eligibility depends on product condition, sizing, and customization.'],
      ].map(([title, copy]) => (
        <div key={title}>
          <h3>{title}</h3>
          <p>{copy}</p>
        </div>
      ))}
    </div>
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
    <div className="product-gallery">
      <div className="product-gallery-stage">
        <ProductImage image={activeImage} />
      </div>
      {galleryImages.length > 1 ? (
        <div
          aria-label={`${title} image gallery`}
          className="product-gallery-thumbs"
        >
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
  return image?.url || image?.id || '';
}

function dedupeImages(images) {
  return images.filter((image, index, allImages) => {
    const key = getImageKey(image);
    return key && allImages.findIndex((item) => getImageKey(item) === key) === index;
  });
}

function getShortDescription(copy) {
  const normalized = copy.replace(/\s+/g, ' ').trim();
  const maxLength = 220;

  if (normalized.length <= maxLength) return normalized;

  const sentences = normalized.match(/[^.!?]+[.!?]+/g) || [];
  const summary = sentences
    .slice(0, 2)
    .join(' ')
    .trim();

  if (summary && summary.length <= maxLength) return summary;

  const clipped = normalized.slice(0, maxLength + 1);
  const lastSpace = clipped.lastIndexOf(' ');

  return `${clipped.slice(0, lastSpace > 150 ? lastSpace : maxLength).trim()}…`;
}

function getFallbackProductDescription({productType, title}) {
  const searchable = `${title} ${productType || ''}`.toLowerCase();

  if (/uniform|jacket|breeches|knickers|trousers/.test(searchable)) {
    return 'Competition fencing apparel designed for dependable protection, unrestricted movement, and repeated training. Available in multiple size and handedness configurations.';
  }

  if (/glove/.test(searchable)) {
    return 'A secure, flexible fencing glove built for confident weapon control and reliable hand protection during training and competition.';
  }

  if (/mask/.test(searchable)) {
    return 'A competition-focused fencing mask designed for secure coverage, clear visibility, and a stable fit through fast exchanges.';
  }

  if (/shoe|footwear/.test(searchable)) {
    return 'Fencing footwear designed for responsive footwork, stable changes of direction, and lasting comfort through lessons and competition.';
  }

  if (/foil|epee|sabre|sword|blade/.test(searchable)) {
    return 'Competition-minded fencing equipment selected for balanced handling, dependable construction, and repeated use on the piste.';
  }

  if (/set|kit/.test(searchable)) {
    return 'A coordinated fencing kit that brings essential training and competition equipment together in one practical setup.';
  }

  return 'Performance fencing equipment selected for dependable function, practical fit, and the demands of regular training.';
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

const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  query ProductRecommendations(
    $country: CountryCode
    $language: LanguageCode
    $productId: ID!
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId, intent: RELATED) {
      id
      title
      handle
      featuredImage {
        url
        altText
      }
      images(first: 8) {
        nodes {
          url
          altText
        }
      }
      variants(first: 2) {
        nodes {
          id
        }
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
        price {
          amount
          currencyCode
        }
      }
    }
  }
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
