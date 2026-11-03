import { useMemo, useState } from 'react'
import Mascot from './components/Mascot.jsx'
import { ImpactCounter, PollResults, QrCode } from './components/parts.jsx'
import { POLL_OPTIONS } from './seed.js'
import { useRoom } from './store.jsx'

const base = import.meta.env.BASE_URL
export const roomUrl = (room, page = 'poll') => `${location.origin}${base}#/r/${room}/${page}`
const peso = (n) => `₱${Number(n).toLocaleString('en-PH')}`

export function Home({ go }) {
  const [code, setCode] = useState('')
  const newCode = () => Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 24)]).join('')
  const join = (e) => {
    e.preventDefault()
    const c = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (c) go(`/r/${c}/poll`)
  }

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="rise">
            <h1>Good food should not end up in the bin at closing time</h1>
            <p className="lead">
              Lutong Bahay Share lets restaurants, bakeries and groceries sell unsold but still good food as discounted
              pickup bags. Households save money and less food gets thrown away.
            </p>
            <div className="actions">
              <button className="btn big" onClick={() => go(`/r/${newCode()}/screen`)}>Start a live room</button>
              <button className="btn alt big" onClick={() => go('/r/demo/buy')}>Try the app</button>
            </div>
            <form className="join" onSubmit={join}>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Room code" aria-label="Room code" maxLength={8} />
              <button className="btn alt" type="submit">Join</button>
            </form>
          </div>
          <div className="stage rise" aria-hidden="false">
            <span className="tag t1">Pickup before closing</span>
            <Mascot mood="cheer" bag size={300} />
            <span className="tag t2">Surplus bag, ₱90</span>
          </div>
        </div>
      </section>

      <section className="section tint" id="problem">
        <div className="wrap">
          <div className="section-head">
            <h2>Three problems, one leftover shelf</h2>
          </div>
          <div className="cards">
            <div className="card"><span className="badge peach">1</span><h3>Good food is thrown out every day</h3><p>Food that is safe and tasty still goes in the bin when a shop closes for the night.</p></div>
            <div className="card"><span className="badge butter">2</span><h3>Households want cheaper food</h3><p>Families and workers, not only students, are looking for meals that cost less.</p></div>
            <div className="card"><span className="badge pink">3</span><h3>Shops have no easy way to sell leftovers</h3><p>Posting, pricing and arranging pickup for leftovers takes time shops do not have.</p></div>
          </div>
        </div>
      </section>

      <section className="section" id="numbers">
        <div className="wrap">
          <div className="section-head">
            <h2>The numbers behind the bin</h2>
            <p>Figures from the UN Environment Programme&apos;s Food Waste Index Report 2024, which covers 2022.</p>
          </div>
          <div className="facts">
            <div className="stat tone-peach"><div className="stat-value">1.05 billion t</div><div className="stat-label">of food wasted worldwide, almost one-fifth of all food available to consumers</div></div>
            <div className="stat tone-butter"><div className="stat-value">60%</div><div className="stat-label">of that waste happens in households, 28% in food services and 12% in retail</div></div>
            <div className="stat tone-mint"><div className="stat-value">2.95 million t</div><div className="stat-label">of food wasted by Philippine households in a year, about 26 kg per person</div></div>
            <div className="stat tone-pink"><div className="stat-value">8 to 10%</div><div className="stat-label">of global greenhouse gas emissions come from food loss and waste</div></div>
          </div>
          <p className="sources muted">
            Sources:{' '}
            <a href="https://www.unep.org/news-and-stories/press-release/world-squanders-over-1-billion-meals-day-un-report" target="_blank" rel="noreferrer">UNEP press release, 27 March 2024</a>
            {' · '}
            <a href="https://bworldonline.com/economy/2024/03/27/584555/phl-household-food-waste-falls-sharply-to-nearly-3-million-tonnes-a-year-unep/" target="_blank" rel="noreferrer">BusinessWorld (Reuters) on the Philippine figure</a>
          </p>
        </div>
      </section>

      <section className="section tint" id="how">
        <div className="wrap">
          <div className="section-head">
            <h2>How a surplus bag works</h2>
            <p>A bag is a mix of the day&apos;s unsold food at a fixed discounted price, with a set pickup window.</p>
          </div>
          <div className="cards">
            <div className="card"><span className="badge mint">1</span><h3>Shops post a bag</h3><p>Pick the items, set the price and the pickup time. It takes under a minute.</p></div>
            <div className="card"><span className="badge mint">2</span><h3>Buyers reserve and pay</h3><p>Browse bags nearby, grab one before it sells out and pay in the app.</p></div>
            <div className="card"><span className="badge mint">3</span><h3>Pickup before closing</h3><p>Show your reservation at the counter and take your food home.</p></div>
          </div>
        </div>
      </section>

      <section className="section" id="model">
        <div className="wrap split">
          <div className="card">
            <h2>How the business earns</h2>
            <p>A commission on every bag sold, plus an optional subscription for sellers who want extra features.</p>
          </div>
          <div className="card">
            <h2>What it changes</h2>
            <p>Less food waste, lower emissions from wasted food, and real savings for households.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap">Lutong Bahay Share is a class project for STS 10. Shops and prices in the demo are made up.</div>
      </footer>
    </>
  )
}

function PageHead({ mood, bag, title, children }) {
  return (
    <div className="page-head">
      <Mascot mood={mood} bag={bag} size={96} />
      <div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>{title}</h1>
        <p>{children}</p>
      </div>
    </div>
  )
}

export function Poll({ go }) {
  const { room, publish, peerId, counts, totalVotes, votes } = useRoom()
  const mine = votes.get(peerId)?.choice
  return (
    <div className="page wrap">
      <PageHead mood="wink" title="When did you last throw away food?">Pick one. Results update live for everyone in the room.</PageHead>
      <div className="split">
        <div className="panel">
          <h2>Your answer</h2>
          <div className="choices">
            {POLL_OPTIONS.map((o) => (
              <button
                key={o.id}
                className={`choice ${mine === o.id ? 'on' : ''}`}
                aria-pressed={mine === o.id}
                onClick={() => publish({ type: 'vote', peer: peerId, choice: o.id })}
              >
                {o.label}
              </button>
            ))}
          </div>
          {mine && (
            <div className="actions" style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn" onClick={() => go(`/r/${room}/shop`)}>Play a shop</button>
              <button className="btn alt" onClick={() => go(`/r/${room}/buy`)}>Play a buyer</button>
            </div>
          )}
        </div>
        <div className="panel">
          <h2>{totalVotes} {totalVotes === 1 ? 'answer' : 'answers'} so far</h2>
          <PollResults counts={counts} total={totalVotes} mine={mine} />
        </div>
      </div>
    </div>
  )
}

const TONES = ['butter', 'peach', 'mint', 'pink']

export function Shop() {
  const { publish, peerId, bags, impact } = useRoom()
  const [f, setF] = useState({ shop: '', name: 'Mixed pastry bag', meals: 3, orig: 150, price: 60, qty: 2, pickup: '8:00 to 9:00 PM' })
  const [error, setError] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const mine = bags.filter((b) => b.peer === peerId)

  const post = (e) => {
    e.preventDefault()
    const meals = Number(f.meals), orig = Number(f.orig), price = Number(f.price), qty = Number(f.qty)
    if (!f.shop.trim() || !f.name.trim()) return setError('Add your shop name and a bag name.')
    if (![meals, orig, price, qty].every((n) => n > 0)) return setError('Meals, prices and bags left must be more than zero.')
    if (price >= orig) return setError('The bag price must be lower than the original value.')
    setError('')
    publish({
      type: 'bag', peer: peerId, shop: f.shop.trim(), kind: 'Shop', name: f.name.trim(),
      meals, orig, price, qty, pickup: f.pickup.trim() || 'Before closing',
      tone: TONES[Math.floor(Math.random() * TONES.length)],
    })
  }

  return (
    <div className="page wrap">
      <PageHead mood="happy" title="Post a surplus bag">You are a shop. Bags you post show up on every buyer&apos;s phone.</PageHead>
      <div className="split">
        <form className="panel form" onSubmit={post}>
          <h2>New bag</h2>
          <label>Shop name<input className="field" value={f.shop} onChange={set('shop')} placeholder="Your shop" /></label>
          <label>Bag name<input className="field" value={f.name} onChange={set('name')} /></label>
          <div className="row">
            <label>Meals<input className="field" type="number" min="1" value={f.meals} onChange={set('meals')} /></label>
            <label>Original value (₱)<input className="field" type="number" min="1" value={f.orig} onChange={set('orig')} /></label>
            <label>Bag price (₱)<input className="field" type="number" min="1" value={f.price} onChange={set('price')} /></label>
          </div>
          <div className="row" style={{ gridTemplateColumns: '1fr 2fr' }}>
            <label>Bags<input className="field" type="number" min="1" value={f.qty} onChange={set('qty')} /></label>
            <label>Pickup window<input className="field" value={f.pickup} onChange={set('pickup')} /></label>
          </div>
          {error && <div className="notice" role="alert">{error}</div>}
          <button className="btn big" type="submit">Post bag</button>
        </form>
        <div className="panel">
          <h2>Your bags</h2>
          {mine.length === 0 ? (
            <p className="muted">Nothing posted yet. Post a bag and watch buyers grab it.</p>
          ) : (
            <ul className="feed">
              {mine.map((b) => (
                <li key={b.id}>
                  <strong>{b.name}</strong>, {b.left} of {b.qty} left
                  {b.winners.length > 0 && <> · grabbed by {b.winners.map((w) => w.name).join(', ')}</>}
                </li>
              ))}
            </ul>
          )}
          <h2 style={{ marginTop: 32 }}>Room impact</h2>
          <ImpactCounter impact={impact} />
        </div>
      </div>
    </div>
  )
}

function BagCard({ bag, peerId, name, tried, onGrab }) {
  const won = bag.winners.some((w) => w.peer === peerId)
  const out = bag.left <= 0
  const lost = !won && out && tried
  return (
    <article className="bag rise">
      <div className="bag-top">
        <span className={`shop-mark tone-${bag.tone}`} aria-hidden="true">{bag.shop[0]}</span>
        <div>
          <h3>{bag.name}</h3>
          <div className="meta">{bag.shop}</div>
        </div>
      </div>
      <div className="meta">{bag.meals} meals · pickup {bag.pickup}</div>
      <div className="price"><strong className="num">{peso(bag.price)}</strong><s className="num">{peso(bag.orig)}</s></div>
      <div>
        {won ? <span className="pill mine">Yours, pick up {bag.pickup}</span>
          : out ? <span className="pill out">Sold out</span>
          : <span className="pill">{bag.left} left</span>}
      </div>
      {lost && <div className="notice" role="status">Someone grabbed it first. Try another bag.</div>}
      <button className="btn" disabled={out || won} onClick={() => onGrab(bag)}>
        {won ? 'Reserved' : out ? 'Sold out' : `Grab bag as ${name}`}
      </button>
    </article>
  )
}

export function Buy() {
  const { publish, peerId, bags, impact } = useRoom()
  const [name, setName] = useState(() => {
    try { return localStorage.getItem('lbs-name') || `Buyer ${peerId.slice(0, 3).toUpperCase()}` } catch { return 'Buyer' }
  })
  const [tried, setTried] = useState(() => new Set())
  const grab = (bag) => {
    setTried((t) => new Set(t).add(bag.id))
    try { localStorage.setItem('lbs-name', name) } catch { /* ignore */ }
    publish({ type: 'grab', bagId: bag.id, peer: peerId, name: name.trim() || 'A buyer' })
  }
  return (
    <div className="page wrap">
      <PageHead mood="cheer" bag title="Grab a bag before it sells out">You are a buyer. Reserve one bag per shop and pick it up before closing.</PageHead>
      <div className="panel" style={{ marginBottom: 24 }}>
        <ImpactCounter impact={impact} />
      </div>
      <label className="form" style={{ maxWidth: 320 }}>
        <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ink-2)' }}>Your name</span>
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} maxLength={24} />
      </label>
      <div className="bags">
        {bags.map((b) => <BagCard key={b.id} bag={b} peerId={peerId} name={name.trim() || 'Buyer'} tried={tried.has(b.id)} onGrab={grab} />)}
      </div>
    </div>
  )
}

export function Screen() {
  const { room, bags, counts, totalVotes, impact, peers } = useRoom()
  const url = roomUrl(room, 'poll')
  const feed = useMemo(
    () => bags.flatMap((b) => b.winners.map((w) => ({ ...w, bag: b }))).sort((a, b) => b.ts - a.ts).slice(0, 6),
    [bags],
  )
  return (
    <div className="page wrap">
      <PageHead mood="happy" title="Lutong Bahay Share, live">Scan the code to join. Everything on this screen updates as people play.</PageHead>
      <div className="screen">
        <div className="panel qr-panel">
          <QrCode text={url} size={260} />
          <div className="code">{room}</div>
          <p className="muted">{peers + 1} {peers === 0 ? 'device' : 'devices'} connected</p>
        </div>
        <div className="panel">
          <h2>When did you last throw away food?</h2>
          <PollResults counts={counts} total={totalVotes} />
        </div>
        <div className="panel">
          <h2>Saved so far</h2>
          <ImpactCounter impact={impact} big />
          {feed.length > 0 && (
            <ul className="feed">
              {feed.map((g) => <li key={g.id}><strong>{g.name}</strong> grabbed {g.bag.name} from {g.bag.shop}</li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
