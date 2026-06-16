export const FENCING_CATEGORIES = [
  {
    id: 'weapons',
    handle: 'weapons',
    label: 'Weapons',
    title: 'Complete weapons',
    copy: 'Foil, epee, and sabre builds ready for training or competition',
    keywords: ['weapon', 'foil', 'epee', 'épée', 'sabre', 'saber'],
  },
  {
    id: 'blades',
    handle: 'blades',
    label: 'Blades',
    title: 'Blades and guards',
    copy: 'Bare blades, guards, grips, pommels, sockets, and weapon parts',
    keywords: ['blade', 'guard', 'grip', 'pommel', 'socket'],
  },
  {
    id: 'masks',
    handle: 'masks',
    label: 'Masks',
    title: 'Competition masks',
    copy: 'Foil, epee, sabre, coaching, and club masks',
    keywords: ['mask', 'bib'],
  },
  {
    id: 'clothing',
    handle: 'clothing',
    label: 'Clothing',
    title: 'Whites and uniforms',
    copy: 'Jackets, plastrons, breeches, lames, gloves, and socks',
    keywords: [
      'clothing',
      'jacket',
      'plastron',
      'breeches',
      'white',
      'uniform',
      'lame',
      'lamé',
      'glove',
      'sock',
    ],
  },
  {
    id: 'protective',
    handle: 'protective-gear',
    label: 'Protective Gear',
    title: 'Protection and safety',
    copy: 'Chest protectors, coaching gear, underarm guards, and padding',
    keywords: ['protective', 'protector', 'chest', 'coach', 'padding', 'guard'],
  },
  {
    id: 'scoring',
    handle: 'scoring',
    label: 'Scoring',
    title: 'Scoring and electronics',
    copy: 'Body cords, mask cords, reels, boxes, wireless sets, and testers',
    keywords: [
      'scoring',
      'wireless',
      'cord',
      'body cord',
      'mask cord',
      'reel',
      'box',
      'tester',
      'electric',
    ],
  },
  {
    id: 'bags',
    handle: 'bags',
    label: 'Bags',
    title: 'Bags and transport',
    copy: 'Rolling bags, weapon bags, club storage, and coach kits',
    keywords: ['bag', 'case', 'roll', 'rolling', 'duffel'],
  },
  {
    id: 'starter-kits',
    handle: 'starter-kits',
    label: 'Starter Kits',
    title: 'Starter and club kits',
    copy: 'Beginner bundles, school programs, and club-room equipment packs',
    keywords: ['starter', 'kit', 'bundle', 'club', 'school'],
  },
  {
    id: 'parts',
    handle: 'parts',
    label: 'Parts',
    title: 'Repairs and spare parts',
    copy: 'Tips, screws, springs, wires, pads, screws, and maintenance tools',
    keywords: ['part', 'repair', 'tip', 'screw', 'spring', 'wire', 'pad', 'tool'],
  },
];

export const HEADER_CATEGORIES = FENCING_CATEGORIES.filter((category) =>
  ['weapons', 'masks', 'clothing', 'scoring', 'bags', 'starter-kits'].includes(
    category.id,
  ),
);

export function getCategoryId(product) {
  const searchable = [
    product.productType,
    product.title,
    product.vendor,
    ...(product.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const category = FENCING_CATEGORIES.find((item) =>
    item.keywords.some((keyword) => searchable.includes(keyword)),
  );

  return category?.id || 'weapons';
}

export function getCollectionPath(category) {
  return `/collections/${category.handle}`;
}
