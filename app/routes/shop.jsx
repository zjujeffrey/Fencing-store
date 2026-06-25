import {Await, Link, useLoaderData, useSearchParams} from 'react-router';
import {Suspense} from 'react';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import fencerMask from '~/assets/fencer-mask.jpg';
import fencerWeapon from '~/assets/fencer-weapon.jpg';
import categoryBags from '~/assets/category-bags.jpg';
import categoryClothing from '~/assets/category-clothing.jpg';
import categoryMasks from '~/assets/category-masks.jpg';
import categoryScoring from '~/assets/category-scoring.jpg';
import categoryStarterKits from '~/assets/category-starter-kits.jpg';
import categoryWeapons from '~/assets/category-weapons.jpg';
import {FENCING_CATEGORIES} from '~/lib/fencingCategories';
import {
  getProductDisplayDescription,
  getProductDisplayTitle,
} from '~/lib/productPresentation';

export const meta = () => [{title: 'Shop Fencing Gear | BladeCraft'}];

export async function loader({context}) {
  const collections = context.storefront
    .query(SHOP_COLLECTIONS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {collections};
}

export default function Shop() {
  const {collections} = useLoaderData();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');

  return (
    <main className="bc-shop">
      <Suspense fallback={<ShopLoading />}>
        <Await resolve={collections}>
          {(response) => {
            const collectionNodes = response?.collections?.nodes || [];

            return (
              <ShopExperience
                collections={collectionNodes}
                selectedCategory={selectedCategory}
              />
            );
          }}
        </Await>
      </Suspense>
    </main>
  );
}

function ShopExperience({collections, selectedCategory}) {
  const populatedCollections = orderCollections(
    collections.filter((collection) => collection.products.nodes.length),
  );
  const activeCollection = populatedCollections.find(
    (collection) => collection.handle === selectedCategory,
  );
  const activeCategory = activeCollection
    ? getCategory(activeCollection)
    : null;

  return (
    <>
      <InnerHero
        title={activeCollection?.title || 'Shop the full fencing kit.'}
        eyebrow={activeCollection ? 'Equipment collection' : 'Equipment catalog'}
        image={
          activeCollection
            ? getCategoryImage(activeCategory?.id)
            : fencerWeapon
        }
      >
        {activeCollection
          ? activeCollection.description ||
            activeCategory?.copy ||
            'Competition-ready fencing equipment selected for this category.'
          : 'Find competition masks, whites, weapons, bags, scoring sets, and entry-level bundles for foil, epee, and sabre.'}
      </InnerHero>

      <ShopCatalog
        collections={populatedCollections}
        selectedCategory={selectedCategory}
      />
    </>
  );
}

function ShopCatalog({collections, selectedCategory}) {
  const populatedCollections = collections;
  const activeCollection = populatedCollections.find(
    (collection) => collection.handle === selectedCategory,
  );
  const visibleCollections = activeCollection
    ? [activeCollection]
    : populatedCollections;

  if (!populatedCollections.length) {
    return (
      <section className="px-5 py-16 md:px-14 md:py-24">
        <div className="rounded-lg border border-[#d9e0e7] bg-white p-6">
          No published Shopify collections were found.
        </div>
      </section>
    );
  }

  return (
    <section className="bc-shop-catalog grid gap-8 px-5 py-16 md:grid-cols-[220px_1fr] md:px-14 md:py-24">
      <aside className="bc-shop-sidebar hidden self-start rounded-lg border border-[#d9e0e7] bg-white p-3 md:grid">
        <Link
          className={`bc-shop-sidebar-link ${
            activeCollection ? '' : 'active'
          }`}
          to="/shop"
        >
          All products
        </Link>
        {populatedCollections.map((collection) => (
          <Link
            className={`bc-shop-sidebar-link ${
              activeCollection?.handle === collection.handle
                ? 'active'
                : ''
            }`}
            to={getShopCategoryUrl(collection.handle)}
            key={collection.id}
          >
            {getCollectionLabel(collection)}
            <span className="ml-2 text-xs opacity-70">
              {collection.products.nodes.length}
            </span>
          </Link>
        ))}
      </aside>

      <div className="bc-shop-content min-w-0">
        <div className={`flex flex-col justify-between gap-6 md:flex-row md:items-end ${
          activeCollection ? 'mb-6' : 'mb-8'
        }`}>
          {!activeCollection ? (
            <div>
              <p className="mb-3 text-xs font-black uppercase text-[#c92337]">
                Shopify collections
              </p>
              <h2 className="max-w-4xl text-[clamp(2rem,4vw,4.2rem)] font-black leading-none">
                Built for practice, tournaments, and club rooms.
              </h2>
            </div>
          ) : (
            <p className="text-sm font-black uppercase text-[#61707f]">
              {activeCollection.products.nodes.length} products
            </p>
          )}
          <Button to="/club" variant="outline">
            Club quote
          </Button>
        </div>

        {!activeCollection ? (
          <FeaturedCollections collections={populatedCollections} />
        ) : null}

        <div className="grid gap-16">
          {visibleCollections.map((collection) => (
            <CollectionSection
              collection={collection}
              isFiltered={Boolean(activeCollection)}
              key={collection.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCollections({collections}) {
  const featured = collections.slice(0, 6);

  return (
    <div className="bc-shop-category-grid mb-14 grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
      {featured.map((collection) => {
        const category = getCategory(collection);

        return (
          <CategoryTile
            title={collection.title}
            copy={collection.description || category?.copy || 'Explore the collection'}
            href={getShopCategoryUrl(collection.handle)}
            image={getCategoryImage(category?.id)}
            key={collection.id}
          />
        );
      })}
    </div>
  );
}

function CollectionSection({collection, isFiltered}) {
  return (
    <section
      className="scroll-mt-28 border-t border-[#d9e0e7] pt-8"
      id={collection.handle}
    >
      <div
        className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-end ${
          isFiltered ? 'sm:justify-end' : 'sm:justify-between'
        }`}
      >
        {!isFiltered ? (
          <div>
            <p className="mb-2 text-xs font-black uppercase text-[#c92337]">
              {collection.products.nodes.length} products
            </p>
            <h2 className="text-[clamp(1.8rem,3vw,3rem)] font-black leading-none">
              {collection.title}
            </h2>
            {collection.description ? (
              <p className="mt-3 max-w-3xl leading-7 text-[#61707f]">
                {collection.description}
              </p>
            ) : null}
          </div>
        ) : null}
        <Link
          className="font-black text-[#0a7c86] hover:text-[#c92337]"
          to={isFiltered ? '/shop' : getShopCategoryUrl(collection.handle)}
        >
          {isFiltered ? 'View all products' : `View only ${collection.title}`}
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {collection.products.nodes.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({product}) {
  const selectedVariant = product.selectedOrFirstAvailableVariant;
  const displayTitle = getProductDisplayTitle(product);
  const displayDescription = getProductDisplayDescription(product);

  return (
    <article className="min-w-0 overflow-hidden rounded-lg border border-[#d9e0e7] bg-white shadow-sm">
      <Link
        className="shop-product-image"
        to={`/products/${product.handle}`}
      >
        {product.featuredImage ? (
          <img
            alt={product.featuredImage.altText || displayTitle}
            src={product.featuredImage.url}
          />
        ) : (
          <img alt="" src={fencerMask} />
        )}
      </Link>
      <div className="p-5">
        <p className="mb-3 inline-flex rounded bg-[#c92337]/10 px-2 py-1 text-xs font-black uppercase text-[#c92337]">
          {product.vendor || 'Shopify'}
        </p>
        <h3 className="mb-2 text-lg font-black">
          <Link className="hover:text-[#c92337]" to={`/products/${product.handle}`}>
            {displayTitle}
          </Link>
        </h3>
        {displayDescription ? (
          <p className="shop-product-summary">{displayDescription}</p>
        ) : null}
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
    <Link
      className="bc-shop-category-tile group relative flex min-h-64 flex-col justify-end overflow-hidden rounded-lg p-6 text-white"
      to={href}
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
    </Link>
  );
}

function ShopLoading() {
  return (
    <>
      <InnerHero
        title="Shop the full fencing kit."
        eyebrow="Equipment catalog"
        image={fencerWeapon}
      >
        Find competition masks, whites, weapons, bags, scoring sets, and
        entry-level bundles for foil, epee, and sabre.
      </InnerHero>
      <section className="px-5 py-16 md:px-14 md:py-24">
        <p className="font-black text-[#61707f]">
          Loading Shopify collections...
        </p>
      </section>
    </>
  );
}

function orderCollections(collections) {
  const categoryOrder = new Map(
    FENCING_CATEGORIES.map((category, index) => [category.id, index]),
  );

  return [...collections].sort((left, right) => {
    const leftOrder = categoryOrder.get(getCategory(left)?.id) ?? 999;
    const rightOrder = categoryOrder.get(getCategory(right)?.id) ?? 999;

    return leftOrder - rightOrder || left.title.localeCompare(right.title);
  });
}

function getCategory(collection) {
  const normalizedTitle = collection.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return FENCING_CATEGORIES.find(
    (category) =>
      category.id === collection.handle ||
      category.id === normalizedTitle ||
      category.label.toLowerCase() === collection.title.toLowerCase(),
  );
}

function getCategoryImage(categoryId) {
  const categoryImages = {
    weapons: categoryWeapons,
    blades: categoryWeapons,
    masks: categoryMasks,
    clothing: categoryClothing,
    protective: categoryClothing,
    scoring: categoryScoring,
    bags: categoryBags,
    'starter-kits': categoryStarterKits,
    parts: categoryScoring,
  };

  return categoryImages[categoryId] || categoryWeapons;
}

function getShopCategoryUrl(handle) {
  return `/shop?category=${encodeURIComponent(handle)}`;
}

function getCollectionLabel(collection) {
  return getCategory(collection)?.label || collection.title;
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

const SHOP_COLLECTIONS_QUERY = `#graphql
  query ShopCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 50, sortKey: TITLE) {
      nodes {
        id
        title
        handle
        description
        products(first: 50, sortKey: TITLE) {
          nodes {
            id
            title
            handle
            vendor
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
    }
  }
`;
