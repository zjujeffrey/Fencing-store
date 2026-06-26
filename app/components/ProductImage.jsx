import {Image} from '@shopify/hydrogen';

/**
 * @param {{
 *   image: ProductVariantFragment['image'];
 * }}
 */
export function ProductImage({image}) {
  if (!image) {
    return (
      <div className="product-image product-image-placeholder">
        <span>No image</span>
      </div>
    );
  }

  if (image.url?.startsWith('/')) {
    return (
      <div className="product-image">
        <img
          alt={image.altText || 'Product Image'}
          height={image.height}
          src={image.url}
          width={image.width}
        />
      </div>
    );
  }

  return (
    <div className="product-image">
      <Image
        alt={image.altText || 'Product Image'}
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
