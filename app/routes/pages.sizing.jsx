import {Link} from 'react-router';

export const meta = () => [
  {title: 'Fencing Equipment Size Guide | Bladecraft'},
  {
    name: 'description',
    content:
      'Measure for fencing masks, gloves, knickers, chest protectors, and underarm protectors.',
  },
];

const knickerRows = [
  [
    'Height',
    `5'0"–5'3"`,
    `5'2"–5'4"`,
    `5'2"–5'4"`,
    `5'4"–5'6"`,
    `5'4"–5'6"`,
    `5'6"–5'8"`,
    `5'6"–5'8"`,
    `5'8"–5'10"`,
    `5'8"–5'10"`,
    `5'8"–5'10"`,
  ],
  [
    'Waist',
    '26–27"',
    '28–29"',
    '30–31"',
    '32–33"',
    '34–35"',
    '36–37"',
    '38–39"',
    '40–41"',
    '42–43"',
    '44–45"',
  ],
  [
    'Hips',
    '31–33"',
    '33–35"',
    '35–37"',
    '37–39"',
    '39–41"',
    '41–43"',
    '43–45"',
    '45–47"',
    '47–49"',
    '49–51"',
  ],
];

const knickerSizes = [
  '28',
  '30',
  '32',
  '34',
  '36',
  '38',
  '40',
  '42',
  '44',
  '46',
];

const gloveRows = [
  ['XS', '6–6.5"', '15.2–16.5 cm', '5–6.5'],
  ['Small', '7–7.5"', '17.8–19.1 cm', '7–7.5'],
  ['Medium', '8–8.5"', '20.3–21.6 cm', '8–9'],
  ['Large', '9–9.5"', '22.9–24.1 cm', '9.5–10'],
  ['XL', '10–10.5"', '25.4–26.7 cm', '10.5–11'],
  ['XXL', '11–12"', '27.9–30.5 cm', '11.5–12'],
];

const maskRows = [
  ['XS', 'Under 21"', 'Under 53.3 cm'],
  ['Small', '21–23"', '53.3–58.4 cm'],
  ['Medium', '24–25"', '61–63.5 cm'],
  ['Large', '26–28"', '66–71.1 cm'],
  ['XL', 'Over 28"', 'Over 71.1 cm'],
];

export default function SizingPage() {
  return (
    <main className="bc-sizing-page">
      <header className="bc-page-hero bc-sizing-hero">
        <p className="bc-eyebrow">Find your fit</p>
        <h1>Fencing size guide.</h1>
        <p>
          Measure once, compare carefully, and choose equipment that stays
          secure without restricting movement.
        </p>
      </header>

      <nav className="bc-sizing-jump" aria-label="Size guide sections">
        {[
          ['Protectors', '#protectors'],
          ['Knickers', '#knickers'],
          ['Gloves', '#gloves'],
          ['Masks', '#masks'],
        ].map(([label, href]) => (
          <a href={href} key={label}>
            {label}
          </a>
        ))}
      </nav>

      <section className="bc-sizing-intro">
        <div>
          <p className="bc-eyebrow">Before you measure</p>
          <h2>Fencing fit is different from everyday clothing.</h2>
        </div>
        <div>
          <p>
            Use a flexible tape and measure over a thin base layer. Keep the
            tape level and comfortably close to the body without pulling it
            tight.
          </p>
          <p>
            A secure mask should not rock during movement. Jackets and
            protectors must allow a full lunge. Gloves should close around the
            weapon without excess material at the fingertips.
          </p>
          <p>
            When a measurement sits exactly between two sizes, select the larger
            size unless the individual product page gives different guidance.
          </p>
        </div>
      </section>

      <SizingSection
        id="protectors"
        eyebrow="Chest and underarm protection"
        title="Choose protectors by height and body measurement."
      >
        <div className="bc-sizing-two-column">
          <SizeCard title="Plastic chest protector">
            <p>
              Men’s sizing generally follows height. Women’s sizing should also
              account for bra size and chest shape.
            </p>
            <ResponsiveTable
              headers={['Size', 'Women’s reference', 'Height reference']}
              rows={[
                ['XS', 'Check product fit', `4'0"–5'0"`],
                ['Small', '32A–D / 34A–C', `5'1"–5'5"`],
                ['Medium', '34D–E / 36A–C', `5'4"–5'6"`],
                ['Large', '36D–E', `5'7"–5'11"`],
                ['XL', '36+', `6'0"+`],
              ]}
            />
          </SizeCard>

          <SizeCard title="Underarm protector">
            <p>
              Select the size primarily from the fencer’s height. The protector
              should cover the weapon-side underarm without bunching.
            </p>
            <ResponsiveTable
              headers={['Size', 'Height']}
              rows={[
                ['XS', `Under 5'0"`],
                ['Small', `5'1"–5'3"`],
                ['Medium', `5'4"–5'6"`],
                ['Large', `5'7"–5'11"`],
                ['XL', `6'0"+`],
              ]}
            />
          </SizeCard>
        </div>
      </SizingSection>

      <SizingSection
        id="knickers"
        eyebrow="Fencing pants"
        title="Measure height, natural waist, and fullest hip."
      >
        <MeasurementSteps
          steps={[
            [
              'A',
              'Height',
              'Stand straight without shoes and measure from floor to crown.',
            ],
            [
              'B',
              'Waist',
              'Measure around the natural waist while breathing normally.',
            ],
            [
              'C',
              'Hips',
              'Measure around the fullest point, keeping the tape level.',
            ],
          ]}
        />
        <div className="bc-sizing-table-scroll">
          <table className="bc-sizing-table bc-sizing-table-wide">
            <thead>
              <tr>
                <th>Measurement</th>
                {knickerSizes.map((size) => (
                  <th key={size}>EU {size}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {knickerRows.map(([label, ...values]) => (
                <tr key={label}>
                  <th>{label}</th>
                  {values.map((value, index) => (
                    <td key={`${label}-${knickerSizes[index]}`}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SizingSection>

      <SizingSection
        id="gloves"
        eyebrow="Weapon-hand fit"
        title="Measure around the palm, excluding the thumb."
      >
        <div className="bc-measure-layout">
          <MeasurementDiagram type="hand" />
          <div>
            <ol className="bc-numbered-steps">
              <li>Measure around the widest part of your dominant palm.</li>
              <li>Do not include the thumb in the loop.</li>
              <li>Add 0.5 inch to the result to determine the glove number.</li>
            </ol>
            <p className="bc-sizing-note">
              Variant codes: <strong>R</strong> is for a right-handed fencer;
              <strong> L</strong> is for a left-handed fencer.
            </p>
          </div>
        </div>
        <ResponsiveTable
          headers={[
            'Alpha size',
            'Palm + 0.5"',
            'Metric reference',
            'Glove number',
          ]}
          rows={gloveRows}
        />
      </SizingSection>

      <SizingSection
        id="masks"
        eyebrow="Secure head fit"
        title="Measure the full head circumference."
      >
        <div className="bc-measure-layout">
          <MeasurementDiagram type="head" />
          <div>
            <ol className="bc-numbered-steps">
              <li>
                Start just above the eyebrows at the center of the forehead.
              </li>
              <li>
                Run the tape above the ears and around the widest rear point.
              </li>
              <li>
                Continue beneath the chin and return to the starting point.
              </li>
            </ol>
            <p className="bc-sizing-note">
              Masks are adjustable. Before exchanging a new mask, ask a coach or
              experienced armourer to check the tongue, rear strap, and bib
              position.
            </p>
          </div>
        </div>
        <ResponsiveTable
          headers={['Mask size', 'Head circumference', 'Metric reference']}
          rows={maskRows}
        />
      </SizingSection>

      <section className="bc-sizing-help">
        <p className="bc-eyebrow">Still unsure?</p>
        <h2>Send us the measurements before ordering.</h2>
        <p>
          Include the product name, the fencer’s height, relevant body
          measurements, dominant hand, and competition level. We can help narrow
          the choice before checkout.
        </p>
        <Link className="bc-editorial-button dark" to="/pages/contact">
          Contact Bladecraft
        </Link>
      </section>
    </main>
  );
}

function SizingSection({children, eyebrow, id, title}) {
  return (
    <section className="bc-sizing-section" id={id}>
      <header>
        <p className="bc-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </header>
      {children}
    </section>
  );
}

function SizeCard({children, title}) {
  return (
    <article className="bc-size-card">
      <h3>{title}</h3>
      {children}
    </article>
  );
}

function ResponsiveTable({headers, rows}) {
  return (
    <div className="bc-sizing-table-scroll">
      <table className="bc-sizing-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('-')}>
              {row.map((value, index) =>
                index === 0 ? (
                  <th key={value}>{value}</th>
                ) : (
                  <td key={`${headers[index]}-${value}`}>{value}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MeasurementSteps({steps}) {
  return (
    <div className="bc-measurement-steps">
      {steps.map(([letter, title, copy]) => (
        <article key={letter}>
          <span>{letter}</span>
          <div>
            <h3>{title}</h3>
            <p>{copy}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function MeasurementDiagram({type}) {
  return (
    <div className={`bc-measure-diagram ${type}`} aria-hidden="true">
      <div className="bc-measure-shape">
        <span />
      </div>
      <strong>
        {type === 'hand' ? 'Palm circumference' : 'Head circumference'}
      </strong>
    </div>
  );
}
