// Sample shops so the buyer view is never empty. Fictional, for the class demo only.
const bag = (n, o) => ({ id: `seed-${n}`, type: 'bag', ts: 0, seed: true, ...o })

export const SEED_BAGS = [
  bag(1, {
    shop: 'Panaderya ni Aling Nena', kind: 'Bakery', area: 'Sampaloc, Manila', address: '214 Dos Castillas St., Sampaloc, Manila',
    name: 'Pandesal and ensaymada bag', items: ['8 pandesal', '3 ensaymada', '2 pieces of pan de coco'],
    tags: ['Vegetarian'], allergens: 'Wheat, eggs, milk', meals: 4, price: 60, orig: 160, qty: 3,
    pickupStart: '7:00 PM', pickupEnd: '8:00 PM', note: 'Ask for Aling Nena at the counter.', tone: 'butter',
  }),
  bag(2, {
    shop: 'Kainan sa Kanto', kind: 'Restaurant', area: 'Teachers Village, Quezon City', address: '9 Maalalahanin St., Teachers Village, QC',
    name: 'Adobo and rice ulam bag', items: ['2 servings of chicken adobo', '2 cups of garlic rice', '1 serving of pancit canton'],
    tags: ['Hot meal'], allergens: 'Soy, wheat', meals: 2, price: 90, orig: 220, qty: 2,
    pickupStart: '8:30 PM', pickupEnd: '9:30 PM', note: 'Meals are packed hot. Eat the same night.', tone: 'peach',
  }),
  bag(3, {
    shop: 'Mercado Fresh Mart', kind: 'Grocery', area: 'Cubao, Quezon City', address: '55 General Romulo Ave., Cubao, QC',
    name: 'Gulay and prutas bag', items: ['1 kg of mixed vegetables', '4 bananas', '1 bundle of pechay', '2 tomatoes'],
    tags: ['Vegan', 'Fresh'], allergens: 'None listed', meals: 3, price: 75, orig: 180, qty: 4,
    pickupStart: '7:30 PM', pickupEnd: '8:30 PM', note: 'Bring a bag for your produce.', tone: 'mint',
  }),
  bag(4, {
    shop: "Tita Beth's Pastries", kind: 'Bakery', area: 'Marikina Heights', address: '18 Bayan-Bayanan Ave., Marikina',
    name: 'Leche flan and cake slices', items: ['2 llaneras of leche flan', '3 slices of mocha cake', '4 pieces of brownies'],
    tags: ['Vegetarian'], allergens: 'Eggs, milk, wheat', meals: 4, price: 110, orig: 260, qty: 2,
    pickupStart: '8:00 PM', pickupEnd: '9:00 PM', note: '', tone: 'pink',
  }),
  bag(5, {
    shop: "Lola Ising's Lugawan", kind: 'Restaurant', area: 'Malate, Manila', address: '1420 Adriatico St., Malate, Manila',
    name: "Lugaw and tokwa't baboy set", items: ['2 bowls of lugaw', "1 serving of tokwa't baboy", '2 boiled eggs'],
    tags: ['Hot meal'], allergens: 'Soy, eggs', meals: 2, price: 70, orig: 170, qty: 3,
    pickupStart: '9:00 PM', pickupEnd: '10:00 PM', note: 'Containers provided.', tone: 'butter',
  }),
  bag(6, {
    shop: 'Sunrise Mini Mart', kind: 'Grocery', area: 'Mandaluyong', address: '33 Boni Ave., Mandaluyong',
    name: 'Snack and dairy bag', items: ['2 yogurt cups', '1 loaf of sandwich bread', '1 dozen eggs', '2 packs of instant noodles'],
    tags: ['Vegetarian'], allergens: 'Milk, eggs, wheat', meals: 4, price: 85, orig: 200, qty: 5,
    pickupStart: '8:00 PM', pickupEnd: '9:00 PM', note: 'Items are within their best-before dates.', tone: 'mint',
  }),
  bag(7, {
    shop: 'Kusina ni Mang Ben', kind: 'Restaurant', area: 'Pasig City', address: '6 Kapitolyo Rd., Pasig',
    name: 'Sisig and kare-kare combo', items: ['2 servings of pork sisig', '1 serving of kare-kare', '3 cups of rice'],
    tags: ['Hot meal'], allergens: 'Peanuts, soy, shellfish', meals: 3, price: 120, orig: 280, qty: 2,
    pickupStart: '9:00 PM', pickupEnd: '10:00 PM', note: 'Contains peanuts.', tone: 'peach',
  }),
  bag(8, {
    shop: 'Pan de Sal Pa More', kind: 'Bakery', area: 'Cubao, Quezon City', address: '102 Aurora Blvd., Cubao, QC',
    name: 'Day-end bread bag', items: ['10 pandesal', '1 loaf of wheat bread', '3 pieces of cheese bread'],
    tags: ['Vegetarian'], allergens: 'Wheat, milk', meals: 4, price: 50, orig: 130, qty: 6,
    pickupStart: '6:30 PM', pickupEnd: '7:30 PM', note: '', tone: 'pink',
  }),
]

export const POLL_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
  { id: 'never', label: "I can't remember" },
]
