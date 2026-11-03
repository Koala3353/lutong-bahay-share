import { useEffect, useState } from 'react'
import Mascot from './components/Mascot.jsx'
import { RoomProvider, useRoom } from './store.jsx'
import { Home, Poll, Shop, Buy, Screen } from './pages.jsx'

const parse = () => {
  const path = location.hash.replace(/^#/, '') || '/'
  const m = path.match(/^\/r\/([A-Za-z0-9]+)(?:\/(poll|shop|buy|screen))?/)
  if (m) return { room: m[1].toUpperCase(), page: m[2] || 'poll' }
  return { room: null, page: 'home' }
}

const go = (path) => { location.hash = path }

function Header({ room, page }) {
  const peers = useRoom()?.peers ?? 0
  const tabs = [['poll', 'Poll'], ['shop', 'Shop'], ['buy', 'Buy'], ['screen', 'Big screen']]
  return (
    <header className="top">
      <div className="wrap top-in">
        <a className="brand" href="#/"><Mascot size={40} title="" /> Lutong Bahay Share</a>
        {room && (
          <>
            <span className="room-chip"><span className={`dot ${peers > 0 ? 'live' : ''}`} />Room {room}</span>
            <nav className="nav" aria-label="Room">
              {tabs.map(([id, label]) => (
                <a key={id} href={`#/r/${room}/${id}`} aria-current={page === id ? 'page' : undefined}>{label}</a>
              ))}
            </nav>
          </>
        )}
      </div>
    </header>
  )
}

function Router({ route }) {
  const { page } = route
  if (page === 'poll') return <Poll go={go} />
  if (page === 'shop') return <Shop />
  if (page === 'buy') return <Buy />
  if (page === 'screen') return <Screen />
  return null
}

export default function App() {
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const on = () => { setRoute(parse()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  if (!route.room) {
    return (
      <>
        <Header room={null} page="home" />
        <main><Home go={go} /></main>
      </>
    )
  }
  return (
    <RoomProvider room={route.room}>
      <Header room={route.room} page={route.page} />
      <main><Router route={route} /></main>
    </RoomProvider>
  )
}
