export const peso = (n) => `₱${Number(n).toLocaleString('en-PH')}`

export const pctOff = (orig, price) => Math.round(((orig - price) / orig) * 100)

export const PAY_LABEL = { gcash: 'GCash', maya: 'Maya', cash: 'Cash on pickup' }

// Half-hour pickup times from 5:00 PM to 10:30 PM, in the same format the seed data uses.
export const TIME_OPTIONS = (() => {
  const out = []
  for (let m = 17 * 60; m <= 22 * 60 + 30; m += 30) {
    const h = Math.floor(m / 60)
    const mm = String(m % 60).padStart(2, '0')
    out.push(`${h > 12 ? h - 12 : h}:${mm} ${h >= 12 ? 'PM' : 'AM'}`)
  }
  return out
})()

export const newCode = () =>
  `LBS-${Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('')}`
