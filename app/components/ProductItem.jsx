import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {getProductCardImage} from '~/lib/productImageLocalization';
import {getProductDisplayTitle} from '~/lib/productPresentation';
import {useVariantUrl} from '~/lib/variants';

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = getProductCardImage(product);
  const displayTitle = getProductDisplayTitle(product);
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {image && (
        <div className="product-item-image">
          {image.url.startsWith('/assets/') ? (
            <img
              alt={image.altText || displayTitle}
              loading={loading}
              src={image.url}
            />
          ) : (
            <Image
              alt={image.altText || displayTitle}
              aspectRatio="1/1"
              data={image}
              loading={loading}
              sizes="(min-width: 45em) 400px, 100vw"
            />
          )}
        </div>
      )}
      <h4>{displayTitle}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
