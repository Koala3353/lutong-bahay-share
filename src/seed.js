// Sample shops so the buyer view is never empty. Fictional, for the class demo only.
export const SEED_BAGS = [
  {
    id: 'seed-1', type: 'bag', ts: 0, seed: true,
    shop: 'Panaderya ni Aling Nena', kind: 'Bakery', name: 'Pandesal and ensaymada bag',
    meals: 4, price: 60, orig: 160, qty: 3, pickup: '7:00 to 8:00 PM', tone: 'butter',
  },
  {
    id: 'seed-2', type: 'bag', ts: 0, seed: true,
    shop: 'Kainan sa Kanto', kind: 'Restaurant', name: 'Adobo and rice ulam bag',
    meals: 2, price: 90, orig: 220, qty: 2, pickup: '8:30 to 9:30 PM', tone: 'peach',
  },
  {
    id: 'seed-3', type: 'bag', ts: 0, seed: true,
    shop: 'Mercado Fresh Mart', kind: 'Grocery', name: 'Gulay and prutas bag',
    meals: 3, price: 75, orig: 180, qty: 4, pickup: '7:30 to 8:30 PM', tone: 'mint',
  },
  {
    id: 'seed-4', type: 'bag', ts: 0, seed: true,
    shop: "Tita Beth's Pastries", kind: 'Bakery', name: 'Leche flan and cake slices',
    meals: 4, price: 110, orig: 260, qty: 2, pickup: '8:00 to 9:00 PM', tone: 'pink',
  },
]

export const POLL_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
  { id: 'never', label: "I can't remember" },
]
