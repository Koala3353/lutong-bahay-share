import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { POLL_OPTIONS } from '../seed.js'

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)

  useEffect(() => {
    if (reduced()) {
      setShown(value)
      from.current = value
      return undefined
    }
    const start = performance.now()
    const begin = from.current
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 600)
      const eased = 1 - (1 - p) ** 3
      const v = begin + (value - begin) * eased
      setShown(v)
      from.current = v
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])

  return (
    <span className="num">
      {prefix}
      {shown.toLocaleString('en-PH', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}

export function ImpactCounter({ impact, big = false }) {
  const items = [
    { label: 'Meals saved', value: impact.meals, tone: 'mint' },
    { label: 'Pesos saved', value: impact.pesos, prefix: '₱', tone: 'peach' },
    { label: 'Food waste avoided', value: impact.kg, suffix: ' kg', decimals: 1, tone: 'butter' },
  ]
  return (
    <div className={`impact ${big ? 'impact-big' : ''}`} aria-live="polite">
      {items.map((i) => (
        <div key={i.label} className={`stat tone-${i.tone}`}>
          <div className="stat-value">
            <AnimatedNumber value={i.value} prefix={i.prefix} suffix={i.suffix} decimals={i.decimals} />
          </div>
          <div className="stat-label">{i.label}</div>
        </div>
      ))}
    </div>
  )
}

export function PollResults({ counts, total, mine }) {
  return (
    <ul className="poll-results">
      {POLL_OPTIONS.map((o) => {
        const n = counts[o.id] || 0
        const pct = total ? Math.round((n / total) * 100) : 0
        return (
          <li key={o.id} className={mine === o.id ? 'mine' : ''}>
            <div className="poll-row">
              <span>{o.label}</span>
              <span className="muted num">{n} {n === 1 ? 'vote' : 'votes'}</span>
            </div>
            <div className="bar" role="presentation">
              <div className="bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function QrCode({ text, size = 240 }) {
  const [src, setSrc] = useState('')
  useEffect(() => {
    QRCode.toDataURL(text, { width: size * 2, margin: 1, color: { dark: '#2B3A34', light: '#FFFFFF' } })
      .then(setSrc)
      .catch(() => setSrc(''))
  }, [text, size])
  return src ? (
    <img className="qr" src={src} width={size} height={size} alt={`QR code that opens ${text}`} />
  ) : (
    <div className="qr qr-empty" style={{ width: size, height: size }} />
  )
}
