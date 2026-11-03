import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { openRoom } from './sync.js'
import { SEED_BAGS } from './seed.js'

const RoomContext = createContext(null)
export const useRoom = () => useContext(RoomContext)

const KG_PER_MEAL = 0.4 // placeholder estimate, replace with a sourced figure

const uid = () => Math.random().toString(36).slice(2, 10)

export function getPeerId() {
  try {
    let id = sessionStorage.getItem('lbs-peer')
    if (!id) {
      id = uid()
      sessionStorage.setItem('lbs-peer', id)
    }
    return id
  } catch {
    return 'local'
  }
}

const storageKey = (room) => `lbs-events-${room}`

function loadEvents(room) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(room)) || '[]')
  } catch {
    return []
  }
}

// Turns the raw event log into what the screens show. Pure, so every device lands on the same result.
export function derive(events) {
  const bags = new Map()
  const votes = new Map()
  const grabs = new Map()
  const pickups = new Set()

  for (const ev of events) {
    if (ev.type === 'pickup') pickups.add(ev.grabId)
    if (ev.type === 'bag') bags.set(ev.id, ev)
    if (ev.type === 'vote') {
      const prev = votes.get(ev.peer)
      if (!prev || ev.ts > prev.ts) votes.set(ev.peer, ev)
    }
    if (ev.type === 'grab') {
      const list = grabs.get(ev.bagId) || []
      list.push(ev)
      grabs.set(ev.bagId, list)
    }
  }

  const bagList = [...bags.values()]
    .map((bag) => {
      // Earliest grab wins, ties go to the lower peer id, one grab per person.
      const seen = new Set()
      const winners = (grabs.get(bag.id) || [])
        .sort((a, b) => a.ts - b.ts || (a.peer < b.peer ? -1 : 1))
        .filter((g) => (seen.has(g.peer) ? false : seen.add(g.peer)))
        .slice(0, bag.qty)
        .map((g) => ({ ...g, pickedUp: pickups.has(g.id) }))
      return { ...bag, winners, left: bag.qty - winners.length }
    })
    .sort((a, b) => (b.ts || 0) - (a.ts || 0))

  const counts = {}
  for (const v of votes.values()) counts[v.choice] = (counts[v.choice] || 0) + 1

  let bagsRescued = 0
  let meals = 0
  let pesos = 0
  for (const b of bagList) {
    bagsRescued += b.winners.length
    meals += b.winners.length * b.meals
    pesos += b.winners.length * (b.orig - b.price)
  }

  return {
    bags: bagList,
    votes,
    counts,
    totalVotes: votes.size,
    impact: { bagsRescued, meals, pesos, kg: Math.round(meals * KG_PER_MEAL * 10) / 10 },
  }
}

export function RoomProvider({ room, children }) {
  const peerId = useMemo(getPeerId, [])
  const eventsRef = useRef(new Map())
  const [version, setVersion] = useState(0)
  const [peers, setPeers] = useState(0)
  const linkRef = useRef(null)

  const merge = useCallback((incoming) => {
    let changed = false
    for (const ev of incoming) {
      if (ev && ev.id && !eventsRef.current.has(ev.id)) {
        eventsRef.current.set(ev.id, ev)
        changed = true
      }
    }
    if (changed) {
      setVersion((v) => v + 1)
      try {
        const own = [...eventsRef.current.values()].filter((e) => !e.seed)
        localStorage.setItem(storageKey(room), JSON.stringify(own))
      } catch { /* storage full or blocked */ }
    }
  }, [room])

  useEffect(() => {
    eventsRef.current = new Map()
    for (const s of SEED_BAGS) eventsRef.current.set(s.id, s)
    for (const e of loadEvents(room)) eventsRef.current.set(e.id, e)
    setVersion((v) => v + 1)
    setPeers(0)

    linkRef.current = openRoom(room, {
      getEvents: () => [...eventsRef.current.values()].filter((e) => !e.seed),
      onEvents: merge,
      onPeers: setPeers,
    })
    return () => linkRef.current?.close()
  }, [room, merge])

  const publish = useCallback((partial) => {
    const ev = { id: uid() + uid(), ts: Date.now(), ...partial }
    merge([ev])
    linkRef.current?.publish(ev)
    return ev
  }, [merge])

  const state = useMemo(
    () => derive([...eventsRef.current.values()]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version],
  )

  const value = useMemo(
    () => ({ room, peerId, peers, publish, ...state }),
    [room, peerId, peers, publish, state],
  )

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
}
