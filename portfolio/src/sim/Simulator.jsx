import { useEffect, useState } from 'react'
import { apps, appById, dock } from './apps.js'
import { screens } from './registry.js'
import StatusBar from './StatusBar.jsx'
import { hhmm } from './time.js'
import './Simulator.css'

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])
  return now
}

function LockScreen({ now, onUnlock }) {
  const date = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  return (
    <button type="button" className="ios-lock" onClick={onUnlock} aria-label="Unlock the phone">
      <StatusBar now={now} />
      <div className="lock-date">{date}</div>
      <div className="lock-time">{hhmm(now)}</div>
      <div className="lock-note">
        <span className="lock-note-icon">👩🏻‍🏫</span>
        <span>
          <strong>Tiffany</strong>
          <span>Turn teaching ideas into products. Tap to try my apps!</span>
        </span>
      </div>
      <div className="lock-hint">Tap to unlock</div>
      <div className="ios-home-bar" />
    </button>
  )
}

function AppIcon({ app, onOpen, label = true }) {
  return (
    <button type="button" className="ios-app" onClick={e => onOpen(app.id, e)} aria-label={`Open ${app.name}`}>
      <span className="ios-icon" style={{ background: app.bg }}>{app.icon}</span>
      {label && <span className="ios-app-name">{app.name}</span>}
    </button>
  )
}

function HomeScreen({ now, onOpen }) {
  const grid = apps.filter(a => !dock.includes(a.id))
  return (
    <div className="ios-home">
      <StatusBar now={now} />
      <div className="home-widget">
        <span className="widget-eyebrow">Yung-Fen (Tiffany) Liu</span>
        <strong>Teaching ideas → products</strong>
        <span>Tap any app to try it.</span>
      </div>
      <div className="home-grid">
        {grid.map(app => <AppIcon key={app.id} app={app} onOpen={onOpen} />)}
      </div>
      <div className="home-dots"><span className="on" /><span /></div>
      <div className="home-dock">
        {dock.map(id => <AppIcon key={id} app={appById[id]} onOpen={onOpen} label={false} />)}
      </div>
      <div className="ios-home-bar" />
    </div>
  )
}

// Real screen recording for an app (set `video` in apps.js); plays muted in a loop.
function ScreenVideo({ app }) {
  return (
    <div className="scr scr-video">
      <video src={app.video} poster={app.poster} autoPlay muted loop playsInline aria-label={`${app.name} screen recording`} />
    </div>
  )
}

export default function Simulator({ request }) {
  const now = useClock()
  const [view, setView] = useState('lock')
  const [origin, setOrigin] = useState('50% 50%')
  const [toast, setToast] = useState(null)
  const [mode, setMode] = useState('video')

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(id)
  }, [toast])

  const open = (id, e) => {
    const host = e.currentTarget.closest('.ios-device')
    if (host) {
      const r = host.getBoundingClientRect()
      const b = e.currentTarget.getBoundingClientRect()
      setOrigin(`${((b.left + b.width / 2 - r.left) / r.width) * 100}% ${((b.top + b.height / 2 - r.top) / r.height) * 100}%`)
    }
    setMode('video')
    setView(id)
  }
  const goHome = () => setView('home')

  // an idea bubble outside the phone asks for an app
  useEffect(() => {
    if (!request) return
    setOrigin('50% 50%')
    setMode('video')
    setView(request.id)
  }, [request])

  const app = appById[view]
  const Screen = app && screens[app.id]

  return (
    <div className="ios-device" onKeyDown={e => e.key === 'Escape' && view !== 'lock' && goHome()}>
      {view === 'lock' && <LockScreen now={now} onUnlock={goHome} />}
      {view !== 'lock' && <HomeScreen now={now} onOpen={open} />}
      {app && (
        <div className="ios-app-view" style={{ transformOrigin: origin }} key={app.id}>
          {app.video && mode === 'video'
            ? <ScreenVideo app={app} />
            : <Screen app={app} now={now} toast={setToast} open={open} />}
          {app.video && (
            <button type="button" className="mode-pill" onClick={() => setMode(m => (m === 'video' ? 'demo' : 'video'))}>
              {mode === 'video' ? 'Try it yourself ›' : '▶ Watch recording'}
            </button>
          )}
          <button type="button" className="ios-home-bar dark hit" onClick={goHome} aria-label="Go to home screen" />
        </div>
      )}
      {toast && <div className="ios-toast" role="status">{toast}</div>}
    </div>
  )
}
