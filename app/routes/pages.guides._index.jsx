import {Link} from 'react-router';

import {getGuideCards} from '~/lib/guideContent';

export const meta = () => [
  {title: 'Beginner Fencing Guides | Bladecraft'},
  {
    name: 'description',
    content:
      'Beginner fencing equipment guides for starter kits, first classes, youth sizing, and protection ratings.',
  },
];

export default function GuidesPage() {
  const guides = getGuideCards();

  return (
    <main className="bc-guide-page">
      <header className="bc-page-hero bc-guide-hero">
        <p className="bc-eyebrow">Fencing guides</p>
        <h1>Clear equipment advice for new fencers.</h1>
        <p>
          Practical buying guides for parents, athletes, coaches, and clubs
          choosing first fencing gear.
        </p>
      </header>

      <section className="bc-guide-grid" aria-label="Beginner fencing guides">
        {guides.map((guide) => (
          <article className="bc-guide-card" key={guide.slug}>
            <p className="bc-eyebrow">{guide.eyebrow}</p>
            <h2>
              <Link to={`/pages/guides/${guide.slug}`}>{guide.title}</Link>
            </h2>
            <p>{guide.description}</p>
            <Link className="bc-text-link" to={`/pages/guides/${guide.slug}`}>
              Read guide <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </section>

      <section className="bc-guide-cta">
        <div>
          <p className="bc-eyebrow">Ready to build a kit?</p>
          <h2>Start with the weapon and fit requirements.</h2>
          <p>
            Match the kit to foil, epee, or sabre first, then confirm size and
            protection level with your club or coach.
          </p>
        </div>
        <div className="bc-guide-cta-actions">
          <Link
            className="bc-editorial-button dark"
            to="/shop?category=starter-kits"
          >
            Shop starter kits
          </Link>
          <Link className="bc-text-link" to="/pages/sizing">
            Size guide <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
