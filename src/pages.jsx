import { useMemo } from 'react'
import Mascot from './components/Mascot.jsx'
import { ImpactCounter, PollResults, QrCode } from './components/parts.jsx'
import { POLL_OPTIONS } from './seed.js'
import { useRoom } from './store.jsx'

const base = import.meta.env.BASE_URL
export const roomUrl = (room, page = 'poll') => `${location.origin}${base}#/r/${room}/${page}`

export function PageHead({ mood, bag, title, children }) {
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

export function Screen() {
  const { room, bags, counts, totalVotes, impact, peers, publish } = useRoom()
  const reset = () => {
    if (window.confirm('Clear all votes, bags and reservations in this room for everyone?')) publish({ type: 'reset' })
  }
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
          <button className="btn alt small" onClick={reset}>Reset room</button>
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
