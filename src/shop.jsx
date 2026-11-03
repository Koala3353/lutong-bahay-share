import { useState } from 'react'
import { ImpactCounter } from './components/parts.jsx'
import { PageHead } from './pages.jsx'
import { PAY_LABEL, TIME_OPTIONS, pctOff, peso } from './format.js'
import { randomShopForm } from './random.js'
import { useRoom } from './store.jsx'

const TONES = ['butter', 'peach', 'mint', 'pink']

const EMPTY = {
  shop: '', kind: 'Bakery', area: '', address: '',
  name: '', items: '', tags: '', allergens: '',
  meals: '', orig: '', price: '', qty: 2,
  pickupStart: '7:00 PM', pickupEnd: '8:00 PM', note: '',
}

const loadProfile = () => {
  try { return JSON.parse(localStorage.getItem('lbs-shop') || '{}') } catch { return {} }
}

function Field({ label, children, hint }) {
  return (
    <label className="fld">
      <span>{label}</span>
      {children}
      {hint && <small className="muted">{hint}</small>}
    </label>
  )
}

export function Shop() {
  const { publish, peerId, bags, impact } = useRoom()
  const [f, setF] = useState(() => ({ ...EMPTY, ...loadProfile() }))
  const [step, setStep] = useState('form')
  const [errors, setErrors] = useState([])
  const [posted, setPosted] = useState(null)

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const lines = f.items.split('\n').map((s) => s.trim()).filter(Boolean)
  const mine = bags.filter((b) => b.peer === peerId)
  const orders = mine.flatMap((b) => b.winners.map((w) => ({ ...w, bag: b }))).sort((a, b) => b.ts - a.ts)

  const validate = () => {
    const errs = []
    const orig = Number(f.orig), price = Number(f.price), qty = Number(f.qty)
    if (!f.shop.trim()) errs.push('Add your shop name.')
    if (!f.address.trim()) errs.push('Add the pickup address.')
    if (!f.name.trim()) errs.push('Name the bag.')
    if (lines.length === 0) errs.push('List what is inside, one item per line.')
    if (!(orig > 0) || !(price > 0)) errs.push('Enter the original value and the bag price.')
    else if (price >= orig) errs.push('The bag price must be lower than the original value.')
    if (!(qty >= 1)) errs.push('Offer at least one bag.')
    if (TIME_OPTIONS.indexOf(f.pickupEnd) <= TIME_OPTIONS.indexOf(f.pickupStart)) errs.push('Pickup must end after it starts.')
    return errs
  }

  const review = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (!errs.length) setStep('review')
  }

  const post = () => {
    const ev = publish({
      type: 'bag', peer: peerId,
      shop: f.shop.trim(), kind: f.kind, area: f.area.trim(), address: f.address.trim(),
      name: f.name.trim(), items: lines,
      tags: f.tags.split(',').map((s) => s.trim()).filter(Boolean),
      allergens: f.allergens.trim() || 'None listed',
      meals: Number(f.meals) || lines.length,
      orig: Number(f.orig), price: Number(f.price), qty: Number(f.qty),
      pickupStart: f.pickupStart, pickupEnd: f.pickupEnd, note: f.note.trim(),
      tone: TONES[Math.floor(Math.random() * TONES.length)],
    })
    try { localStorage.setItem('lbs-shop', JSON.stringify({ shop: f.shop, kind: f.kind, area: f.area, address: f.address })) } catch { /* ignore */ }
    setPosted(ev)
    setF({ ...EMPTY, shop: f.shop, kind: f.kind, area: f.area, address: f.address })
    setStep('form')
  }

  const fill = () => {
    setF({ ...EMPTY, ...randomShopForm() })
    setErrors([])
  }

  return (
    <div className="page wrap">
      <PageHead mood="happy" title="Post a surplus bag">You are a shop. Bags you post show up on every buyer&apos;s phone, and reservations come back here.</PageHead>

      {posted && (
        <div className="notice ok" role="status">
          <strong>{posted.name} is live.</strong> {posted.qty} {posted.qty === 1 ? 'bag' : 'bags'} at {peso(posted.price)}, pickup {posted.pickupStart} to {posted.pickupEnd}.
        </div>
      )}

      <div className="split">
        {step === 'form' ? (
          <form className="panel form" onSubmit={review}>
            <div className="row-between">
              <h2>New bag</h2>
              <button type="button" className="btn alt small" onClick={fill}>Fill random info</button>
            </div>

            <fieldset>
              <legend>Your shop</legend>
              <Field label="Shop name"><input className="field" value={f.shop} onChange={set('shop')} placeholder="e.g. Kapitbahay Bakery" /></Field>
              <div className="row two">
                <Field label="Type">
                  <select className="field" value={f.kind} onChange={set('kind')}>
                    <option>Bakery</option><option>Restaurant</option><option>Grocery</option>
                  </select>
                </Field>
                <Field label="Area"><input className="field" value={f.area} onChange={set('area')} placeholder="e.g. Katipunan, Quezon City" /></Field>
              </div>
              <Field label="Pickup address"><input className="field" value={f.address} onChange={set('address')} placeholder="Street and number" /></Field>
            </fieldset>

            <fieldset>
              <legend>The bag</legend>
              <Field label="Bag name"><input className="field" value={f.name} onChange={set('name')} placeholder="e.g. Pandesal and pastry bag" /></Field>
              <Field label="What is inside" hint="One item per line. Buyers see this list before they reserve."><textarea className="field" rows={4} value={f.items} onChange={set('items')} /></Field>
              <div className="row two">
                <Field label="Dietary tags" hint="Separate with commas"><input className="field" value={f.tags} onChange={set('tags')} placeholder="Vegetarian, Hot meal" /></Field>
                <Field label="Allergens"><input className="field" value={f.allergens} onChange={set('allergens')} placeholder="Wheat, eggs, milk" /></Field>
              </div>
            </fieldset>

            <fieldset>
              <legend>Price and pickup</legend>
              <div className="row">
                <Field label="Original value (₱)"><input className="field" type="number" min="1" value={f.orig} onChange={set('orig')} /></Field>
                <Field label="Bag price (₱)"><input className="field" type="number" min="1" value={f.price} onChange={set('price')} /></Field>
                <Field label="Bags available"><input className="field" type="number" min="1" value={f.qty} onChange={set('qty')} /></Field>
              </div>
              <div className="row">
                <Field label="Meals in a bag" hint="Leave blank to count the items"><input className="field" type="number" min="1" value={f.meals} onChange={set('meals')} /></Field>
                <Field label="Pickup starts">
                  <select className="field" value={f.pickupStart} onChange={set('pickupStart')}>{TIME_OPTIONS.map((t) => <option key={t}>{t}</option>)}</select>
                </Field>
                <Field label="Pickup ends">
                  <select className="field" value={f.pickupEnd} onChange={set('pickupEnd')}>{TIME_OPTIONS.map((t) => <option key={t}>{t}</option>)}</select>
                </Field>
              </div>
              <Field label="Note for buyers (optional)"><input className="field" value={f.note} onChange={set('note')} placeholder="e.g. Show your code at the counter" /></Field>
            </fieldset>

            {errors.length > 0 && (
              <div className="notice" role="alert">
                <ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul>
              </div>
            )}
            <button className="btn big" type="submit">Review bag</button>
          </form>
        ) : (
          <div className="panel form">
            <h2>Check before posting</h2>
            <dl className="summary">
              <dt>Shop</dt><dd>{f.shop} ({f.kind})<br />{f.address}</dd>
              <dt>Bag</dt><dd>{f.name}</dd>
              <dt>Inside</dt><dd>{lines.join(', ')}</dd>
              <dt>Allergens</dt><dd>{f.allergens || 'None listed'}</dd>
              <dt>Price</dt><dd>{peso(f.price)} instead of {peso(f.orig)} ({pctOff(f.orig, f.price)}% off)</dd>
              <dt>Bags</dt><dd>{f.qty} available, {Number(f.meals) || lines.length} meals each</dd>
              <dt>Pickup</dt><dd>{f.pickupStart} to {f.pickupEnd}</dd>
              {f.note && (<><dt>Note</dt><dd>{f.note}</dd></>)}
            </dl>
            <div className="actions-row">
              <button className="btn big" onClick={post}>Post bag</button>
              <button className="btn alt big" onClick={() => setStep('form')}>Edit</button>
            </div>
          </div>
        )}

        <div className="panel">
          <h2>Reservations</h2>
          {orders.length === 0 ? (
            <p className="muted">No reservations yet. When a buyer grabs one of your bags, their code and name show up here.</p>
          ) : (
            <ul className="orders">
              {orders.map((o) => (
                <li key={o.id} className="order">
                  <div className="row-between">
                    <strong className="code-sm">{o.code}</strong>
                    <span className={`pill ${o.pickedUp ? 'mine' : ''}`}>{o.pickedUp ? 'Picked up' : 'Waiting for pickup'}</span>
                  </div>
                  <div>{o.name} · {o.bag.name}</div>
                  <div className="meta">{PAY_LABEL[o.pay] || 'Cash on pickup'}{o.note ? ` · "${o.note}"` : ''}</div>
                  {!o.pickedUp && (
                    <button className="btn alt small" onClick={() => publish({ type: 'pickup', grabId: o.id })}>Mark picked up</button>
                  )}
                </li>
              ))}
            </ul>
          )}

          <h2 style={{ marginTop: 32 }}>Your bags</h2>
          {mine.length === 0 ? (
            <p className="muted">Nothing posted yet.</p>
          ) : (
            <ul className="feed">
              {mine.map((b) => <li key={b.id}><strong>{b.name}</strong>: {b.left} of {b.qty} left</li>)}
            </ul>
          )}

          <h2 style={{ marginTop: 32 }}>Room impact</h2>
          <ImpactCounter impact={impact} />
        </div>
      </div>
    </div>
  )
}
