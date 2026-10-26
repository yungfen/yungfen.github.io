import { lazy, Suspense, useRef, useState } from 'react'
import Simulator from '../sim/Simulator.jsx'
import IdeaBubbles from './IdeaBubbles.jsx'
import AppGuide from './AppGuide.jsx'
import './Hero.css'

const PhoneScene = lazy(() => import('./PhoneScene.jsx'))

const hasWebGL = (() => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
})()

function FlatPhone({ request, onViewChange }) {
  return (
    <div className="flat-phone">
      <Simulator request={request} onViewChange={onViewChange} />
    </div>
  )
}

export default function Hero() {
  const [ready, setReady] = useState(!hasWebGL)
  const [skip, setSkip] = useState(false)
  const [request, setRequest] = useState(null)
  const [view, setView] = useState('lock')
  const phoneRef = useRef(null)
  // layout options for the guide card, previewed with ?guide=a|b|c
  const layout = new URLSearchParams(window.location.search).get('guide') || 'a'

  const openApp = id => {
    setSkip(true)
    setRequest(r => ({ id, n: (r?.n ?? 0) + 1 }))
    const box = phoneRef.current?.getBoundingClientRect()
    if (box && (box.top < 0 || box.bottom > window.innerHeight + 120)) {
      phoneRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <header className={`hero layout-${layout} ${ready ? 'ready' : 'intro'}`}>
      <div className="hero-text">
        <span className="eyebrow">Yung-Fen (Tiffany) Liu · Digital Portfolio</span>
        <h1>
          Turn ideas<br />
          <em>into products</em>
        </h1>
        <p className="lede">
          Welcome to my digital portfolio — tools for English teachers and learners,
          plus apps for the things I love. Web and iOS apps designed, built, and
          deployed through AI-agent-driven development with Claude Code.
        </p>
        <p className="hero-hint">💭 Every app started as a question. Tap one to see what it became.</p>
        {layout === 'c' && ready && <AppGuide view={view} layout={layout} />}
        <IdeaBubbles onPick={openApp} />
        <a href="#projects" className="hero-link">See all projects ↓</a>
      </div>

      <div className="hero-phone" ref={phoneRef}>
        {hasWebGL ? (
          <Suspense fallback={<div className="phone-stage-placeholder" />}>
            <PhoneScene onIntroDone={() => setReady(true)} skip={skip}>
              <Simulator request={request} onViewChange={setView} />
            </PhoneScene>
          </Suspense>
        ) : (
          <FlatPhone request={request} onViewChange={setView} />
        )}
        {layout !== 'c' && ready && <AppGuide view={view} layout={layout} />}
        {!ready && (
          <button type="button" className="skip-intro" onClick={() => setSkip(true)}>Skip intro ›</button>
        )}
      </div>
    </header>
  )
}
