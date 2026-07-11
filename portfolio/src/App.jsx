import { useEffect, useRef, useState } from 'react'
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

const earlierProjects = [
  {
    title: 'Time Management iOS App',
    year: '2024',
    image: '/screenshots/legacy/ios-app.png',
    description: 'The original iOS prototype that grew into Make Time.',
    tech: ['Swift', 'UI Design', 'Project Management']
  },
  {
    title: 'English Learning Website — Western Festivals',
    year: '2023',
    url: 'https://learn-english-western-festival.netlify.app/',
    image: '/screenshots/legacy/western-festivals.png',
    description: 'Learn English through Western festival culture.',
    tech: ['HTML5', 'JavaScript', 'Bootstrap', 'UI Design']
  },
  {
    title: 'English Learning App',
    year: '2024',
    image: '/screenshots/legacy/english-learning-app.png',
    description: 'Mobile English learning app built with MIT App Inventor.',
    tech: ['MIT App Inventor', 'UI Design']
  },
  {
    title: 'Guess the Number',
    year: '2023',
    image: '/screenshots/legacy/guess-number.png',
    description: 'A classic number guessing game built in Java.',
    tech: ['Java', 'UI Design', 'UI Integration']
  }
]

const SPARKLE_COLORS = ['#ebbcba', '#c4a7e7', '#9ccfd8', '#f6c177']

const confirmLeave = e => {
  if (!window.confirm('You are leaving this site. Continue?')) {
    e.preventDefault()
  }
}

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
      onClick={confirmLeave}
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

function EarlierCard({ project }) {
  const inner = (
    <>
      <div className="card-media">
        <img src={project.image} alt={`${project.title} screenshot`} loading="lazy" />
      </div>
      <div className="card-body">
        <div className="card-top">
          <span className="card-index">{project.year}</span>
          {project.url && <span className="card-arrow">↗</span>}
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tech-row">
          {project.tech.map(t => <span key={t} className="tech">{t}</span>)}
        </div>
      </div>
    </>
  )
  return project.url ? (
    <a href={project.url} target="_blank" rel="noopener noreferrer" onClick={confirmLeave} className="card earlier accent-rose">
      {inner}
    </a>
  ) : (
    <div className="card earlier static">{inner}</div>
  )
}

function Contact() {
  const [sent, setSent] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    const data = new FormData(e.target)
    const subject = encodeURIComponent(`Portfolio message from ${data.get('name')}`)
    const body = encodeURIComponent(`${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`)
    window.location.href = `mailto:tiff2021any@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <section id="contact" className="section">
      <h2 className="section-title">Contact Me</h2>
      <p className="section-lede">If you have any questions or would like to get in touch, feel free to reach out!</p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5" required />
        </div>
        <button type="submit" className="send-btn">Send</button>
        {sent && <p className="sent-note">Your email client should open — thanks for reaching out!</p>}
      </form>
    </section>
  )
}

function App() {
  return (
    <div className="app">
      <MagicCursor />
      <div className="glow glow-1" />
      <div className="glow glow-2" />
      <div className="cursor-glow" />

      <nav className="navbar">
        <span className="nav-name">Yung-Fen Liu</span>
        <div className="nav-links">
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <header>
        <span className="eyebrow">Tiffany · Portfolio</span>
        <h1>
          Apps shipped with<br />
          <em>agentic coding</em>
        </h1>
        <p className="lede">
          Welcome to my portfolio — explore my projects and skills. Web apps, an
          iOS app, and a Chrome extension, designed, built, and deployed through
          AI-agent-driven development with Claude Code.
        </p>
      </header>

      <main>
        <section id="projects" className="section">
          <h2 className="section-title">Latest Projects</h2>
          <div className="grid">
            {projects.map(project => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>

          <h2 className="section-title earlier-title">Earlier Projects</h2>
          <div className="grid">
            {earlierProjects.map(project => (
              <EarlierCard key={project.title} project={project} />
            ))}
          </div>
        </section>

        <section id="about" className="section">
          <h2 className="section-title">About Me</h2>
          <p className="section-lede">
            I am a software developer with a passion for creating innovative solutions.
          </p>
          <div className="about-grid">
            <div className="about-block">
              <h3>Skills</h3>
              <p>HTML, JavaScript, TypeScript</p>
            </div>
            <div className="about-block">
              <h3>Learning</h3>
              <p>Swift, Python</p>
            </div>
            <div className="about-block">
              <h3>Interests</h3>
              <p>
                Learning languages (Japanese, Korean, German, Spanish, and French),
                Traveling, Photography, Sports (Badminton)
              </p>
            </div>
          </div>
        </section>

        <Contact />
      </main>

      <footer>
        <span>© 2026 Yung-Fen Liu</span>
        <span className="dot">·</span>
        <span>Built with Claude Code</span>
        <span className="dot">·</span>
        <a href="https://github.com/yungfen" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
      </footer>
    </div>
  )
}

export default App
