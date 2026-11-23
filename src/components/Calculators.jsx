import { KG_PER_MEAL } from '../store.jsx'
import { AnimatedNumber } from './parts.jsx'

export const DEFAULT_ASSUMPTIONS = { bag: 250, pct: 10, orders: 70, days: 360, meals: 3 }

function Num({ label, value, onChange, suffix, min = 0, step = 1 }) {
  return (
    <label className="fld">
      <span>{label}</span>
      <div className="with-suffix">
        <input className="field" type="number" inputMode="decimal" min={min} step={step} value={value} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
        {suffix && <em>{suffix}</em>}
      </div>
    </label>
  )
}

export function ModelCalculator({ a, setA }) {
  const set = (k) => (v) => setA({ ...a, [k]: v })
  const perBag = ((Number(a.bag) || 0) * (Number(a.pct) || 0)) / 100
  const perDay = perBag * (Number(a.orders) || 0)
  const perYear = perDay * (Number(a.days) || 0)
  return (
    <div className="calc">
      <div className="calc-inputs">
        <Num label="Average cost per bag" value={a.bag} onChange={set('bag')} suffix="₱" />
        <Num label="Commission" value={a.pct} onChange={set('pct')} suffix="%" />
        <Num label="Orders per day" value={a.orders} onChange={set('orders')} />
        <Num label="Days per year" value={a.days} onChange={set('days')} min={1} />
      </div>
      <div className="impact">
        <div className="stat tone-mint"><div className="stat-value"><AnimatedNumber value={perBag} prefix="₱" decimals={perBag % 1 ? 2 : 0} /></div><div className="stat-label">Earned per bag</div></div>
        <div className="stat tone-butter"><div className="stat-value"><AnimatedNumber value={perDay} prefix="₱" /></div><div className="stat-label">Earned per day</div></div>
        <div className="stat tone-peach"><div className="stat-value"><AnimatedNumber value={perYear} prefix="₱" /></div><div className="stat-label">Earned per year</div></div>
      </div>
      <button className="btn alt small" onClick={() => setA({ ...DEFAULT_ASSUMPTIONS })}>Reset to our assumptions</button>
    </div>
  )
}

export function ImpactCalculator({ a, setA }) {
  const set = (k) => (v) => setA({ ...a, [k]: v })
  const perDay = (Number(a.orders) || 0) * (Number(a.meals) || 0)
  const perYear = perDay * (Number(a.days) || 0)
  const kg = perYear * KG_PER_MEAL
  return (
    <div className="calc">
      <div className="calc-inputs">
        <Num label="Orders per day" value={a.orders} onChange={set('orders')} />
        <Num label="Meals in a bag" value={a.meals} onChange={set('meals')} min={1} />
        <Num label="Days per year" value={a.days} onChange={set('days')} min={1} />
      </div>
      <div className="impact">
        <div className="stat tone-mint"><div className="stat-value"><AnimatedNumber value={perDay} /></div><div className="stat-label">Meals rescued per day</div></div>
        <div className="stat tone-butter"><div className="stat-value"><AnimatedNumber value={perYear} /></div><div className="stat-label">Meals rescued per year</div></div>
        <div className="stat tone-pink"><div className="stat-value"><AnimatedNumber value={kg} suffix=" kg" /></div><div className="stat-label">Food kept out of the bin per year</div></div>
      </div>
      <p className="muted small-note">
        The same 70 orders a day as the business model. Three meals per bag and {KG_PER_MEAL} kg of food per meal are our own rough assumptions, not sourced figures. Change them above.
      </p>
    </div>
  )
}
