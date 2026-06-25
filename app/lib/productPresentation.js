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

function simplifyTitle(title = '') {
  const firstPhrase = title.split(/[;,:]/)[0].trim();

  if (firstPhrase.length <= 72) return firstPhrase;

  const clipped = firstPhrase.slice(0, 73);
  const lastSpace = clipped.lastIndexOf(' ');

  return `${clipped.slice(0, lastSpace > 45 ? lastSpace : 72).trim()}…`;
}
