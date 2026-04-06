export interface Product {
  id: string
  name: string
  price: number
  shortDescription: string
  fullDescription: string
  howToUse: string
  ingredients: string[]
  skinTypes: string[]
  image: string
  category: 'Serums' | 'Moisturizers' | 'Cleansers' | 'Exfoliants' | 'Eye Care'
  volume: string
  featured: boolean
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Niacinamide 10% + Zinc 1%',
    price: 7.50,
    shortDescription: 'High-strength vitamin & mineral blemish formula.',
    fullDescription:
      'Combining 10% pure niacinamide with 1% zinc PCA, this water-based serum targets excess sebum activity, minimizes the appearance of pores and blemishes, and visibly addresses uneven skin tone. Niacinamide (Vitamin B3) is a well-studied, multi-tasking ingredient that works to reduce the look of skin blemishes and congestion.',
    howToUse:
      'Apply a small amount to the face morning and/or evening before heavier creams. Do not use with Vitamin C (pure L-Ascorbic Acid). If any sensitivity occurs, cease use.',
    ingredients: [
      'Aqua (Water)', 'Niacinamide', 'Pentylene Glycol', 'Zinc PCA',
      'Dimethyl Isosorbide', 'Tamarindus Indica Seed Gum', 'Xanthan Gum',
      'Isoceteth-20', 'Ethoxydiglycol', 'Phenoxyethanol', 'Chlorphenesin',
    ],
    skinTypes: ['oily', 'acne', 'combination'],
    image: '/products/niacinamide-10-zinc-1.png',
    category: 'Serums',
    volume: '30ml',
    featured: true,
  },
  {
    id: '2',
    name: 'Hyaluronic Acid 2% + B5',
    price: 9.90,
    shortDescription: 'Multi-depth hydration with surface-plumping effect.',
    fullDescription:
      'A hydrating serum that uses three forms of hyaluronic acid alongside pro-Vitamin B5 to offer multi-depth hydration. Hyaluronic acid at three molecular weights penetrates different levels of the skin, while Vitamin B5 enhances surface hydration and supports skin healing. Ideal for all skin types, especially dehydrated and dry skin.',
    howToUse:
      'Apply a few drops to face and neck morning and evening before oils or creams. Follow with a moisturizer to lock in hydration.',
    ingredients: [
      'Aqua (Water)', 'Sodium Hyaluronate', 'Panthenol', 'Sodium Hyaluronate Crosspolymer',
      'Hydrolyzed Hyaluronic Acid', 'Glycerin', 'Pentylene Glycol', 'Xanthan Gum',
      'PPG-26-Buteth-26', 'PEG-40 Hydrogenated Castor Oil', 'Phenoxyethanol', 'Ethylhexylglycerin',
    ],
    skinTypes: ['dry', 'dehydrated', 'all'],
    image: '/products/hyaluronic-acid-2-b5.png',
    category: 'Serums',
    volume: '30ml',
    featured: true,
  },
  {
    id: '3',
    name: 'Retinol 0.5% in Squalane',
    price: 11.90,
    shortDescription: 'Moderate-strength retinol for visible anti-aging.',
    fullDescription:
      'Retinol is a form of Vitamin A that has been studied extensively over the past 50 years for its ability to visibly reduce fine lines, improve skin texture and tone, and address blemishes. Formulated in a lightweight squalane base that minimizes irritation and supports the skin barrier. Best for evening use and those new to retinoids.',
    howToUse:
      'Apply a small amount in the evening only. Begin with every other day use and increase frequency as tolerated. Always wear SPF the following morning. Not suitable during pregnancy.',
    ingredients: [
      'Squalane', 'Caprylic/Capric Triglyceride', 'Retinol',
      'Solanum Lycopersicum (Tomato) Fruit Extract', 'Simmondsia Chinensis (Jojoba) Seed Oil',
      'BHT',
    ],
    skinTypes: ['aging', 'dull', 'combination'],
    image: '/products/retinol-0-5-squalane.png',
    category: 'Serums',
    volume: '30ml',
    featured: true,
  },
  {
    id: '4',
    name: 'Vitamin C 15% + Ferulic Acid',
    price: 12.50,
    shortDescription: 'Potent brightening serum with antioxidant protection.',
    fullDescription:
      'A highly stable, water-free formula containing 15% pure Vitamin C (L-Ascorbic Acid) supported by ferulic acid and vitamin E for enhanced antioxidant activity. Addresses dullness, uneven skin tone, and visible signs of aging. The anhydrous base ensures maximum potency and stability of the Vitamin C molecule.',
    howToUse:
      'Apply 2–3 drops to face in the morning after water-based serums but before moisturizer. Do not layer with Niacinamide. Always follow with SPF.',
    ingredients: [
      'Ascorbic Acid', 'Dimethyl Isosorbide', 'Propanediol',
      'Ferulic Acid', 'Tocopherol', 'Citric Acid',
    ],
    skinTypes: ['dull', 'aging', 'all'],
    image: '/products/vitamin-c-15-ferulic-acid.png',
    category: 'Serums',
    volume: '30ml',
    featured: true,
  },
  {
    id: '5',
    name: 'AHA 30% + BHA 2% Peeling Solution',
    price: 15.90,
    shortDescription: '10-minute resurfacing facial with exfoliating AHA + BHA.',
    fullDescription:
      'A 10-minute weekly resurfacing treatment combining 30% Alpha Hydroxy Acids (Glycolic, Lactic, Tartaric, and Citric) with 2% Beta Hydroxy Acid (Salicylic Acid). This powerhouse formula exfoliates the surface and inside the pore lining to reveal brighter, smoother, more even-toned skin. Includes Hyaluronic Acid crosspolymer for hydration.',
    howToUse:
      'Apply to dry face and neck no more than twice weekly. Leave on for no more than 10 minutes. Rinse thoroughly with water. Not for sensitive or compromised skin. Always follow with SPF.',
    ingredients: [
      'Glycolic Acid', 'Aqua', 'Aloe Barbadensis Leaf Water', 'Lactic Acid',
      'Tartaric Acid', 'Citric Acid', 'Salicylic Acid', 'Daucus Carota Sativa Extract',
      'Sodium Hyaluronate Crosspolymer', 'Tasmannia Lanceolata Fruit/Leaf Extract',
      'Phenoxyethanol', 'Ethylhexylglycerin',
    ],
    skinTypes: ['acne', 'dull', 'combination'],
    image: '/products/aha-30-bha-2-peeling-solution.png',
    category: 'Exfoliants',
    volume: '30ml',
    featured: true,
  },
  {
    id: '6',
    name: 'Natural Moisturizing Factors + HA',
    price: 8.90,
    shortDescription: 'Replenishes surface hydration and skin flexibility.',
    fullDescription:
      'This moisturizer contains a comprehensive mix of amino acids, fatty acids, and hyaluronic acid to match the skin\'s own natural moisturizing factors (NMFs). NMFs are compounds found in the uppermost layers of the skin that maintain healthy hydration, flexibility, and integrity. The formula absorbs quickly without leaving a greasy residue.',
    howToUse:
      'Apply to face and neck morning and/or evening before heavier creams. Can be used alone as a daily moisturizer or layered with other Bellpond products.',
    ingredients: [
      'Aqua', 'Glycerin', 'Niacinamide', 'Alanine', 'Arginine', 'Aspartic Acid',
      'Glycine', 'Histidine', 'Isoleucine', 'Phenylalanine', 'Proline', 'Serine',
      'Threonine', 'Valine', 'Lysine HCl', 'Sodium PCA', 'Sodium Lactate',
      'Fructose', 'Glucose', 'Sucrose', 'Urea', 'Sodium Hyaluronate',
    ],
    skinTypes: ['dry', 'sensitive', 'all'],
    image: '/products/natural-moisturizing-factors-ha.png',
    category: 'Moisturizers',
    volume: '30ml',
    featured: true,
  },
  {
    id: '7',
    name: 'Squalane Facial Cleanser',
    price: 10.90,
    shortDescription: 'Gel-to-milk cleanser that removes makeup and impurities.',
    fullDescription:
      'A gentle gel-to-milk emulsifying cleanser formulated with plant-derived squalane and amino acid-based surfactants. The formula dissolves oil-based impurities and removes makeup while maintaining the skin\'s natural moisture balance. Unlike harsh cleansers, it leaves skin feeling soft, supple, and thoroughly clean—never tight or stripped.',
    howToUse:
      'Apply to dry skin and emulsify with a small amount of water. Gently massage over face. Rinse thoroughly. Follow with toner or serum. Suitable for morning and evening use.',
    ingredients: [
      'Aqua', 'Propanediol', 'Cocamidopropyl Betaine', 'Squalane',
      'Sodium Cocoyl Isethionate', 'Sodium Methyl Cocoyl Taurate', 'Glycerin',
      'Sodium Chloride', 'Citric Acid', 'Phenoxyethanol', 'Chlorphenesin',
    ],
    skinTypes: ['all', 'sensitive', 'dry'],
    image: '/products/squalane-facial-cleanser.png',
    category: 'Cleansers',
    volume: '150ml',
    featured: false,
  },
  {
    id: '8',
    name: 'Glycolic Acid 7% Toning Solution',
    price: 9.90,
    shortDescription: 'Exfoliating toner that refines skin texture and tone.',
    fullDescription:
      'An exfoliating toning solution with 7% Glycolic Acid, a water-soluble Alpha Hydroxy Acid (AHA), that works to remove surface-level dead skin cells. The formula includes Tasmanian Pepperberry to help reduce sensitivity, Aloe Vera for soothing, and Ginseng for brightening effects. Regular use improves skin radiance and even-tones the complexion.',
    howToUse:
      'Use once daily in the evening. Apply to face with a saturated cotton pad, avoiding the eye area. Do not rinse. Follow with other serums, then moisturizer. Always use SPF the next morning.',
    ingredients: [
      'Glycolic Acid', 'Aqua', 'Aloe Barbadensis Leaf Juice', 'Rosa Damascena Flower Water',
      'Glycerin', 'Sodium Hydroxide', 'Chamomilla Recutita (Matricaria) Flower Extract',
      'Tasmannia Lanceolata Fruit/Leaf Extract', 'Panax Ginseng Root Extract',
      'Phenoxyethanol', 'Ethylhexylglycerin',
    ],
    skinTypes: ['dull', 'acne', 'oily'],
    image: '/products/glycolic-acid-7-toning-solution.png',
    category: 'Exfoliants',
    volume: '240ml',
    featured: false,
  },
  {
    id: '9',
    name: 'Caffeine Solution 5% + EGCG',
    price: 8.90,
    shortDescription: 'Reduces appearance of puffiness and dark circles.',
    fullDescription:
      'A lightweight eye serum with 5% caffeine and highly-purified Epigallocatechin Gallatyl Glucoside (EGCG) from green tea. Caffeine is known to help visibly reduce puffiness and dark circles around the eye contour, while EGCG provides powerful antioxidant protection. The lightweight, water-based formula absorbs quickly without irritating the delicate eye area.',
    howToUse:
      'Apply a small amount around the eye area morning and/or evening. Gently pat to absorb. Can also be applied to other areas of the face. Avoid direct contact with the eyes.',
    ingredients: [
      'Aqua', 'Caffeine', 'Epigallocatechin Gallatyl Glucoside',
      'Pentylene Glycol', 'Xanthan Gum', 'Phenoxyethanol', 'Ethylhexylglycerin',
    ],
    skinTypes: ['all', 'aging', 'sensitive'],
    image: '/products/caffeine-solution-5-egcg.png',
    category: 'Eye Care',
    volume: '30ml',
    featured: false,
  },
  {
    id: '10',
    name: 'Azelaic Acid Suspension 10%',
    price: 10.90,
    shortDescription: 'Brightens skin tone and reduces blemishes.',
    fullDescription:
      'A lightweight cream-gel suspension containing 10% high-purity azelaic acid. Azelaic acid is a naturally occurring acid found in grains that helps to brighten the skin tone, even out skin texture, and reduce the look of blemishes and redness. Suitable for sensitive and easily reactive skin types, and safe for use during pregnancy (consult doctor).',
    howToUse:
      'Apply a small amount to the face morning and/or evening before heavier creams. Can be mixed with other products in your routine. Appropriate for all skin types including sensitive.',
    ingredients: [
      'Aqua', 'Isodecyl Neopentanoate', 'Azelaic Acid', 'Dimethicone', 'Polysilicone-11',
      'Dimethyl Isosorbide', 'Cetearyl Alcohol', 'Isocetyl Stearate', 'Stearic Acid',
      'Glyceryl Stearate', 'PEG-100 Stearate', 'Phenoxyethanol', 'Chlorphenesin',
    ],
    skinTypes: ['sensitive', 'acne', 'rosacea'],
    image: '/products/azelaic-acid-suspension-10.png',
    category: 'Serums',
    volume: '30ml',
    featured: false,
  },
  {
    id: '11',
    name: 'Lactic Acid 10% + HA',
    price: 8.90,
    shortDescription: 'Gentle exfoliator for improved skin texture and radiance.',
    fullDescription:
      'An exfoliating treatment with 10% Lactic Acid—a larger-molecule AHA that offers effective surface exfoliation with less irritation compared to glycolic acid. Enhanced with Hyaluronic Acid for hydration and Tasmanian Pepperberry to reduce sensitivity. Visibly improves texture, tone, and radiance with regular use.',
    howToUse:
      'Apply to clean, dry skin once daily in the evening. Do not mix with other acids, retinoids, or Vitamin C in the same routine. Rinse thoroughly. Use SPF the following morning.',
    ingredients: [
      'Lactic Acid', 'Aqua', 'Sodium Hydroxide', 'Sodium Hyaluronate Crosspolymer',
      'Pentylene Glycol', 'Tasmannia Lanceolata Fruit/Leaf Extract',
      'Glycerin', 'Phenoxyethanol', 'Chlorphenesin',
    ],
    skinTypes: ['dry', 'dull', 'aging'],
    image: '/products/lactic-acid-10-ha.png',
    category: 'Exfoliants',
    volume: '30ml',
    featured: false,
  },
  {
    id: '12',
    name: 'Argireline Solution 10%',
    price: 13.90,
    shortDescription: 'Peptide complex targeting fine expression lines.',
    fullDescription:
      'A peptide-based serum with 10% Argireline (Acetyl Hexapeptide-3), a synthetic peptide that works by mimicking SNAP-25, a protein that is a target of Botulinum Toxin. It helps reduce the depth of expression lines on the forehead and around the eyes with topical application. Formulated in a hydrating aqueous base for daily use.',
    howToUse:
      'Apply a few drops to the forehead and eye area after water-based serums but before heavier formulas. Use morning and/or evening. For best results, use consistently over 4–8 weeks.',
    ingredients: [
      'Aqua', 'Acetyl Hexapeptide-3', 'Pentylene Glycol', 'Sodium Polyacrylate',
      'Trisodium Ethylenediamine Disuccinate', 'Phenoxyethanol', 'Chlorphenesin',
    ],
    skinTypes: ['aging', 'all'],
    image: '/products/argireline-solution-10.png',
    category: 'Serums',
    volume: '30ml',
    featured: false,
  },
]

export const categories = ['Serums', 'Moisturizers', 'Cleansers', 'Exfoliants', 'Eye Care'] as const
export type Category = typeof categories[number]

export const skinTypeOptions = ['oily', 'dry', 'combination', 'acne', 'aging', 'sensitive', 'dull', 'dehydrated', 'all', 'rosacea']

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.skinTypes.some((s) => product.skinTypes.includes(s))))
    .slice(0, count)
}
