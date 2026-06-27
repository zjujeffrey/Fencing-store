import {useEffect, useState} from 'react';
import {Form, useActionData, useNavigation} from 'react-router';
import fencerPair from '~/assets/fencer-pair.jpg';
import fencerWeapon from '~/assets/fencer-weapon.jpg';

export const meta = () => [{title: 'Club Orders | BladeCraft'}];

export async function action({context, request}) {
  const formData = await request.formData();
  const inquiry = getClubInquiry(formData);
  const deliveryResults = await deliverClubInquiry({
    env: context.env,
    inquiry,
  });

  return {
    ok: true,
    configured: deliveryResults.some((result) => result.configured),
    deliveries: deliveryResults,
    organization: inquiry.organization || 'your program',
  };
}

function getClubInquiry(formData) {
  const products = [
    ['products_starterKits', 'Starter kits'],
    ['products_masks', 'Masks'],
    ['products_uniforms', 'Jackets / breeches / plastrons'],
    ['products_weapons', 'Weapons and blades'],
    ['products_gloves', 'Gloves and socks'],
    ['products_scoring', 'Scoring equipment and cords'],
    ['products_bags', 'Team bags and storage'],
    ['products_parts', 'Replacement parts'],
  ]
    .filter(([key]) => formData.get(key) === 'Yes')
    .map(([, label]) => label);

  return {
    submittedAt: new Date().toISOString(),
    subject: formData.get('subject') || 'Club product inquiry',
    organization: String(formData.get('organization') || ''),
    name: String(formData.get('name') || ''),
    email: String(formData.get('email') || ''),
    phone: String(formData.get('phone') || ''),
    organizationType: String(formData.get('organizationType') || ''),
    orderSize: String(formData.get('orderSize') || ''),
    products,
    timeline: String(formData.get('timeline') || ''),
    shippingPreference: String(formData.get('shippingPreference') || ''),
    notes: String(formData.get('notes') || ''),
  };
}

async function deliverClubInquiry({env, inquiry}) {
  const deliveries = await Promise.all([
    sendClubInquiryEmail({env, inquiry}),
    sendClubInquiryToSheet({env, inquiry}),
  ]);

  return deliveries;
}

async function sendClubInquiryEmail({env, inquiry}) {
  const apiKey = env.RESEND_API_KEY;
  const to = env.CLUB_INQUIRY_EMAIL_TO;
  const from = env.CLUB_INQUIRY_EMAIL_FROM || 'BladeCraft <onboarding@resend.dev>';

  if (!apiKey || !to) {
    return {channel: 'email', configured: false, ok: false};
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: inquiry.email || undefined,
        subject: `Club inquiry: ${inquiry.organization || inquiry.name}`,
        text: formatInquiryText(inquiry),
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    return {
      channel: 'email',
      configured: true,
      ok: response.ok,
      status: response.status,
    };
  } catch (error) {
    console.error('Club inquiry email delivery failed', error);
    return {channel: 'email', configured: true, ok: false};
  }
}

async function sendClubInquiryToSheet({env, inquiry}) {
  const webhookUrl = env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    return {channel: 'google_sheets', configured: false, ok: false};
  }

  try {
    const response = await fetch(webhookUrl, {
      body: JSON.stringify(inquiry),
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
    });

    return {
      channel: 'google_sheets',
      configured: true,
      ok: response.ok,
      status: response.status,
    };
  } catch (error) {
    console.error('Club inquiry sheet delivery failed', error);
    return {channel: 'google_sheets', configured: true, ok: false};
  }
}

function formatInquiryText(inquiry) {
  return [
    'New BladeCraft club product inquiry',
    '',
    `Submitted at: ${inquiry.submittedAt}`,
    `Organization: ${inquiry.organization}`,
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone || '-'}`,
    `Organization type: ${inquiry.organizationType}`,
    `Order size: ${inquiry.orderSize}`,
    `Products: ${inquiry.products.length ? inquiry.products.join(', ') : '-'}`,
    `Timeline: ${inquiry.timeline}`,
    `Shipping preference: ${inquiry.shippingPreference}`,
    '',
    'Notes:',
    inquiry.notes || '-',
  ].join('\n');
}

export default function Club() {
  const actionData = useActionData();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    if (actionData?.ok) setIsInquiryOpen(true);
  }, [actionData]);

  useEffect(() => {
    document.body.style.overflow = isInquiryOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isInquiryOpen]);

  return (
    <main>
      <section className="relative grid min-h-[560px] items-end overflow-hidden bg-[#101820] px-5 py-16 text-white md:px-20 md:py-24">
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          src={fencerPair}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101820] via-[#101820]/65 to-[#101820]/10" />
        <div className="relative max-w-3xl">
          <p className="mb-3 text-xs font-black uppercase text-[#d59b24]">
            Club outfitting
          </p>
          <h1 className="mb-5 text-[clamp(2.6rem,7vw,6rem)] font-black leading-none">
            Order for the whole salle with one clean plan.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-white/85">
            Standardize sizing, starter bundles, weapon parts, and reorder
            lists for clubs, schools, camps, and coaching programs.
          </p>
          <button
            className="club-hero-link"
            onClick={() => setIsInquiryOpen(true)}
            type="button"
          >
            Start an inquiry
          </button>
        </div>
      </section>

      <section className="grid gap-5 px-5 py-16 md:grid-cols-3 md:px-14 md:py-24">
        {[
          ['1. Build the kit list', 'Choose weapon type, athlete count, safety level, and spare part ratios.'],
          ['2. Confirm sizing', 'Map jacket, breeches, glove, mask, and lame sizes by athlete group.'],
          ['3. Ship in batches', 'Receive labeled cartons for teams, coaches, or equipment rooms.'],
        ].map(([title, copy]) => (
          <article
            className="min-h-64 rounded-lg border border-[#d9e0e7] bg-white p-7"
            key={title}
          >
            <div className="mb-10 text-3xl text-[#c92337]">◆</div>
            <h2 className="mb-3 text-3xl font-black leading-none">{title}</h2>
            <p className="leading-7 text-[#61707f]">{copy}</p>
          </article>
        ))}
      </section>

      <section
        className="grid gap-8 bg-cover bg-center px-5 py-16 text-white md:grid-cols-[1fr_.68fr] md:px-14 md:py-24"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(16,24,32,.96),rgba(16,24,32,.76)),url(${fencerWeapon})`,
        }}
      >
        <div>
          <p className="mb-3 text-xs font-black uppercase text-[#d59b24]">
            Recommended pack
          </p>
          <h2 className="text-[clamp(2rem,4vw,4.2rem)] font-black leading-none">
            Foil starter room for 12 athletes.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-white/75">
            Twelve masks, twelve jackets, twelve gloves, eight electric foils,
            bodycords, two test boxes, and repair parts for a full semester.
          </p>
        </div>
        <div className="rounded-lg border border-white/25 bg-white/10 p-6">
          <h3 className="mb-4 text-2xl font-black">Request a club quote</h3>
          <p className="leading-7 text-white/75">
            Send us your roster size and weapon mix. We will turn it into a
            Shopify draft order or product bundle for approval.
          </p>
          <button
            className="club-panel-link"
            onClick={() => setIsInquiryOpen(true)}
            type="button"
          >
            Open inquiry form
          </button>
        </div>
      </section>

      {isInquiryOpen ? (
        <ClubInquiryModal
          actionData={actionData}
          onClose={() => setIsInquiryOpen(false)}
        />
      ) : null}
    </main>
  );
}

function ClubInquiryModal({actionData, onClose}) {
  return (
    <div
      aria-labelledby="club-inquiry-title"
      aria-modal="true"
      className="club-inquiry-modal"
      role="dialog"
    >
      <button
        aria-label="Close inquiry form"
        className="club-inquiry-backdrop"
        onClick={onClose}
        type="button"
      />
      <div className="club-inquiry-modal-panel">
        <button
          aria-label="Close inquiry form"
          className="club-inquiry-close"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
        <ClubInquiryForm actionData={actionData} />
      </div>
    </div>
  );
}

function ClubInquiryForm({actionData}) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <section className="club-inquiry" id="club-inquiry">
      <div className="club-inquiry-header">
        <p className="bc-eyebrow">Product inquiry</p>
        <h2 id="club-inquiry-title">Tell us what your team needs.</h2>
        <p>
          Share your organization, product mix, order size, timeline, and any
          special requirements. We will use this to prepare a practical club
          quote.
        </p>
      </div>

      <div className="club-inquiry-shell">
        <aside className="club-inquiry-aside">
          <p>Good for</p>
          <ul>
            <li>Club starter kits and reorder lists</li>
            <li>School and camp equipment rooms</li>
            <li>Weapon, mask, uniform, and scoring bundles</li>
            <li>Staged shipments by coach, team, or athlete group</li>
          </ul>
        </aside>

        <Form className="club-inquiry-form" method="post">
          {actionData?.ok ? (
            <div className="club-form-success" role="status">
              Inquiry received for {actionData.organization}. We will review
              the request and follow up with the next step.
              {!actionData.configured ? (
                <span>
                  {' '}
                  Receiving channels are not configured yet, so this local
                  submission was not sent to email or Google Sheets.
                </span>
              ) : null}
            </div>
          ) : null}

          <input name="subject" type="hidden" value="Club product inquiry" />

          <div className="club-form-grid">
            <Field id="club-organization" label="Organization name *">
              <input
                id="club-organization"
                name="organization"
                placeholder="BladeCraft Fencing Club"
                required
                type="text"
              />
            </Field>
            <Field id="club-name" label="Your name *">
              <input
                id="club-name"
                name="name"
                placeholder="Your full name"
                required
                type="text"
              />
            </Field>
            <Field id="club-email" label="Email *">
              <input
                id="club-email"
                name="email"
                placeholder="you@club.org"
                required
                type="email"
              />
            </Field>
            <Field id="club-phone" label="Phone">
              <input
                id="club-phone"
                name="phone"
                placeholder="(555) 555-5555"
                type="tel"
              />
            </Field>
          </div>

          <ChoiceGroup
            label="Type of organization *"
            name="organizationType"
            options={[
              'Fencing club',
              'School / PE program',
              'College team',
              'Camp or clinic',
              'Other',
            ]}
          />

          <ChoiceGroup
            label="Approximate order size *"
            name="orderSize"
            options={[
              'Under 15 units',
              '15-50 units',
              '50-100 units',
              '100+ units',
            ]}
            defaultValue="15-50 units"
          />

          <CheckGroup
            label="Products of interest"
            options={[
              ['starterKits', 'Starter kits'],
              ['masks', 'Masks'],
              ['uniforms', 'Jackets / breeches / plastrons'],
              ['weapons', 'Weapons and blades'],
              ['gloves', 'Gloves and socks'],
              ['scoring', 'Scoring equipment and cords'],
              ['bags', 'Team bags and storage'],
              ['parts', 'Replacement parts'],
            ]}
          />

          <ChoiceGroup
            label="Timeline *"
            name="timeline"
            options={['This month', 'This season', 'Planning ahead']}
            defaultValue="This season"
          />

          <ChoiceGroup
            label="Shipping preference"
            name="shippingPreference"
            options={[
              'Single bulk shipment',
              'Ship by batch',
              'Direct to members',
              'Not sure yet',
            ]}
            defaultValue="Single bulk shipment"
          />

          <Field id="club-notes" label="Anything else we should know?">
            <textarea
              id="club-notes"
              name="notes"
              placeholder="Roster size, weapon mix, size ranges, delivery address, billing setup, tournament deadline, or custom requirements."
              rows={5}
            />
          </Field>

          <div className="club-form-submit">
            <button disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Sending...' : 'Request a quote'}
            </button>
            <p>
              Include rough numbers if you have them. Exact quantities can be
              refined after we review the request.
            </p>
          </div>
        </Form>
      </div>
    </section>
  );
}

function Field({children, id, label}) {
  return (
    <div className="club-form-row">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}

function ChoiceGroup({defaultValue, label, name, options}) {
  const selected = defaultValue || options[0];

  return (
    <fieldset className="club-form-row">
      <legend>{label}</legend>
      <div className="club-form-pills">
        {options.map((option) => (
          <label className="club-pill" key={option}>
            <input
              defaultChecked={option === selected}
              name={name}
              required
              type="radio"
              value={option}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function CheckGroup({label, options}) {
  return (
    <fieldset className="club-form-row">
      <legend>{label}</legend>
      <div className="club-form-checks">
        {options.map(([value, option]) => (
          <label key={value}>
            <input name={`products_${value}`} type="checkbox" value="Yes" />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
