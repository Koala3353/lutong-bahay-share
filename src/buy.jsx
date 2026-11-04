import { useEffect, useMemo, useRef, useState } from 'react'
import { ImpactCounter } from './components/parts.jsx'
import { PageHead } from './pages.jsx'
import { PAY_LABEL, newCode, pctOff, peso } from './format.js'
import { randomBuyerForm } from './random.js'
import { useRoom } from './store.jsx'

const KINDS = ['All', 'Bakery', 'Restaurant', 'Grocery']

function BagCard({ bag, peerId, onOpen }) {
  const won = bag.winners.some((w) => w.peer === peerId)
  const out = bag.left <= 0
  return (
    <article className="bag rise">
      <div className="bag-top">
        <span className={`shop-mark tone-${bag.tone}`} aria-hidden="true">{bag.shop[0]}</span>
        <div>
          <h3>{bag.name}</h3>
          <div className="meta">{bag.shop} · {bag.area}</div>
        </div>
      </div>
      <div className="meta">{bag.meals} meals · pickup {bag.pickupStart} to {bag.pickupEnd}</div>
      {bag.tags?.length > 0 && <div className="tags">{bag.tags.map((t) => <span key={t} className="tag-sm">{t}</span>)}</div>}
      <div className="price">
        <strong className="num">{peso(bag.price)}</strong>
        <s className="num">{peso(bag.orig)}</s>
        <span className="save">{pctOff(bag.orig, bag.price)}% off</span>
      </div>
      <div>
        {won ? <span className="pill mine">Reserved by you</span>
          : out ? <span className="pill out">Sold out</span>
          : <span className="pill">{bag.left} of {bag.qty} left</span>}
      </div>
      <button className="btn" onClick={() => onOpen(bag.id)}>{won ? 'View reservation' : out ? 'View bag' : 'View bag and reserve'}</button>
    </article>
  )
}

function BagDialog({ bagId, onClose }) {
  const { bags, publish, peerId } = useRoom()
  const ref = useRef(null)
  const bag = bags.find((b) => b.id === bagId)
  const [f, setF] = useState(() => {
    let name = ''
    try { name = localStorage.getItem('lbs-name') || '' } catch { /* ignore */ }
    return { name, pay: 'gcash', note: '' }
  })
  const [attempt, setAttempt] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const d = ref.current
    if (d && !d.open) d.showModal()
  }, [])

  if (!bag) return null
  const mineWin = bag.winners.find((w) => w.peer === peerId)
  const lost = attempt && !mineWin && bag.left <= 0
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const confirm = (e) => {
    e.preventDefault()
    if (!f.name.trim()) return setError('Add your name so the shop can find your order.')
    setError('')
    try { localStorage.setItem('lbs-name', f.name.trim()) } catch { /* ignore */ }
    const ev = publish({ type: 'grab', bagId: bag.id, peer: peerId, name: f.name.trim(), pay: f.pay, note: f.note.trim(), code: newCode() })
    setAttempt(ev.id)
  }

  const Details = (
    <>
      <div className="meta">{bag.shop} · {bag.kind}</div>
      <ul className="items">{bag.items?.map((i) => <li key={i}>{i}</li>)}</ul>
      <dl className="summary">
        <dt>Pickup</dt><dd>{bag.pickupStart} to {bag.pickupEnd}</dd>
        <dt>Where</dt><dd>{bag.address}</dd>
        <dt>Allergens</dt><dd>{bag.allergens}</dd>
        {bag.note && (<><dt>Shop note</dt><dd>{bag.note}</dd></>)}
      </dl>
    </>
  )

  return (
    <dialog ref={ref} className="sheet" onClose={onClose} onClick={(e) => e.target === ref.current && ref.current.close()}>
      <div className="sheet-in">
        <div className="row-between">
          <h2>{mineWin ? 'Reservation confirmed' : bag.name}</h2>
          <button className="btn alt small" onClick={() => ref.current.close()} aria-label="Close">Close</button>
        </div>

        {mineWin ? (
          <>
            <div className="code-box">
              <div className="meta">Show this code at the counter</div>
              <div className="code-big">{mineWin.code}</div>
            </div>
            <h3 style={{ marginTop: 16 }}>{bag.name}</h3>
            {Details}
            <dl className="summary">
              <dt>Name</dt><dd>{mineWin.name}</dd>
              <dt>Total</dt><dd>{peso(bag.price)} · {mineWin.pay === 'cash' ? 'pay in cash when you pick up' : `paid with ${PAY_LABEL[mineWin.pay]} (demo)`}</dd>
              <dt>Status</dt><dd>{mineWin.pickedUp ? 'Picked up' : 'Reserved, waiting for pickup'}</dd>
            </dl>
          </>
        ) : (
          <>
            {Details}
            {bag.left <= 0 ? (
              <div className="notice" role="status">{lost ? 'Someone grabbed the last bag a moment before you. Try another bag.' : 'This bag is sold out.'}</div>
            ) : (
              <form className="form" onSubmit={confirm}>
                <div className="row-between">
                  <h3>Your details</h3>
                  <button type="button" className="btn alt small" onClick={() => setF(randomBuyerForm())}>Fill random info</button>
                </div>
                <label className="fld"><span>Name</span><input className="field" value={f.name} onChange={set('name')} maxLength={32} /></label>
                <fieldset>
                  <legend>Payment</legend>
                  <div className="choices three">
                    {Object.entries(PAY_LABEL).map(([id, label]) => (
                      <label key={id} className={`choice-lbl ${f.pay === id ? 'on' : ''}`}>
                        <input type="radio" name="pay" value={id} checked={f.pay === id} onChange={set('pay')} />{label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="fld"><span>Note to the shop (optional)</span><input className="field" value={f.note} onChange={set('note')} maxLength={80} /></label>
                <p className="muted demo-note">Demo only. No payment is taken, and your details pass through public relay servers and show up for everyone in this room. Use made-up info.</p>
                {error && <div className="notice" role="alert">{error}</div>}
                <button className="btn big" type="submit">Reserve for {peso(bag.price)}</button>
              </form>
            )}
          </>
        )}
      </div>
    </dialog>
  )
}

export function Buy() {
  const { bags, peerId, impact } = useRoom()
  const [kind, setKind] = useState('All')
  const [open, setOpen] = useState(null)

  const shown = useMemo(() => bags.filter((b) => kind === 'All' || b.kind === kind), [bags, kind])
  const mine = useMemo(
    () => bags.flatMap((b) => b.winners.filter((w) => w.peer === peerId).map((w) => ({ ...w, bag: b }))).sort((a, b) => b.ts - a.ts),
    [bags, peerId],
  )

  return (
    <div className="page wrap">
      <PageHead mood="cheer" bag title="Grab a bag before it sells out">You are a buyer. Open a bag to see what is inside, then reserve it and pick it up before closing.</PageHead>
      <div className="panel" style={{ marginBottom: 24 }}>
        <ImpactCounter impact={impact} />
      </div>

      {mine.length > 0 && (
        <div className="panel" style={{ marginBottom: 24 }}>
          <h2>Your reservations</h2>
          <ul className="orders">
            {mine.map((o) => (
              <li key={o.id} className="order">
                <div className="row-between">
                  <strong className="code-sm">{o.code}</strong>
                  <span className={`pill ${o.pickedUp ? 'mine' : ''}`}>{o.pickedUp ? 'Picked up' : 'Reserved'}</span>
                </div>
                <div>{o.bag.name} · {o.bag.shop}</div>
                <div className="meta">Pickup {o.bag.pickupStart} to {o.bag.pickupEnd}, {o.bag.address}</div>
                <button className="btn alt small" onClick={() => setOpen(o.bag.id)}>View details</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="chips" role="group" aria-label="Filter by shop type">
        {KINDS.map((k) => (
          <button key={k} className={`chip ${kind === k ? 'on' : ''}`} aria-pressed={kind === k} onClick={() => setKind(k)}>{k}</button>
        ))}
        <span className="muted chip-count">{shown.length} {shown.length === 1 ? 'bag' : 'bags'}</span>
      </div>

      <div className="bags">
        {shown.map((b) => <BagCard key={b.id} bag={b} peerId={peerId} onOpen={setOpen} />)}
      </div>

      {open && <BagDialog key={open} bagId={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
