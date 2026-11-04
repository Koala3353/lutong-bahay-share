import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools/pure'

// Every device posts small messages to a few public Nostr relays (plain WebSockets, so it works on any
// network that allows normal web traffic) and listens for the same room's messages. Kind 20078 is in
// the ephemeral range: relays forward it to live subscribers and never store it.
const RELAYS = ['wss://nos.lol', 'wss://relay.primal.net', 'wss://offchain.pub', 'wss://relay.damus.io']
const KIND = 20078
const SYNC_MS = 12000
const PRESENCE_TTL = 32000
const CHUNK = 5000
const TYPES = ['bag', 'vote', 'grab', 'pickup', 'reset']

const validEvent = (e) => e && typeof e.id === 'string' && typeof e.ts === 'number' && TYPES.includes(e.type)
const rid = () => Math.random().toString(36).slice(2, 10)

// Devices never trust a single message arriving: every ~12 seconds each one broadcasts the ids of the
// events it has, and any peer that holds events the sender lacks sends them back, so a phone that slept,
// joined late or dropped a message heals itself on the next round.
export function openRoom(roomId, { getEvents, onEvents, onPeers }) {
  const sk = generateSecretKey()
  const self = getPublicKey(sk)
  const topic = `lbs1-${roomId}`
  const subId = `lbs-${rid()}`
  const sockets = new Map()
  const seenFrames = new Set()
  const seenMsgs = new Set()
  const peersSeen = new Map()
  const recent = new Set()
  let channel = null
  let tickTimer = null
  let idsTimer = null
  let helloTimer = null
  let lastCount = -1
  let closed = false

  const sendBc = (msg) => {
    try { channel?.postMessage(msg) } catch { /* channel closed */ }
  }
  const sendRelays = (msg) => {
    const ev = finalizeEvent(
      { kind: KIND, created_at: Math.floor(Date.now() / 1000), tags: [['t', topic]], content: JSON.stringify(msg) },
      sk,
    )
    const frame = JSON.stringify(['EVENT', ev])
    for (const { ws } of sockets.values()) if (ws?.readyState === 1) ws.send(frame)
  }
  const post = (msg) => {
    const full = { ...msg, from: self, m: rid() }
    seenMsgs.add(full.m)
    sendBc(full)
    sendRelays(full)
  }

  const sendEvents = (evs) => {
    let batch = []
    let size = 0
    for (const e of evs) {
      const n = JSON.stringify(e).length
      if (size + n > CHUNK && batch.length) {
        post({ t: 'evs', evs: batch })
        batch = []
        size = 0
      }
      batch.push(e)
      size += n
    }
    if (batch.length) post({ t: 'evs', evs: batch })
  }

  const learn = (evs) => {
    const good = evs.filter(validEvent)
    if (!good.length) return
    for (const e of good) recent.add(e.id)
    setTimeout(() => good.forEach((e) => recent.delete(e.id)), 8000)
    onEvents(good)
  }

  const countPeers = () => {
    const now = Date.now()
    let n = 0
    for (const [id, t] of peersSeen) {
      if (now - t > PRESENCE_TTL) peersSeen.delete(id)
      else n += 1
    }
    if (n !== lastCount) {
      lastCount = n
      onPeers(n)
    }
  }

  const scheduleIds = () => {
    if (idsTimer || closed) return
    idsTimer = setTimeout(() => {
      idsTimer = null
      post({ t: 'ids', ids: getEvents().map((e) => e.id) })
    }, 200 + Math.random() * 1000)
  }

  const receive = (msg) => {
    if (!msg || msg.from === self || !msg.m || seenMsgs.has(msg.m)) return
    seenMsgs.add(msg.m)
    if (seenMsgs.size > 2000) seenMsgs.clear()
    peersSeen.set(msg.from, Date.now())
    countPeers()

    if (msg.t === 'ev') learn([msg.ev])
    else if (msg.t === 'evs' && Array.isArray(msg.evs)) learn(msg.evs)
    else if (msg.t === 'hello') scheduleIds()
    else if (msg.t === 'ids' && Array.isArray(msg.ids)) {
      const theirs = new Set(msg.ids)
      const mine = getEvents()
      if (msg.ids.some((id) => !mine.some((e) => e.id === id))) scheduleIds()
      if (mine.some((e) => !theirs.has(e.id))) {
        setTimeout(() => {
          const missing = getEvents().filter((e) => !theirs.has(e.id) && !recent.has(e.id))
          if (missing.length) sendEvents(missing)
        }, Math.random() * 1200)
      }
    }
  }

  const hello = () => {
    if (helloTimer || closed) return
    helloTimer = setTimeout(() => {
      helloTimer = null
      post({ t: 'hello' })
    }, 300)
  }

  const connect = (url) => {
    if (closed) return
    const entry = sockets.get(url) || { tries: 0, ws: null }
    sockets.set(url, entry)
    let ws
    try {
      ws = new WebSocket(url)
    } catch {
      return
    }
    entry.ws = ws
    ws.onopen = () => {
      entry.tries = 0
      ws.send(JSON.stringify(['REQ', subId, { kinds: [KIND], '#t': [topic] }]))
      hello()
    }
    ws.onmessage = (m) => {
      let d
      try { d = JSON.parse(m.data) } catch { return }
      if (d[0] !== 'EVENT' || !d[2] || seenFrames.has(d[2].id)) return
      seenFrames.add(d[2].id)
      if (seenFrames.size > 4000) seenFrames.clear()
      try { receive(JSON.parse(d[2].content)) } catch { /* not ours */ }
    }
    ws.onerror = () => { try { ws.close() } catch { /* already closed */ } }
    ws.onclose = () => {
      if (closed || entry.ws !== ws) return
      entry.tries = Math.min(entry.tries + 1, 5)
      setTimeout(() => connect(url), Math.min(30000, 1000 * 2 ** entry.tries))
    }
  }

  const wake = () => {
    if (document.visibilityState !== 'visible') return
    for (const [url, entry] of sockets) {
      if (!entry.ws || entry.ws.readyState > 1) connect(url)
    }
    hello()
  }

  try {
    channel = new BroadcastChannel(`lbs-${roomId}`)
    channel.onmessage = (e) => receive(e.data)
  } catch { /* BroadcastChannel unavailable */ }

  RELAYS.forEach(connect)
  document.addEventListener('visibilitychange', wake)
  window.addEventListener('online', wake)

  const tick = () => {
    if (closed) return
    countPeers()
    post({ t: 'ids', ids: getEvents().map((e) => e.id) })
    tickTimer = setTimeout(tick, SYNC_MS + Math.random() * 3000)
  }
  tickTimer = setTimeout(tick, SYNC_MS)
  hello()

  return {
    publish: (ev) => post({ t: 'ev', ev }),
    close: () => {
      closed = true
      clearTimeout(tickTimer)
      clearTimeout(idsTimer)
      clearTimeout(helloTimer)
      document.removeEventListener('visibilitychange', wake)
      window.removeEventListener('online', wake)
      try { channel?.close() } catch { /* already closed */ }
      for (const { ws } of sockets.values()) {
        try { ws?.close() } catch { /* already closed */ }
      }
    },
  }
}
