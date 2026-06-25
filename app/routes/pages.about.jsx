import {Link} from 'react-router';

import fencerPair from '~/assets/fencer-pair.jpg';
import fencerWeapon from '~/assets/fencer-weapon.jpg';

export const meta = () => [
  {title: 'Our Approach | Bladecraft Fencing Gear'},
  {
    name: 'description',
    content:
      'How Bladecraft selects fencing equipment for fit, function, durability, and focused training.',
  },
];

const principles = [
  [
    '01',
    'Function before noise.',
    'Every item should solve a clear problem in training or competition. Useful specifications matter more than decorative features.',
  ],
  [
    '02',
    'Fit supports movement.',
    'Protective equipment should stay secure through footwork and blade actions without creating unnecessary restriction.',
  ],
  [
    '03',
    'Built for repetition.',
    'We favor equipment that can handle regular practice, travel, maintenance, and the demands of a growing program.',
  ],
];

export default function AboutPage() {
  return (
    <main className="bc-approach-page">
      <header className="bc-approach-hero">
        <img
          alt="Fencers training together"
          className="bc-approach-hero-image"
          src={fencerPair}
        />
        <div className="bc-approach-hero-shade" />
        <div className="bc-approach-hero-copy">
          <p className="bc-eyebrow">Our approach</p>
          <h1>Equipment should support the bout, not interrupt it.</h1>
          <p>
            Bladecraft selects fencing gear around clean function, dependable
            fit, and the realities of repeated training.
          </p>
        </div>
      </header>

      <section className="bc-approach-intro">
        <p className="bc-eyebrow">Why Bladecraft exists</p>
        <div>
          <h2>Less distraction. More deliberate fencing.</h2>
          <p>
            A fencer should be thinking about distance, timing, and the next
            action. We look for equipment that feels predictable, communicates
            its specifications clearly, and earns its place in the bag.
          </p>
        </div>
      </section>

      <section className="bc-approach-principles">
        {principles.map(([number, title, copy]) => (
          <article key={number}>
            <span>{number}</span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="bc-approach-detail">
        <div className="bc-approach-detail-image">
          <img alt="Fencer holding a weapon" src={fencerWeapon} />
        </div>
        <div className="bc-approach-detail-copy">
          <p className="bc-eyebrow">From first kit to competition kit</p>
          <h2>Choose for the fencer you are becoming.</h2>
          <p>
            Beginners need a clear, compatible foundation. Developing athletes
            need reliable upgrades. Clubs need repeatable sizing and reorder
            paths. Our collections are organized to make each decision easier
            to understand.
          </p>
          <div className="bc-approach-actions">
            <Link className="bc-editorial-button dark" to="/collections/all">
              Shop all gear
            </Link>
            <Link className="bc-text-link" to="/pages/sizing">
              Explore sizing <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
