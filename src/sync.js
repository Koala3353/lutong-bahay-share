import { joinRoom } from 'trystero'

const APP_ID = 'lutong-bahay-share-sts10'

// Joins a room over BroadcastChannel (same browser) and WebRTC via Trystero (other phones).
// Every message is a full event or a snapshot of events, so peers converge no matter the order.
export function openRoom(roomId, { getEvents, onEvents, onPeers }) {
  const peers = new Set()
  let channel = null
  let rtc = null
  let action = null

  const handle = (msg) => {
    if (!msg) return
    if (msg.t === 'ev' && msg.ev) onEvents([msg.ev])
    if (msg.t === 'snap' && Array.isArray(msg.evs)) onEvents(msg.evs)
    if (msg.t === 'hello') post({ t: 'snap', evs: getEvents() })
  }

  const post = (msg) => {
    try { channel?.postMessage(msg) } catch { /* channel closed */ }
    action?.send(msg).catch(() => { /* no peers yet */ })
  }

  try {
    channel = new BroadcastChannel(`lbs-${roomId}`)
    channel.onmessage = (e) => handle(e.data)
  } catch { /* BroadcastChannel unavailable */ }

  try {
    rtc = joinRoom({ appId: APP_ID }, roomId)
    action = rtc.makeAction('lbs')
    action.onMessage = (msg) => handle(msg)
    rtc.onPeerJoin = (id) => {
      peers.add(id)
      onPeers(peers.size)
      action.send({ t: 'snap', evs: getEvents() }, { target: id }).catch(() => { /* peer left */ })
    }
    rtc.onPeerLeave = (id) => {
      peers.delete(id)
      onPeers(peers.size)
    }
  } catch { /* offline or blocked: the app keeps working on this device */ }

  post({ t: 'hello' })

  return {
    publish: (ev) => post({ t: 'ev', ev }),
    close: () => {
      try { channel?.close() } catch { /* already closed */ }
      try { rtc?.leave() } catch { /* already left */ }
    },
  }
}
