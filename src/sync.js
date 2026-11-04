import { joinRoom } from 'trystero'

const APP_ID = 'lutong-bahay-share-sts10'
const SYNC_MS = 4000

// Joins a room over BroadcastChannel (same browser) and WebRTC via Trystero (other phones).
// Devices never trust a single message arriving: every few seconds each one broadcasts the ids of the
// events it has, and any peer that holds events the sender lacks sends them back. A device that was
// asleep, joined late or dropped a message heals itself on the next round.
export function openRoom(roomId, { getEvents, onEvents, onPeers }) {
  const peers = new Set()
  let channel = null
  let rtc = null
  let action = null
  let timer = null
  let closed = false

  const sendBc = (msg) => {
    try { channel?.postMessage(msg) } catch { /* channel closed */ }
  }
  const sendRtc = (msg, target) => {
    action?.send(msg, target ? { target } : undefined).catch(() => { /* peer left or none yet */ })
  }
  const broadcast = (msg) => {
    sendBc(msg)
    sendRtc(msg)
  }
  const idsMsg = () => ({ t: 'ids', ids: getEvents().map((e) => e.id) })

  const handle = (msg, reply) => {
    if (!msg) return
    if (msg.t === 'ev' && msg.ev) onEvents([msg.ev])
    else if (msg.t === 'evs' && Array.isArray(msg.evs)) onEvents(msg.evs)
    else if (msg.t === 'ids' && Array.isArray(msg.ids)) {
      const known = new Set(msg.ids)
      const missing = getEvents().filter((e) => !known.has(e.id))
      if (missing.length) reply({ t: 'evs', evs: missing })
    }
  }

  try {
    channel = new BroadcastChannel(`lbs-${roomId}`)
    channel.onmessage = (e) => handle(e.data, sendBc)
  } catch { /* BroadcastChannel unavailable */ }

  try {
    rtc = joinRoom({ appId: APP_ID }, roomId)
    action = rtc.makeAction('lbs')
    action.onMessage = (msg, ctx) => handle(msg, (m) => sendRtc(m, ctx?.peerId))
    rtc.onPeerJoin = (id) => {
      peers.add(id)
      onPeers(peers.size)
      sendRtc(idsMsg(), id)
    }
    rtc.onPeerLeave = (id) => {
      peers.delete(id)
      onPeers(peers.size)
    }
  } catch { /* offline or blocked: the app keeps working on this device */ }

  const tick = () => {
    if (closed) return
    broadcast(idsMsg())
    timer = setTimeout(tick, SYNC_MS + Math.random() * 1500)
  }
  const wake = () => {
    if (document.visibilityState === 'visible') broadcast(idsMsg())
  }
  document.addEventListener('visibilitychange', wake)
  window.addEventListener('online', wake)
  tick()

  return {
    publish: (ev) => broadcast({ t: 'ev', ev }),
    close: () => {
      closed = true
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', wake)
      window.removeEventListener('online', wake)
      try { channel?.close() } catch { /* already closed */ }
      try { rtc?.leave() } catch { /* already left */ }
    },
  }
}
