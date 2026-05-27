export const products = [
  {
    id: "prod_mask_apex_xcell",
    slug: "apex-x-cell-mask",
    title: "Apex X-Cell Mask",
    category: "mask",
    badge: "FIE",
    description: "1600N bib, replaceable padding, low-profile contour.",
    details:
      "A low-profile competition mask with secure bib geometry, replaceable padding, and balanced visibility for foil, epee, and sabre training.",
    priceCents: 28900,
    currency: "usd",
    imageUrl: "/assets/fencer-mask.jpg",
    active: true,
    variants: [
      { id: "var_mask_s", name: "Small", stock: 12 },
      { id: "var_mask_m", name: "Medium", stock: 18 },
      { id: "var_mask_l", name: "Large", stock: 14 },
      { id: "var_mask_xl", name: "Extra Large", stock: 6 }
    ]
  },
  {
    id: "prod_epee_maraging",
    slug: "maraging-epee-complete",
    title: "Maraging Epee Complete",
    category: "weapon",
    badge: "Electric",
    description: "Wired blade, pistol grip, balanced guard assembly.",
    details:
      "Competition-ready wired epee with maraging blade, socket, guard, pad, and pistol grip assembled for balanced handling.",
    priceCents: 21900,
    currency: "usd",
    imageUrl: "/assets/fencer-weapon.jpg",
    active: true,
    variants: [
      { id: "var_epee_left", name: "Left Hand", stock: 8 },
      { id: "var_epee_right", name: "Right Hand", stock: 21 }
    ]
  },
  {
    id: "prod_starter_bundle",
    slug: "club-starter-bundle",
    title: "Club Starter Bundle",
    category: "kit",
    badge: "Starter",
    description: "Mask, jacket, glove, weapon bag, and training blade.",
    details:
      "A first-season kit bundle for club athletes, available for foil, epee, or sabre programs.",
    priceCents: 39900,
    currency: "usd",
    imageUrl: "/assets/fencer-pair.jpg",
    active: true,
    variants: [
      { id: "var_kit_foil", name: "Foil Kit", stock: 10 },
      { id: "var_kit_epee", name: "Epee Kit", stock: 9 },
      { id: "var_kit_sabre", name: "Sabre Kit", stock: 7 }
    ]
  },
  {
    id: "prod_pulse_pair",
    slug: "pulse-pair-scoring-set",
    title: "Pulse Pair Scoring Set",
    category: "wireless",
    badge: "Wireless",
    description: "Compact transmitters with club-mode pairing and USB-C charging.",
    details:
      "Two wireless scoring transmitters designed for fast club pairing and low-friction practice setup.",
    priceCents: 45900,
    currency: "usd",
    imageUrl: "/assets/fencer-scoring.jpg",
    active: true,
    variants: [{ id: "var_pulse_pair", name: "Pair", stock: 5 }]
  },
  {
    id: "prod_contour_jacket",
    slug: "contour-stretch-jacket",
    title: "Contour Stretch Jacket",
    category: "clothing",
    badge: "350N",
    description: "Lightweight practice jacket with mapped stretch panels.",
    details:
      "A durable practice jacket designed for repeated club sessions and smooth movement.",
    priceCents: 16900,
    currency: "usd",
    imageUrl: "/assets/fencer-clothing.jpg",
    active: true,
    variants: [
      { id: "var_jacket_s", name: "Small", stock: 10 },
      { id: "var_jacket_m", name: "Medium", stock: 16 },
      { id: "var_jacket_l", name: "Large", stock: 13 }
    ]
  },
  {
    id: "prod_flight_roller",
    slug: "flight-roller-bag",
    title: "Flight Roller Bag",
    category: "bag",
    badge: "Travel",
    description: "Structured weapon compartment with smooth rolling frame.",
    details:
      "A travel bag with protected weapon storage, boot pocket, and durable rollers.",
    priceCents: 18900,
    currency: "usd",
    imageUrl: "/assets/gear-bag.jpg",
    active: true,
    variants: [{ id: "var_bag_black", name: "Black", stock: 15 }]
  }
];

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug && product.active);
}

export function getProductById(id) {
  return products.find((product) => product.id === id && product.active);
}
