/**
 * Eden's Pharm product catalog.
 *
 * Sourced from the "Edens Pharm" Google Sheet (one tab per product line).
 * Each distinct formula is its own product page; flavors, blends and
 * formats that share a formula are variants on that page. Only
 * ingredient names are published here, never percentages or doses.
 *
 * This is the fallback catalog used when Vineyard is not configured.
 * Once Vineyard is live it becomes the source of truth and this file is
 * only used for local development.
 */

export interface CatalogVariant {
  label: string;
  ingredients?: string[];
}

export interface CatalogProduct {
  slug: string;
  name: string;
  line: ProductLineId;
  description: string;
  image: string;
  /** What the variant picker is called on the product page. */
  optionName: string;
  ingredients?: string[];
  variants: CatalogVariant[];
}

export type ProductLineId = 'hydrasal' | 'elation' | 'benedulce' | 'sanctus-una' | 'callalux';

export const productLines: { id: ProductLineId; name: string; tagline: string }[] = [
  {
    id: 'hydrasal',
    name: 'Hydrasal',
    tagline: 'Functional electrolytes sweetened with BeneDulce.',
  },
  {
    id: 'elation',
    name: 'Elation',
    tagline: 'Adaptogens reimagined as daily luxury tonics.',
  },
  {
    id: 'benedulce',
    name: 'BeneDulce',
    tagline: 'A sweetener designed to be beneficial, not just neutral.',
  },
  {
    id: 'sanctus-una',
    name: 'Sanctus Unā',
    tagline: 'Ancestral skincare and fragrance rooted in grass‑fed tallow.',
  },
  {
    id: 'callalux',
    name: 'Callalux',
    tagline: 'Small‑batch custard ice cream sweetened with BeneDulce.',
  },
];

const ELECTROLYTES = ['Sodium chloride', 'Potassium chloride', 'Magnesium chloride'];
const IMG = {
  hydrasal: '/images/hydrasal.png',
  elation: '/images/elation.png',
  benedulce: '/images/benedulce.jpg',
  sanctus: '/images/sanctus.png',
  banner: '/images/banner.png',
};

const FRAGRANCE_FORMATS: CatalogVariant[] = [
  { label: 'Solid Perfume' },
  { label: 'Perfume Oil' },
  { label: 'Attar' },
  { label: 'Spray' },
];

function elation(name: string, ingredients: string[]): CatalogProduct {
  return {
    slug: `elation-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name: `Elation ${name}`,
    line: 'elation',
    description: `Elation ${name} is an adaptogenic tonic blend of ${listToText(ingredients)}, sweetened with BeneDulce.`,
    image: IMG.elation,
    optionName: 'Size',
    ingredients,
    variants: [{ label: 'Standard' }],
  };
}

function crews(name: string, ingredients: string[]): CatalogProduct {
  return {
    slug: `hydrasal-for-crews-${name.toLowerCase()}`,
    name: `Hydrasal for Crews — ${name}`,
    line: 'hydrasal',
    description: `Built for crews in the field: Hydrasal electrolytes plus ${listToText(
      ingredients.filter((i) => !ELECTROLYTES.includes(i) && i !== 'BeneDulce'),
    )}.`,
    image: IMG.hydrasal,
    optionName: 'Size',
    ingredients,
    variants: [{ label: 'Standard' }],
  };
}

function fragrance(name: string, notes: string[]): CatalogProduct {
  return {
    slug: `sanctus-una-${name.toLowerCase()}-fragrance`,
    name: `${name} Fragrance`,
    line: 'sanctus-una',
    description: `${name} is a Sanctus Unā signature fragrance with notes of ${listToText(
      notes,
    )}. Available as a tallow‑and‑beeswax solid perfume, a perfume oil, an attar or a spray.`,
    image: IMG.sanctus,
    optionName: 'Format',
    ingredients: notes,
    variants: FRAGRANCE_FORMATS,
  };
}

function skincare(
  slug: string,
  name: string,
  description: string,
  ingredients: string[],
  variants: CatalogVariant[] = [{ label: 'Standard' }],
  optionName = 'Size',
): CatalogProduct {
  return {
    slug: `sanctus-una-${slug}`,
    name,
    line: 'sanctus-una',
    description,
    image: IMG.sanctus,
    optionName,
    ingredients,
    variants,
  };
}

function listToText(items: string[]): string {
  const lower = items.map((i) => (/^[A-Z][a-z]/.test(i) && !/^(BeneDulce|EGCG|L-)/.test(i) ? i.toLowerCase() : i));
  if (lower.length <= 1) return lower.join('');
  return `${lower.slice(0, -1).join(', ')} and ${lower[lower.length - 1]}`;
}

export const catalog: CatalogProduct[] = [
  // ── Hydrasal ────────────────────────────────────────────────────────────
  {
    slug: 'hydrasal',
    name: 'Hydrasal',
    line: 'hydrasal',
    description:
      'Hydrasal is the world’s only hydration system sweetened with our Healthy Sweetener System™. Every sip delivers functional electrolytes without blood sugar spikes. Choose Raw (unflavored, unsweetened) or one of twelve fruit flavors made with real juice powders.',
    image: IMG.hydrasal,
    optionName: 'Flavor',
    variants: [
      { label: 'Raw', ingredients: ELECTROLYTES },
      { label: 'Strawberry', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Apple juice powder', 'Lime juice powder', 'Strawberry juice powder'] },
      { label: 'Triple Cherry', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Apple juice powder', 'Bing cherry', 'Lambert cherry', 'Rainier cherry'] },
      { label: 'Citrus', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Apple juice powder', 'Lemon juice powder', 'Lime juice powder', 'Orange juice powder'] },
      { label: 'Lemon Ginger', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Apple juice powder', 'Ginger root powder', 'Lemon juice powder'] },
      { label: 'Cherry Lime', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Apple juice powder', 'Lambert cherry', 'Lime juice powder', 'Rainier cherry'] },
      { label: 'Fruit Punch', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Apple juice powder', 'Concord grape juice powder', 'Lambert cherry', 'Lime juice powder', 'Orange juice powder', 'Rainier cherry', 'Strawberry juice powder', 'Watermelon juice powder'] },
      { label: 'Strawberry Lime', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Apple juice powder', 'Lime juice powder', 'Strawberry juice powder'] },
      { label: 'Mango', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Apple juice powder', 'Lime juice powder', 'Mango juice powder'] },
      { label: 'White Peach', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Ginger root juice powder', 'Lime juice powder', 'White peach juice powder'] },
      { label: 'Watermelon', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Apple juice powder', 'Lime juice powder', 'Watermelon juice powder'] },
      { label: 'Concord Grape', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Black currant juice powder', 'Concord grape juice powder', 'Elderberry juice powder'] },
      { label: 'Tart Berry Citrus', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Blood orange juice powder', 'Pomegranate juice powder', 'Tart cherry juice powder'] },
    ],
  },
  {
    slug: 'hydrasal-raw-plus',
    name: 'Hydrasal Raw Plus',
    line: 'hydrasal',
    description:
      'The clean, unsweetened Hydrasal Raw electrolyte base, lifted with a single natural essential oil for flavor.',
    image: IMG.hydrasal,
    optionName: 'Flavor',
    variants: [
      { label: 'Key Lime', ingredients: [...ELECTROLYTES, 'Key lime essential oil'] },
      { label: 'Pomelo', ingredients: [...ELECTROLYTES, 'Pomelo essential oil'] },
      { label: 'Yuzu', ingredients: [...ELECTROLYTES, 'Yuzu essential oil'] },
      { label: 'Blood Orange', ingredients: [...ELECTROLYTES, 'Blood orange essential oil'] },
      { label: 'Bergamot', ingredients: [...ELECTROLYTES, 'Bergamot essential oil'] },
      { label: 'Mandarin', ingredients: [...ELECTROLYTES, 'Mandarin essential oil'] },
      { label: 'Cacao Mint', ingredients: [...ELECTROLYTES, 'Cacao essential oil', 'Peppermint essential oil', 'Spearmint essential oil'] },
    ],
  },
  {
    slug: 'hydrasal-premium',
    name: 'Hydrasal Premium',
    line: 'hydrasal',
    description:
      'Our most indulgent hydration: Hydrasal electrolytes and BeneDulce paired with botanicals like hibiscus, butterfly pea flower, tulsi and saffron.',
    image: IMG.hydrasal,
    optionName: 'Flavor',
    variants: [
      { label: 'Honey Hibiscus Cooler', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Apple juice powder', 'Hibiscus flower powder', 'Honey powder', 'Lemon juice powder', 'Rosehip powder'] },
      { label: 'Blue Zen Lemonade', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Apple juice powder', 'Butterfly pea flower powder', 'Lemon juice powder', 'Spearmint powder', 'Tulsi powder'] },
      { label: 'Vanilla Citrus Bloom', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Vanilla powder extract', 'Lime juice powder', 'Orange juice powder'] },
      { label: 'Golden Mango Saffron', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Apple juice powder', 'Lime juice powder', 'Mango juice powder', 'Saffron'] },
      { label: 'Midnight Berry Basil', ingredients: [...ELECTROLYTES, 'BeneDulce', 'Apple juice powder', 'Blackberry juice powder', 'Blueberry juice powder', 'Elderberry juice powder', 'Lime juice powder', 'Tulsi powder'] },
    ],
  },
  crews('Energize', [...ELECTROLYTES, 'BeneDulce', 'Apple juice powder', 'Ginger powder', 'Lime juice powder', 'EGCG', 'Panax ginseng powder', 'Natural caffeine', 'Strawberry juice powder', 'Watermelon juice powder']),
  crews('Recovery', ['Sodium chloride', 'Potassium chloride', 'BeneDulce', 'Apple juice powder', 'Black pepper', 'Fenugreek powder', 'Lime juice powder', 'Orange juice powder', 'Curcumin', 'Lithium orotate', 'White peach juice powder']),
  crews('Focus', [...ELECTROLYTES, 'BeneDulce', 'Bacopa', 'Blood orange juice powder', 'L-theanine', "Lion's mane powder", 'Pomegranate juice powder', 'Tart cherry juice powder', 'Tulsi']),
  crews('Calm', [...ELECTROLYTES, 'BeneDulce', 'Apple juice powder', 'Ashwagandha powder', 'Coconut milk powder', 'Lemon balm powder', 'Lime juice powder', 'Passion flower powder', 'Peppermint powder', 'Spearmint powder', 'Valerian root powder']),

  // ── Elation ─────────────────────────────────────────────────────────────
  elation('Energy', ['Ashwagandha', 'EGCG', 'Ginger', 'Ginseng', "Lion's mane", 'Sea moss', 'Spirulina', 'Zinc orotate']),
  elation('Estrogen', ['Ashwagandha', 'Butterfly pea flower', 'Milk thistle', 'Moringa', 'Reishi', 'Saffron', 'Sea moss']),
  elation('Focus', ['Ashwagandha', 'Cayenne pepper', 'Ginseng', "Lion's mane", 'Lithium orotate']),
  elation('Gut Health', ['Cinnamon', 'Ginger', 'Milk thistle', 'Saffron', 'Sea moss', 'Spirulina']),
  elation('Heart', ['Cayenne pepper', 'Cinnamon', 'Cordyceps', 'Enoki', 'Reishi', 'Saffron', 'Soursop']),
  elation('Healing', ['Black pepper', 'Black seed', 'Chaga', 'Cinnamon', 'Cordyceps', 'Fenugreek', 'Milk thistle', 'Reishi', 'Saffron', 'Sea moss', 'Soursop', 'Spirulina', 'Stone fruit seed powder', 'Turmeric', 'Zinc orotate']),
  elation('Mushroom', ['Chaga', 'Cordyceps', 'Enoki', 'King trumpet', "Lion's mane", 'Reishi', 'Shiitake', 'Turkey tail']),
  elation('Relax', ['Ashwagandha', 'Black pepper', 'Fenugreek', 'Kava', "Lion's mane", 'Lithium orotate', 'Saffron', 'Turmeric']),
  elation('Sleep', ['Ashwagandha', 'Chamomile', 'Valerian root']),
  elation('Testosterone', ['Ashwagandha', 'Ginseng', 'Horny goat weed', 'Milk thistle', 'Moringa', 'Sea moss']),

  // ── BeneDulce ───────────────────────────────────────────────────────────
  {
    slug: 'benedulce',
    name: 'BeneDulce',
    line: 'benedulce',
    description:
      'The world’s first sweetener that is not only neutral but beneficial. A 1:1 sugar replacement powered by allulose, xylitol, erythritol, monk fruit and collagen peptides.',
    image: IMG.benedulce,
    optionName: 'Size',
    ingredients: ['Allulose', 'Xylitol', 'Erythritol', 'Monk fruit extract', 'Collagen peptides'],
    variants: [{ label: 'Standard' }],
  },

  // ── Sanctus Unā skincare ────────────────────────────────────────────────
  skincare('face-balm-renew', 'Renew Face Balm', 'Our hero moisturizing facial balm: grass‑fed tallow with jojoba, squalane, sea buckthorn and rosehip oils, lightly scented with cedarwood, geranium, copaiba and lavender.', ['Grass-fed beef tallow', 'Jojoba oil', 'Squalane (olive-derived)', 'Sea buckthorn oil', 'Wheat germ oil', 'Rosehip oil', 'Oat oil', 'Arrowroot powder', 'Cedarwood, geranium, copaiba and lavender essential oils']),
  skincare('healing-salve', 'Healing Salve', 'A soothing, protective salve of tallow, beeswax and calendula with lavender, tea tree and frankincense.', ['Beef tallow', 'Beeswax', 'Jojoba oil', 'Calendula oil', 'Wheat germ oil', 'Lavender, tea tree and frankincense essential oils']),
  skincare('bar-soap', 'Sanctum Bar Soap', 'A cleansing tallow bar soap scented with our signature Sanctum blend.', ['Tallow', 'Coconut oil', 'Olive oil', 'Lye', 'Castor oil', 'Sanctum essential oil blend']),
  skincare('body-butter', 'Sanctum Body Butter', 'Whipped tallow and shea body butter for full‑body hydration, scented with Sanctum.', ['Beef tallow', 'Shea butter', 'Jojoba oil', 'Arrowroot powder', 'Wheat germ oil', 'Sanctum essential oil blend']),
  skincare('lotion-bar', 'Sanctum Lotion Bar', 'Portable, mess‑free hydration in a solid tallow and cocoa butter bar, scented with Sanctum.', ['Beef tallow', 'Beeswax', 'Cocoa butter', 'Jojoba oil', 'Sanctum essential oil blend']),
  skincare('beard-butter', 'Beard Butter', 'Softens and conditions the beard with tallow, jojoba and mango butter, scented with Sanctum.', ['Beef tallow', 'Jojoba oil', 'Mango butter', 'Wheat germ oil', 'Sanctum essential oil blend']),
  skincare('shampoo-bar', 'Shampoo Bar', 'A gentle scalp‑cleansing bar made with yucca root and soapnut, scented with Sanctum.', ['Yucca root', 'Soapnut', 'Shea butter', 'Coconut oil', 'Oat oil', 'Amla powder', 'Sanctum essential oil blend']),
  skincare('conditioner-bar', 'Conditioner Bar', 'Detangles and softens with shea butter, jojoba and oat oil, scented with Sanctum.', ['Beeswax', 'Lecithin', 'Shea butter', 'Jojoba oil', 'Wheat germ oil', 'Oat oil', 'Sanctum essential oil blend']),
  skincare('baby-balm', 'Baby Balm', 'A gentle, unscented tallow and calendula balm for little ones.', ['Beef tallow', 'Calendula oil', 'Jojoba oil', 'Beeswax', 'Wheat germ oil']),
  skincare(
    'lip-balm',
    'Lip Balm',
    'Moisturizing tallow and beeswax lip balm in five flavors.',
    ['Beef tallow', 'Beeswax', 'Wheat germ oil'],
    [
      { label: 'Vanilla Macaroon', ingredients: ['Beef tallow', 'Beeswax', 'Sweet almond oil', 'Wheat germ oil', 'Vanilla extract powder'] },
      { label: 'Bay Lime', ingredients: ['Beef tallow', 'Beeswax', 'Coconut oil', 'Wheat germ oil', 'Lime essential oil'] },
      { label: 'Dreamsicle', ingredients: ['Beef tallow', 'Beeswax', 'Olive oil', 'Wheat germ oil', 'Vanilla extract powder', 'Orange essential oil'] },
      { label: 'Unscented', ingredients: ['Beef tallow', 'Beeswax', 'Olive oil', 'Wheat germ oil'] },
      { label: 'Caribbean Dream', ingredients: ['Beef tallow', 'Beeswax', 'Coconut oil', 'Wheat germ oil', 'Vanilla extract powder', 'Cinnamon bark, cardamom, nutmeg and clove essential oils'] },
    ],
    'Flavor',
  ),
  skincare('deodorant-balm', 'Deodorant Balm', 'Natural odor control in a tallow balm with arrowroot, magnesium hydroxide and zinc ricinoleate, scented with Sanctum.', ['Beef tallow', 'Beeswax', 'Jojoba oil', 'Arrowroot powder', 'Magnesium hydroxide', 'Zinc ricinoleate', 'Colloidal silver', 'Sanctum essential oil blend']),

  // ── Sanctus Unā fragrance ───────────────────────────────────────────────
  fragrance('Sanctum', ['Jasmine sambac', 'Ylang ylang', 'Cinnamon bark', 'Cardamom', 'Black currant', 'Atlas cedarwood', 'Vetiver', 'Vanilla', 'Peru balsam']),
  fragrance('Redeemed', ['Elderflower', 'Gardenia', 'Frankincense sacra', 'Cacao', 'Citron', 'Pomelo', 'Myrrh']),
  fragrance('Unbound', ['Honeysuckle', 'Texas cedarwood', 'Rose otto', 'Grapefruit', 'Yuzu', 'Balsam fir']),
  fragrance('Stoic', ['Amyris', 'Beeswax absolute', 'Rosewood', 'Vanilla', 'Violet', 'Hay', 'Orris', 'Tonka bean', 'Benzoin', 'Amber', 'Atlas cedarwood', 'Pink peppercorn']),
  fragrance('Tranquil', ['Violet leaf', 'Petitgrain bigarade', 'Basil', 'Bergamot', 'Bitter orange peel', 'Mandarin peel', 'Neroli', 'Jasmine grandiflorum', 'Cypress', 'Hinoki', 'Elemi', 'Frankincense frereana', 'Benzoin']),

  // ── Callalux ────────────────────────────────────────────────────────────
  {
    slug: 'callalux',
    name: 'Callalux Ice Cream',
    line: 'callalux',
    description:
      'Rich custard ice cream made with heavy cream, egg yolks and sea salt, sweetened entirely with BeneDulce. Ten flavors inspired by places around the world.',
    image: IMG.benedulce,
    optionName: 'Flavor',
    variants: [
      { label: 'Madagascar Bourbon', ingredients: ['Vanilla bean'] },
      { label: 'Last Light of London', ingredients: ['Earl Grey tea', 'Vanilla bean'] },
      { label: 'Tokyo Dreams', ingredients: ['Freeze-dried cherry juice powder', 'Vanilla bean'] },
      { label: 'Strawberry Fields', ingredients: ['Freeze-dried strawberry juice powder'] },
      { label: 'Georgia Peachtree', ingredients: ['Freeze-dried peach juice powder', 'Vanilla bean'] },
      { label: 'Manila Nights', ingredients: ['Freeze-dried mango juice powder'] },
      { label: "Montezuma's Gift", ingredients: ['Cocoa powder', 'Dark chocolate'] },
      { label: 'Persia Rising', ingredients: ['Saffron', 'Honey'] },
      { label: 'Dulce Sueños', ingredients: ['BeneDulce caramel swirl'] },
      { label: "The Bee's Dream", ingredients: ['White chocolate', 'Elderflower', 'Honey swirl'] },
    ].map((v) => ({ ...v, ingredients: ['Heavy cream', 'Egg yolks', 'BeneDulce', 'Sea salt', ...v.ingredients] })),
  },
];

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function variantId(productSlug: string, label: string): string {
  return `${productSlug}--${slugify(label)}`;
}
