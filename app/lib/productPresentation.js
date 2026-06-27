const PRODUCT_PRESENTATION = {
  'zhang-brand-electric-competition-certified-foils-epees-and-sabres-complete-fencing-swords-for-children-and-adults-stainless-gold-and-colorful':
    {
      title: 'Zhang Competition Electric Fencing Weapons',
      description:
        'Complete electric foil, epee, and sabre configurations for youth and adult fencers, with multiple blade finishes and competition-ready options.',
    },
  'zhang-brand-fencing-blades-by-a-zhang-stainless-electric-foil-epee-and-sabre-blades-in-silver-color-gold-and-blue-certified-equipment':
    {
      title: 'Zhang Electric Replacement Blades',
      description:
        'Stainless electric replacement blades for foil, epee, and sabre, offered in silver, gold, blue, and additional finish options.',
    },
  'beyond-fencing-mask-1600n-fie-certified-for-professional-fie-competitions-suitable-for-national-and-international-tournaments':
    {
      title: 'Beyond FIE 1600N Fencing Mask',
      description:
        'FIE-certified 1600N protection for national and international competition, designed for secure coverage, visibility, and a stable fit.',
    },
  'fie-certified-colored-fencing-heavy-sword-mask-detachable-lining-for-easy-cleaning-suitable-for-competitions':
    {
      title: 'FIE Colored Epee Mask',
      description:
        'FIE-certified colored epee mask with a detachable washable liner, stable rear strap, and multiple color options for competition and regular training.',
    },
  'beyond-fencing-equipment-special-competition-gloves-for-foil-and-epee-non-slip-suitable-for-children-and-adults-for-domestic-a-level-competitions':
    {
      title: 'Beyond Competition Fencing Glove',
      description:
        'A non-slip foil and epee glove for youth and adult fencers, designed for confident weapon control during training and competition.',
    },
  'beyond-fencing-uniform-fie800n-certified-epee-uniform-for-international-competitions-icy-silk-material':
    {
      title: 'Beyond FIE 800N Fencing Uniform',
      description:
        'FIE-certified 800N competition apparel made with a smooth, lightweight technical fabric. Available as individual garments or a coordinated set in multiple sizes and handedness options.',
    },
  'new-seven-color-professional-fencing-socks-colorful-for-children-and-adults-breathable-comfortable-wear-resistant-for-competitions-and-training':
    {
      title: 'Seven-Color Performance Fencing Socks',
      description:
        'Breathable, wear-resistant fencing socks for youth and adults, available in multiple colors for regular training and competition.',
    },
  'sprandi-spandi-professional-fencing-shoes-for-children-and-adults-multiple-colors-available-for-competition-and-training':
    {
      title: 'Sprandi Professional Fencing Shoes',
      description:
        'Responsive fencing footwear for youth and adults, with multiple color options for stable footwork through training and competition.',
    },
  'internet-celebrity-recommended-fencing-equipment-sabre-foil-and-epee-hand-lines-foil-head-clip-line-mask-head-line':
    {
      title: 'Electric Fencing Cords & Mask Leads',
      description:
        'Replacement body cords, foil clip leads, and sabre mask leads for maintaining compatible electric foil, epee, and sabre setups.',
    },
  'fencing-sword-bag-team-bag-with-large-wheels-can-hold-two-sets-of-equipment-has-inner-compartments-for-fencing-competitions':
    {
      title: 'Two-Kit Wheeled Team Fencing Bag',
      description:
        'A large wheeled competition bag with internal organization and capacity for up to two complete fencing kits.',
    },
  'yue-sword-dark-warrior-fencing-bag-multifunctional-for-outdoor-competitions-can-hold-a-complete-set-of-equipment-and-three-swords-with-wheels':
    {
      title: 'Yue Sword Dark Warrior Wheeled Bag',
      description:
        'A wheeled competition bag sized for one complete fencing kit and up to three weapons, with practical organization for travel.',
    },
  'af-full-set-of-fencing-equipment-for-children-cfa450n-new-standard-certified-competition-11-piece-set-fencing-set-competition':
    {
      title: 'AF Youth 11-Piece Competition Set',
      description:
        'A coordinated 11-piece youth fencing kit built around CFA 450N protective equipment for lessons, club training, and competition preparation.',
    },
};

export function getProductDisplayTitle(product) {
  if (!product) return 'Fencing Equipment';

  return PRODUCT_PRESENTATION[product.handle]?.title || simplifyTitle(product.title);
}

export function getProductDisplayDescription(product) {
  return PRODUCT_PRESENTATION[product?.handle]?.description || '';
}

export function getProductDetailContent(product) {
  const content = {
    'zhang-brand-electric-competition-certified-foils-epees-and-sabres-complete-fencing-swords-for-children-and-adults-stainless-gold-and-colorful':
      {
      eyebrow: 'Built for the piste',
      heading: 'A configurable electric weapon for training and competition.',
      intro:
        'Choose foil, epee, or sabre with the grip, blade finish, and configuration that match your discipline. Each option is designed around practical handling, dependable construction, and straightforward replacement or club use.',
      features: [
        [
          'Weapon-specific setup',
          'Select the correct foil, epee, or sabre configuration before checkout. Components are not interchangeable across every discipline.',
        ],
        [
          'Hand-fitted control',
          'Pistol-grip options use an intentional grip-to-blade angle to support point control and efficient force transfer.',
        ],
        [
          'Multiple finishes',
          'Available finishes include silver, gold, iridescent, and blue. Finish choice is visual and does not replace weapon-type selection.',
        ],
      ],
      note:
        'Please confirm weapon type, handedness, grip style, and competition requirements with your coach or club armorer before ordering.',
      },
    'zhang-brand-fencing-blades-by-a-zhang-stainless-electric-foil-epee-and-sabre-blades-in-silver-color-gold-and-blue-certified-equipment':
      {
        eyebrow: 'Workshop essentials',
        heading: 'Replacement electric blades for foil, epee, and sabre.',
        intro:
          'A practical blade range for repairs, rebuilds, and club maintenance. Select the correct weapon type and finish for your existing setup.',
        features: [
          ['Weapon-specific fit', 'Foil, epee, and sabre blades use different dimensions and electrical configurations.'],
          ['Multiple finishes', 'Choose from silver, gold, blue, and iridescent finishes where available.'],
          ['Repair ready', 'Suitable for experienced fencers, coaches, and armorers assembling or servicing weapons.'],
        ],
        note:
          'Blade installation and wiring should be completed or checked by a qualified club armorer.',
      },
    'beyond-fencing-mask-1600n-fie-certified-for-professional-fie-competitions-suitable-for-national-and-international-tournaments':
      {
        eyebrow: 'Competition protection',
        heading: 'FIE-level head protection with a secure, stable fit.',
        intro:
          'The Beyond FIE 1600N mask combines a high-strength stainless steel mesh with a protective bib for advanced training and competition use.',
        features: [
          ['1600N bib', 'Designed around FIE-level protective requirements for international competition equipment.'],
          ['Steel mesh shell', 'High-strength stainless steel mesh provides rigid coverage while maintaining visibility.'],
          ['Stable retention', 'A correctly fitted mask should remain secure through rapid footwork and blade actions.'],
        ],
        note:
          'Confirm weapon compatibility and measure around the head before selecting a size. Inspect the mesh and bib before every use.',
      },
    'fie-certified-colored-fencing-heavy-sword-mask-detachable-lining-for-easy-cleaning-suitable-for-competitions':
      {
        eyebrow: 'Colored epee protection',
        heading: 'FIE-certified epee mask with a distinctive colored shell.',
        intro:
          'A competition-ready epee mask for fencers who want certified protection, a stable fit, and a color finish that stands out on the piste.',
        features: [
          [
            'FIE certified',
            'Built for competition use where FIE-certified protective equipment is required or preferred.',
          ],
          [
            'Detachable liner',
            'The removable lining makes drying and routine cleaning easier between practices and events.',
          ],
          [
            'Color options',
            'Choose from available color finishes, then confirm the correct mask size before checkout.',
          ],
        ],
        note:
          'This mask is intended for epee use. Confirm size, weapon compatibility, and event requirements before ordering.',
      },
    'beyond-fencing-equipment-special-competition-gloves-for-foil-and-epee-non-slip-suitable-for-children-and-adults-for-domestic-a-level-competitions':
      {
        eyebrow: 'Weapon control',
        heading: 'A flexible competition glove for foil and epee.',
        intro:
          'A close-fitting glove with a textured palm for confident grip and responsive hand movement during lessons, drills, and competition.',
        features: [
          ['Textured palm', 'Non-slip contact zones help maintain control without excessive grip pressure.'],
          ['Flexible construction', 'Articulated fingers support natural hand movement around French and pistol grips.'],
          ['Extended cuff', 'The cuff provides practical overlap with the jacket sleeve during fencing activity.'],
        ],
        note:
          'Measure across the widest part of the palm, excluding the thumb, and compare the result with the gallery size chart.',
      },
    'beyond-fencing-uniform-fie800n-certified-epee-uniform-for-international-competitions-icy-silk-material':
      {
        eyebrow: 'FIE competition whites',
        heading: '800N protection engineered for movement and repeated wear.',
        intro:
          'A technical fencing uniform range available as individual garments or a coordinated set, with multiple sizes and handedness options.',
        features: [
          ['800N construction', 'Protective fabric selected for advanced competition and demanding training environments.'],
          ['Movement focused', 'Patterning supports lunges, extensions, and recovery without unnecessary bulk.'],
          ['Configurable set', 'Choose jacket, breeches, vest, or a complete three-piece combination where offered.'],
        ],
        note:
          'Check the selected garment, handedness, and size separately. Use the English gallery chart and contact us when between sizes.',
      },
    'new-seven-color-professional-fencing-socks-colorful-for-children-and-adults-breathable-comfortable-wear-resistant-for-competitions-and-training':
      {
        eyebrow: 'Training essentials',
        heading: 'Knee-length fencing socks with breathable support.',
        intro:
          'A colorful performance sock range designed to stay comfortable inside fencing shoes through lessons, footwork, and competition.',
        features: [
          ['Athletic stretch', 'A close, flexible fit helps the sock remain in place during repeated movement.'],
          ['Moisture management', 'Breathable fibers help manage heat and perspiration during training.'],
          ['Reinforced wear zones', 'Targeted cushioning and durable knit areas support regular fencing use.'],
        ],
        note:
          'Select size from your usual EU shoe size. Colors may vary slightly between production batches and screen displays.',
      },
    'sprandi-spandi-professional-fencing-shoes-for-children-and-adults-multiple-colors-available-for-competition-and-training':
      {
        eyebrow: 'Footwork foundation',
        heading: 'Responsive fencing shoes for stable, repeatable movement.',
        intro:
          'Low-profile court footwear designed around fencing footwork, with supportive sidewalls, durable toe coverage, and multiple colorways.',
        features: [
          ['Stable grip', 'The outsole supports controlled starts, stops, lunges, and direction changes on indoor pistes.'],
          ['Lateral support', 'Structured side panels help stabilize the foot during rapid fencing movement.'],
          ['Protected upper', 'Reinforced high-wear areas improve durability around the toe and inner foot.'],
        ],
        note:
          'Select your usual EU size. If between sizes or wearing thicker fencing socks, consider the larger option.',
      },
    'internet-celebrity-recommended-fencing-equipment-sabre-foil-and-epee-hand-lines-foil-head-clip-line-mask-head-line':
      {
        eyebrow: 'Electrical spares',
        heading: 'Body cords and mask leads for electric fencing setups.',
        intro:
          'Replacement electrical leads for foil, epee, and sabre systems. Keep the correct cord type in your bag for training, testing, and competition.',
        features: [
          ['Weapon compatibility', 'Choose the plug and lead configuration that matches your weapon and scoring system.'],
          ['Useful spare', 'A backup cord can prevent a damaged connector from ending a training session or event.'],
          ['Serviceable design', 'Inspect plugs, clips, insulation, and strain relief regularly for wear.'],
        ],
        note:
          'Compare connector shapes carefully before ordering. Foil, epee, sabre, and mask leads are not universally interchangeable.',
      },
    'fencing-sword-bag-team-bag-with-large-wheels-can-hold-two-sets-of-equipment-has-inner-compartments-for-fencing-competitions':
      {
        eyebrow: 'Competition travel',
        heading: 'A wheeled team bag with room for two complete kits.',
        intro:
          'Large-capacity fencing luggage with internal organization for weapons, clothing, masks, shoes, and travel accessories.',
        features: [
          ['Two-kit capacity', 'Designed to organize equipment for two fencers or one athlete carrying a larger competition loadout.'],
          ['Wheeled transport', 'Integrated wheels reduce carrying strain in airports, venues, and long competition corridors.'],
          ['Separate storage', 'Internal sections help keep weapons and protective clothing organized during travel.'],
        ],
        note:
          'Approximate packed size and weight are shown in the English gallery specification image. Confirm airline limits separately.',
      },
    'yue-sword-dark-warrior-fencing-bag-multifunctional-for-outdoor-competitions-can-hold-a-complete-set-of-equipment-and-three-swords-with-wheels':
      {
        eyebrow: 'Compact competition travel',
        heading: 'A structured wheeled bag for one kit and up to three weapons.',
        intro:
          'The Dark Warrior bag combines a tall weapon compartment with organized gear storage for club sessions and competition travel.',
        features: [
          ['Weapon storage', 'The long compartment accommodates up to three assembled weapons depending on configuration.'],
          ['Organized interior', 'Dedicated sections keep clothing, shoes, accessories, and small repair items separated.'],
          ['Multiple carry modes', 'Use the wheels, top handle, or shoulder system according to the journey.'],
        ],
        note:
          'Review the dimension image before ordering. Only the black Dark Warrior style shown in the product gallery is included.',
      },
    'af-full-set-of-fencing-equipment-for-children-cfa450n-new-standard-certified-competition-11-piece-set-fencing-set-competition':
      {
        eyebrow: 'Youth starter equipment',
        heading: 'An 11-piece fencing set for lessons and competition preparation.',
        intro:
          'A coordinated youth kit that brings protective clothing, essential accessories, and transport together for developing fencers.',
        features: [
          ['Coordinated kit', 'A practical group of equipment selected to reduce compatibility decisions for families and new fencers.'],
          ['Youth size range', 'Multiple jacket, breeches, and protector sizes support growing athletes.'],
          ['Club ready', 'Suitable for regular lessons and competition preparation when approved by the athlete’s coach.'],
        ],
        note:
          'Contents and protection ratings vary by selected option. Confirm weapon, handedness, size, and club requirements before purchase.',
      },
  }[product?.handle];

  if (content) return content;

  return {
    eyebrow: 'Product overview',
    heading: getProductDisplayTitle(product),
    intro:
      getProductDisplayDescription(product) ||
      'Performance fencing equipment selected for dependable function, practical fit, and regular training.',
    features: [
      [
        'Purpose selected',
        'Designed for a clear role within a training or competition fencing kit.',
      ],
      [
        'Practical options',
        'Review all available size, handedness, color, and configuration choices before checkout.',
      ],
      [
        'Supported purchase',
        'Contact Bladecraft if you need help confirming compatibility or fit.',
      ],
    ],
    note:
      'Check the selected variant carefully before adding the item to your cart.',
  };
}

function simplifyTitle(title = '') {
  const firstPhrase = title.split(/[;,:]/)[0].trim();

  if (firstPhrase.length <= 72) return firstPhrase;

  const clipped = firstPhrase.slice(0, 73);
  const lastSpace = clipped.lastIndexOf(' ');

  return `${clipped.slice(0, lastSpace > 45 ? lastSpace : 72).trim()}…`;
}
