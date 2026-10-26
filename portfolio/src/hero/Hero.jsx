import { lazy, Suspense, useState } from 'react'
import Simulator from '../sim/Simulator.jsx'
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

function FlatPhone() {
  return (
    <div className="flat-phone">
      <Simulator />
    </div>
  )
}

export default function Hero() {
  const [ready, setReady] = useState(!hasWebGL)
  const [skip, setSkip] = useState(false)

  return (
    <header className={`hero ${ready ? 'ready' : 'intro'}`}>
      <div className="hero-text">
        <span className="eyebrow">Yung-Fen (Tiffany) Liu · Digital Portfolio</span>
        <h1>
          Turn teaching ideas<br />
          <em>into products</em>
        </h1>
        <p className="lede">
          Welcome to my digital portfolio — tools for English teachers and learners,
          plus apps for the things I love. Web and iOS apps designed, built, and
          deployed through AI-agent-driven development with Claude Code.
        </p>
        <div className="hero-cta">
          <span className="hero-hint">👉 Tap the phone to try my apps</span>
          <a href="#projects" className="hero-link">See all projects ↓</a>
        </div>
      </div>

      <div className="hero-phone">
        {hasWebGL ? (
          <Suspense fallback={<div className="phone-stage-placeholder" />}>
            <PhoneScene onIntroDone={() => setReady(true)} skip={skip}>
              <Simulator />
            </PhoneScene>
          </Suspense>
        ) : (
          <FlatPhone />
        )}
        {!ready && (
          <button type="button" className="skip-intro" onClick={() => setSkip(true)}>Skip intro ›</button>
        )}
      </div>
    </header>
  )
}
