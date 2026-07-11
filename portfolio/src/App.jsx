import { useEffect, useRef } from 'react'
import './App.css'

const projects = [
  {
    title: 'English Town',
    subtitle: 'VR English Practice',
    url: 'https://english-town-tiffany.netlify.app/',
    image: '/screenshots/english-town.png',
    description: 'Immersive language learning in a 3D neighborhood. Walk around, talk to AI-powered residents by text or voice, and build vocabulary through real interactions — powered by Claude and ElevenLabs voices.',
    tech: ['React', 'Three.js', 'Claude API', 'ElevenLabs'],
    accent: 'iris',
    featured: true
  },
  {
    title: 'Make Time',
    subtitle: 'Cross-platform time management',
    url: 'https://make-time.netlify.app/',
    image: '/screenshots/make-time.png',
    description: 'Task and time management that follows you everywhere — web app, native iOS app built with SwiftUI + SwiftData, and a Chrome Extension.',
    tech: ['React', 'SwiftUI', 'SwiftData', 'Chrome Extension'],
    accent: 'foam',
    platforms: ['Web', 'iOS', 'Chrome']
  },
  {
    title: 'Daily Bible Quote',
    subtitle: 'Bilingual scripture widget',
    url: 'https://daily-bible-quote-widget.netlify.app/',
    image: '/screenshots/bible.png',
    description: 'Daily scripture in English (KJV) and Chinese, with multiple design themes, device-sized wallpapers, and shareable story / post formats.',
    tech: ['React', 'Canvas'],
    accent: 'gold'
  },
  {
    title: 'Comment Generator',
    subtitle: 'Montessori teacher feedback',
    url: 'https://teacher-evaulation.netlify.app/',
    image: '/screenshots/teacher.png',
    description: 'Turns raw classroom observations into positive, Montessori-aligned student feedback. CSV/Excel import, batch generation, and export built for real classroom scale.',
    tech: ['React', 'Claude API'],
    accent: 'rose'
  }
]

const SPARKLE_COLORS = ['#ebbcba', '#c4a7e7', '#9ccfd8', '#f6c177']

function MagicCursor() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let particles = []
    let raf

    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio
      canvas.height = window.innerHeight * devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = e => {
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8 - 0.3,
          size: Math.random() * 2.5 + 1,
          life: 1,
          color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
          spin: Math.random() * Math.PI * 2
        })
      }
      if (particles.length > 120) particles = particles.slice(-120)
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`)
      document.documentElement.style.setProperty('--my', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', spawn)

    const drawStar = (p, r) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.spin)
      ctx.beginPath()
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(0, -r)
        ctx.rotate(Math.PI / 4)
        ctx.lineTo(0, -r * 0.4)
        ctx.rotate(Math.PI / 4)
      }
      ctx.closePath()
      ctx.fillStyle = p.color
      ctx.fill()
      ctx.restore()
    }

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      particles = particles.filter(p => p.life > 0)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.02
        p.spin += 0.05
        ctx.globalAlpha = Math.max(p.life, 0)
        drawStar(p, p.size * p.life)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', spawn)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="magic-canvas" aria-hidden="true" />
}

function ProjectCard({ project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`card accent-${project.accent}${project.featured ? ' featured' : ''}`}
    >
      <div className="card-media">
        <img src={project.image} alt={`${project.title} screenshot`} loading="lazy" />
      </div>
      <div className="card-body">
        <div className="card-top">
          <span className="card-index">{project.subtitle}</span>
          <span className="card-arrow">↗</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        {project.platforms && (
          <div className="platforms">
            {project.platforms.map(p => <span key={p}>{p}</span>)}
          </div>
        )}
        <div className="tech-row">
          {project.tech.map(t => <span key={t} className="tech">{t}</span>)}
        </div>
      </div>
    </a>
  )
}

function App() {
  return (
    <div className="app">
      <MagicCursor />
      <div className="glow glow-1" />
      <div className="glow glow-2" />
      <div className="cursor-glow" />

      <header>
        <span className="eyebrow">Tiffany · Portfolio</span>
        <h1>
          Apps shipped with<br />
          <em>agentic coding</em>
        </h1>
        <p className="lede">
          Web apps, an iOS app, and a Chrome extension — designed, built, and
          deployed through AI-agent-driven development with Claude Code.
        </p>
      </header>

      <main className="grid">
        {projects.map(project => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </main>

      <footer>
        <span>© 2026 Tiffany</span>
        <span className="dot">·</span>
        <span>Built with Claude Code</span>
        <span className="dot">·</span>
        <a href="https://github.com/yungfen" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
      </footer>
    </div>
  )
}

export default App
