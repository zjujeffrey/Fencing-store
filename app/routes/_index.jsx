import {Suspense} from 'react';
import {Await, Link, useLoaderData} from 'react-router';
import fencerMask from '~/assets/fencer-mask.jpg';
import fencerPair from '~/assets/fencer-pair.jpg';
import fencerWeapon from '~/assets/fencer-weapon.jpg';
import fencerClothing from '~/assets/fencer-clothing.jpg';
import fencerScoring from '~/assets/fencer-scoring.jpg';
import gearBag from '~/assets/gear-bag.jpg';
import {getProductCardImage} from '~/lib/productImageLocalization';
import {getProductDisplayTitle} from '~/lib/productPresentation';

export const meta = () => [
  {title: 'Bladecraft | Performance Fencing Equipment'},
  {
    name: 'description',
    content:
      'Competition-minded fencing equipment for foil, epee, and sabre athletes.',
  },
];

export async function loader({context}) {
  const featuredProducts = context.storefront
    .query(FEATURED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {featuredProducts};
}

const audiences = [
  {
    number: 'No. 01',
    title: 'Individual',
    copy: 'A complete kit for practice, travel, and the competition floor.',
    cta: 'Shop for myself',
    to: '/shop',
    image: fencerWeapon,
  },
  {
    number: 'No. 02',
    title: 'Fencing Club',
    copy: 'Consistent size runs, team pricing, and simple repeat orders.',
    cta: 'Outfit my club',
    to: '/club',
    image: fencerPair,
  },
  {
    number: 'No. 03',
    title: 'Coach & Program',
    copy: 'Durable equipment selected for lessons, classes, and shared use.',
    cta: 'Build a program',
    to: '/club',
    image: fencerScoring,
  },
];

const needs = [
  {
    number: 'No. 04',
    title: 'Starter Kits',
    copy: 'The essentials for a first season, selected as one coherent setup.',
    cta: 'Shop starter kits',
    to: '/shop?category=starter-kits',
    image: gearBag,
  },
  {
    number: 'No. 05',
    title: 'Competition',
    copy: 'Protective equipment and electrics prepared for tournament days.',
    cta: 'Shop competition',
    to: '/shop',
    image: fencerMask,
  },
  {
    number: 'No. 06',
    title: 'Whites & Lames',
    copy: 'Clean lines, reliable protection, and movement without distraction.',
    cta: 'Shop apparel',
    to: '/shop?category=clothing',
    image: fencerClothing,
  },
];

const standards = [
  ['01', 'Purpose selected', 'Every item has a clear role in a fencer’s kit.'],
  ['02', 'Bout tested', 'Built around repeated lessons, drills, and travel.'],
  ['03', 'Size supported', 'Practical fit guidance before you place the order.'],
  ['04', 'Club ready', 'Straightforward reorders for coaches and programs.'],
];

export default function Homepage() {
  const {featuredProducts} = useLoaderData();

  return (
    <main className="bc-editorial">
      <section className="bc-home-hero">
        <img
          alt="Fencer preparing for competition"
          className="bc-home-hero-image"
          src={fencerWeapon}
        />
        <div className="bc-home-hero-shade" />
        <div className="bc-home-hero-copy">
          <p className="bc-eyebrow">Equipment for deliberate athletes</p>
          <h1>Fence with intent.</h1>
          <p>
            Performance fencing equipment designed for the work between first
            lesson and final touch.
          </p>
          <div className="bc-button-row">
            <EditorialButton to="/shop">Shop the collection</EditorialButton>
            <EditorialButton to="#bladecraft-standard" variant="outline">
              Our standard
            </EditorialButton>
          </div>
        </div>
      </section>

      <section className="bc-trust-strip" aria-label="Store benefits">
        {[
          ['3', 'Weapons covered'],
          ['350N+', 'Protection options'],
          ['1–2', 'Business day dispatch'],
          ['30', 'Day returns'],
          ['Club', 'Order support'],
          ['Global', 'Delivery ready'],
        ].map(([number, label]) => (
          <div key={label}>
            <strong>{number}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <EditorialTiles
        eyebrow="I’m shopping as"
        title="Built around how you fence."
        tiles={audiences}
      />

      <EditorialTiles
        eyebrow="Find what you need"
        title="Start with the task."
        tiles={needs}
      />

      <section className="bc-story" id="bladecraft-standard">
        <div className="bc-story-image">
          <img alt="Two fencers training together" src={fencerPair} />
        </div>
        <div className="bc-story-copy">
          <p className="bc-eyebrow">Why Bladecraft exists</p>
          <h2>Good equipment should disappear into the bout.</h2>
          <p>
            Bladecraft is built around a simple idea: a fencer should be
            thinking about distance, timing, and the next action, not fighting
            their gear. We select equipment for clean function, reliable fit,
            and the reality of repeated training.
          </p>
          <p>
            From first club kit to competition upgrades, every product should
            have a reason to be in the bag.
          </p>
          <Link className="bc-text-link" to="/pages/about">
            Read our approach <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="bc-standard">
        <div className="bc-standard-head">
          <p className="bc-eyebrow">The Bladecraft standard</p>
          <h2>Details that earn their place in your kit.</h2>
          <p>
            Clear specifications, useful sizing, and products chosen for the
            rhythms of real training.
          </p>
        </div>
        <div className="bc-standard-grid">
          {standards.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bc-feature-band">
        <img alt="Fencer working with a blade" src={fencerWeapon} />
        <div>
          <p className="bc-eyebrow">Made for the next action</p>
          <h2>Beyond the strip.</h2>
          <p>
            Equipment for practice nights, tournament weekends, repairs,
            travel, and the long work of getting better.
          </p>
          <EditorialButton to="/collections/all" variant="dark">
            Shop everything
          </EditorialButton>
        </div>
      </section>

      <section className="bc-products-section">
        <div className="bc-section-heading">
          <div>
            <p className="bc-eyebrow">Selected equipment</p>
            <h2>Ready for the next bout.</h2>
          </div>
          <Link className="bc-text-link" to="/collections/all">
            View all products <span aria-hidden="true">→</span>
          </Link>
        </div>
        <Suspense fallback={<p>Loading products…</p>}>
          <Await resolve={featuredProducts}>
            {(response) => (
              <ProductGrid products={response?.products?.nodes || []} />
            )}
          </Await>
        </Suspense>
      </section>

      <section className="bc-club-callout">
        <p className="bc-eyebrow">For coaches and programs</p>
        <h2>One order. A whole salle ready to fence.</h2>
        <p>
          Get help with size runs, weapon standards, spare parts, and repeatable
          equipment lists for your club.
        </p>
        <div className="bc-button-row">
          <EditorialButton to="/club">Request a club quote</EditorialButton>
          <EditorialButton to="/pages/sizing" variant="outline">
            View sizing
          </EditorialButton>
        </div>
      </section>

      <section className="bc-newsletter">
        <p className="bc-eyebrow">Bladecraft dispatch</p>
        <h2>Stay on the list.</h2>
        <p>
          Product releases, field notes, sizing guides, and practical equipment
          advice.
        </p>
        <form action="/search" className="bc-newsletter-form">
          <input
            aria-label="Email address"
            name="email"
            placeholder="your-email@inbox.com"
            type="email"
          />
          <button type="submit">Join the list</button>
        </form>
      </section>
    </main>
  );
}

function EditorialTiles({eyebrow, title, tiles}) {
  return (
    <section className="bc-tile-section">
      <header>
        <p className="bc-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </header>
      <div className="bc-editorial-tiles">
        {tiles.map((tile) => (
          <Link className="bc-editorial-tile" key={tile.title} to={tile.to}>
            <img alt="" src={tile.image} />
            <span className="bc-editorial-tile-shade" />
            <div className="bc-product-card-image">
              <small>{tile.number}</small>
              <h3>{tile.title}</h3>
              <p>{tile.copy}</p>
              <strong>
                {tile.cta} <span aria-hidden="true">→</span>
              </strong>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProductGrid({products}) {
  if (!products.length) {
    return (
      <div className="bc-empty-state">
        Publish products in Shopify to populate this collection.
      </div>
    );
  }

  return (
    <div className="bc-product-grid">
      {products.map((product) => {
        const price = product.priceRange.minVariantPrice;
        const displayTitle = getProductDisplayTitle(product);
        const image = getProductCardImage(product);
        return (
          <Link
            className="bc-product-card"
            key={product.id}
            to={`/products/${product.handle}`}
          >
            <div>
              {image ? (
                <img
                  alt={image.altText || displayTitle}
                  src={image.url}
                />
              ) : (
                <img alt="" src={fencerMask} />
              )}
            </div>
            <h3>{displayTitle}</h3>
            <p>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: price.currencyCode,
              }).format(Number(price.amount))}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

function EditorialButton({children, to, variant = 'light'}) {
  return (
    <Link className={`bc-editorial-button ${variant}`} to={to}>
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
        images(first: 8) {
          nodes {
            url
            altText
          }
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
