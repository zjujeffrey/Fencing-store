import {Link, useLoaderData} from 'react-router';

import {getGuideArticle, getGuideCards} from '~/lib/guideContent';

export function loader({params}) {
  const guide = getGuideArticle(params.slug);

  if (!guide) {
    throw new Response('Guide not found', {status: 404});
  }

  return guide;
}

export const meta = ({data}) => {
  if (!data) {
    return [{title: 'Guide Not Found | Bladecraft'}];
  }

  return [
    {title: `${data.title} | Bladecraft`},
    {name: 'description', content: data.description},
  ];
};

export default function GuideArticlePage() {
  const guide = useLoaderData();
  const relatedGuides = getGuideCards().filter(
    (card) => card.slug !== guide.slug,
  );

  return (
    <main className="bc-guide-page">
      <header className="bc-page-hero bc-guide-hero">
        <p className="bc-eyebrow">{guide.eyebrow}</p>
        <h1>{guide.title}</h1>
        <p>{guide.intro}</p>
      </header>

      <div className="bc-guide-layout">
        <aside className="bc-guide-sidebar" aria-label="Guide navigation">
          <Link className="bc-text-link" to="/pages/guides">
            All guides <span aria-hidden="true">→</span>
          </Link>
          <nav>
            {guide.sections.map((section) => (
              <a href={`#${section.title.toLowerCase().replaceAll(' ', '-')}`} key={section.title}>
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <article className="bc-guide-article">
          {guide.sections.map((section) => (
            <section
              className="bc-guide-section"
              id={section.title.toLowerCase().replaceAll(' ', '-')}
              key={section.title}
            >
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              <ul className="bc-guide-list">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}

          <aside className="bc-guide-callout">
            <p className="bc-eyebrow">Bladecraft note</p>
            <p>{guide.callout}</p>
          </aside>

          <section className="bc-guide-actions" aria-label="Recommended next steps">
            {guide.relatedLinks.map(([label, to]) => (
              <Link
                className={to.includes('/shop') ? 'bc-editorial-button dark' : 'bc-text-link'}
                key={label}
                to={to}
              >
                {label}
                {!to.includes('/shop') ? <span aria-hidden="true"> →</span> : null}
              </Link>
            ))}
          </section>

          <section className="bc-guide-faq" aria-label="Frequently asked questions">
            <p className="bc-eyebrow">FAQ</p>
            <h2>Common questions</h2>
            {guide.faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </section>
        </article>
      </div>

      <section className="bc-guide-related" aria-label="More fencing guides">
        <p className="bc-eyebrow">More guides</p>
        <div>
          {relatedGuides.slice(0, 3).map((card) => (
            <Link key={card.slug} to={`/pages/guides/${card.slug}`}>
              {card.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
