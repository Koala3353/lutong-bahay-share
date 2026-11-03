// Made-up data for the "Fill random info" buttons. No real people or shops.
const pick = (list) => list[Math.floor(Math.random() * list.length)]
const int = (min, max) => min + Math.floor(Math.random() * (max - min + 1))

const FIRST = ['Maria', 'Jose', 'Angelica', 'Miguel', 'Bea', 'Paolo', 'Trisha', 'Carlo', 'Nina', 'Rafael', 'Jasmine', 'Enzo', 'Kyla', 'Dani']
const LAST = ['Santos', 'Reyes', 'Cruz', 'Bautista', 'Garcia', 'Mendoza', 'Villanueva', 'Navarro', 'Aquino', 'Ramos', 'Dizon', 'Castillo']

const SHOPS = [
  { shop: 'Kapitbahay Bakery', kind: 'Bakery', area: 'Katipunan, Quezon City', street: '12 Esteban Abada St.' },
  { shop: "Aling Rosa's Carinderia", kind: 'Restaurant', area: 'Marikina Heights', street: '45 Shoe Ave.' },
  { shop: 'Sariwa Grocery', kind: 'Grocery', area: 'Poblacion, Makati', street: '8 Kalayaan Ave.' },
  { shop: 'Tahanan Kitchen', kind: 'Restaurant', area: 'San Juan City', street: '31 N. Domingo St.' },
  { shop: 'Hapag Deli and Cakes', kind: 'Bakery', area: 'Mandaluyong', street: '77 Shaw Blvd.' },
  { shop: 'Palengke Pantry', kind: 'Grocery', area: 'Pasig City', street: '19 Caruncho Ave.' },
]

const BAGS = {
  Bakery: [
    { name: 'Pandesal and pastry bag', items: ['6 pandesal', '2 ensaymada', '2 monay', '1 loaf of tasty bread'], tags: ['Vegetarian'], allergens: 'Wheat, eggs, milk' },
    { name: 'Cake and kakanin bag', items: ['3 slices of chiffon cake', '2 pieces of bibingka', '4 pieces of puto'], tags: ['Vegetarian'], allergens: 'Wheat, eggs, milk' },
  ],
  Restaurant: [
    { name: 'Ulam and rice bag', items: ['2 servings of chicken adobo', '2 cups of garlic rice', '1 serving of pancit'], tags: ['Hot meal'], allergens: 'Soy, wheat' },
    { name: 'Sinigang and lumpia bag', items: ['2 servings of pork sinigang', '2 cups of rice', '6 pieces of lumpia'], tags: ['Hot meal'], allergens: 'Soy, shellfish' },
  ],
  Grocery: [
    { name: 'Gulay and prutas bag', items: ['1 kg of mixed vegetables', '4 bananas', '2 mangoes', '1 bundle of kangkong'], tags: ['Vegan', 'Fresh'], allergens: 'None listed' },
    { name: 'Pantry and dairy bag', items: ['2 yogurt cups', '1 loaf of bread', '1 dozen eggs', '2 packs of noodles'], tags: ['Vegetarian'], allergens: 'Milk, eggs, wheat' },
  ],
}

const TIMES = [['6:30 PM', '7:30 PM'], ['7:00 PM', '8:00 PM'], ['7:30 PM', '8:30 PM'], ['8:00 PM', '9:00 PM'], ['8:30 PM', '9:30 PM']]

export function randomName() {
  return `${pick(FIRST)} ${pick(LAST)}`
}

export function randomShopForm() {
  const s = pick(SHOPS)
  const b = pick(BAGS[s.kind])
  const orig = int(12, 30) * 10
  const price = Math.max(40, Math.round((orig * int(30, 45)) / 1000) * 10)
  const [pickupStart, pickupEnd] = pick(TIMES)
  return {
    shop: s.shop,
    kind: s.kind,
    area: s.area,
    address: `${s.street}, ${s.area}`,
    name: b.name,
    items: b.items.join('\n'),
    tags: b.tags.join(', '),
    allergens: b.allergens,
    meals: b.items.length,
    orig,
    price,
    qty: int(2, 5),
    pickupStart,
    pickupEnd,
    note: pick(['Bring your own bag if you can.', 'Show your code at the counter.', 'Pickup at the side door after 7 PM.', '']),
  }
}

export function randomBuyerForm() {
  return {
    name: randomName(),
    pay: pick(['gcash', 'maya', 'cash']),
    note: pick(['', 'Will arrive 10 minutes before closing.', 'No spicy items please.', 'Picking up for my mom.']),
  }
}
