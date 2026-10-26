import { useEffect, useRef, useState } from 'react'
import './App.css'
import { confirmLeave } from './confirmLeave.js'
import Hero from './hero/Hero.jsx'

const projects = [
  {
    title: 'English Town',
    subtitle: 'VR English Practice',
    url: 'https://english-town.yungfen.workers.dev/',
    image: '/screenshots/english-town.png',
    description: ['Walk around a 3D English-speaking town', 'Talk to AI residents by text or voice', 'Build vocabulary through real conversations'],
    tech: ['React', 'Three.js', 'Claude API', 'ElevenLabs'],
    accent: 'iris',
    featured: true
  },
  {
    title: 'Make Time',
    subtitle: 'Cross-platform time management',
    url: 'https://make-time.netlify.app/',
    image: '/screenshots/make-time.png',
    description: ['Tasks and time management in one place', 'Web app, native iOS app and Chrome extension', 'Your list follows you on every device'],
    tech: ['React', 'SwiftUI', 'SwiftData', 'Chrome Extension'],
    accent: 'foam',
    platforms: ['Web', 'iOS', 'Chrome']
  },
  {
    title: 'Daily Bible Quote',
    subtitle: 'Bilingual scripture widget',
    url: 'https://daily-bible-quote-widget.netlify.app/',
    image: '/screenshots/bible.png',
    description: ['A daily verse in English (KJV) and Chinese', 'Several design themes', 'Save as wallpaper or share as a story / post'],
    tech: ['React', 'Canvas'],
    accent: 'gold'
  }
]

const sideProjects = [
  {
    title: 'Clipway',
    subtitle: 'Saved posts → trip itinerary',
    icon: '🧭',
    image: '/screenshots/clipway.png',
    description: ['Save places from Instagram, YouTube and screenshots', 'Plan each day of a trip on a map', 'Share trips as cards or a printable booklet'],
    features: [
      'Collect places from Instagram posts, YouTube videos and screenshots: the app reads the caption, description or image text and finds each shop on Google Maps',
      'Share a post straight into Clipway from Instagram, YouTube or Safari',
      'Collection organised into Finder-style folders, created automatically by city',
      'Plan trips day by day on a map, with numbered routes and a daily start and end at your hotel',
      'Opening hours from Google, with a warning when a place is closed on the day you planned it',
      'Share a folder or a trip as an image card (postcard, poster, boarding pass and more)',
      'Export a printable A5 trip booklet (PDF) with a cover photo, daily maps and a checklist',
      'Hand places off to other apps, open directions in Google Maps, back up and restore',
      'Traditional Chinese and English',
      'In progress: one-tap auto-planning, nested folders (city > district)'
    ],
    tech: ['SwiftUI', 'SwiftData', 'Google Maps SDK', 'Google Places API'],
    accent: 'foam',
    platforms: ['iOS'],
    status: 'TestFlight beta'
  },
  {
    title: 'Book Collector',
    subtitle: 'Reading log with an AI librarian',
    icon: '📚',
    gallery: [
      '/screenshots/book-collector.png',
      '/screenshots/book-collector-2.png',
      '/screenshots/book-collector-3.png'
    ],
    description: ['Shelve books by where they really sit', 'Scan barcodes to add books fast', 'Inzai the owl, an AI reading buddy'],
    features: [
      'Bookshelf organized by where each book sits; wishlist, favorites, paper / e-book, lending',
      'Add books by scanning barcodes (continuous), snapping the cover, or typing a title / ISBN',
      'Shelf inventory: scan a shelf to see what\'s there and what\'s missing',
      'Highlights & notes, including page photos with text recognition and automatic page numbers',
      'Import from Goodreads / StoryGraph, Readwise and Notion; iCloud Drive backup & restore',
      'Reading log, reading timer, yearly review & achievements, daily quote, letters to your future self, and Poke Box to pick a forgotten book',
      'Drafts with a rich-text editor; export to PDF, Markdown, image, or formatted text with references',
      'New Books: monthly new releases from Taiwan\'s National Central Library, plus recent award winners',
      'Inzai AI reading buddy: on-device Apple Intelligence for your own notes, Claude in the cloud for book knowledge, sending only what you allow (cloud answers: fix in progress)',
      'Home Screen & Lock Screen widgets with quick note, plus a Lock Screen / Dynamic Island reading timer (new, in TestFlight testing)',
      'Traditional Chinese and English interface'
    ],
    tech: ['SwiftUI', 'Apple Intelligence', 'Cloudflare Workers', 'D1', 'Claude API'],
    accent: 'gold',
    platforms: ['iOS'],
    status: 'TestFlight beta'
  },
  {
    title: 'Tutoring Toolkit',
    subtitle: 'Test generator + class records',
    icon: '📝',
    description: ['Quiz questions from Taiwan junior-high textbooks (Hanlin, Grade 8)', 'Edit in the page, print student and teacher versions', 'Class records track mistakes for the next quiz'],
    tech: ['JavaScript', 'HTML/CSS', 'Python'],
    accent: 'iris',
    platforms: ['Web']
  }
]

const allProjects = [...projects, ...sideProjects]
const pick = titles => titles.map(t => allProjects.find(p => p.title === t))

const learnerProjects = pick(['English Town', 'Tutoring Toolkit'])
const hobbyProjects = pick(['Book Collector', 'Clipway'])
const moreProjects = pick(['Make Time', 'Daily Bible Quote'])

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

const SPARKLE_COLORS = ['#e8a09c', '#a98ad6', '#5fb3c1', '#f0b04f']


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

function Points({ items }) {
  return (
    <ul className="card-points">
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  )
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
        <Points items={project.description} />
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

function Gallery({ title, images }) {
  const [index, setIndex] = useState(0)
  const go = step => setIndex(i => (i + step + images.length) % images.length)

  return (
    <div className="card-media gallery">
      <img src={images[index]} alt={`${title} screenshot ${index + 1} of ${images.length}`} loading="lazy" />
      <button type="button" className="gallery-btn prev" onClick={() => go(-1)} aria-label="Previous screenshot">‹</button>
      <button type="button" className="gallery-btn next" onClick={() => go(1)} aria-label="Next screenshot">›</button>
      <div className="gallery-dots">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className={i === index ? 'active' : ''}
            onClick={() => setIndex(i)}
            aria-label={`Show screenshot ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

function SideCard({ project }) {
  return (
    <div className={`card static side accent-${project.accent}`}>
      {project.gallery ? (
        <Gallery title={project.title} images={project.gallery} />
      ) : project.image ? (
        <div className="card-media">
          <img src={project.image} alt={`${project.title} screenshot`} loading="lazy" />
        </div>
      ) : (
        <div className="card-media side-media" aria-hidden="true">
          <span>{project.icon}</span>
        </div>
      )}
      <div className="card-body">
        <div className="card-top">
          <span className="card-index">{project.subtitle}</span>
          <span className="card-badge">{project.status ?? 'In progress'}</span>
        </div>
        <h3>{project.title}</h3>
        <Points items={project.description} />
        {project.features && (
          <details className="features">
            <summary>Features</summary>
            <ul>
              {project.features.map(f => <li key={f}>{f}</li>)}
            </ul>
          </details>
        )}
        <div className="platforms">
          {project.platforms.map(p => <span key={p}>{p}</span>)}
        </div>
        <div className="tech-row">
          {project.tech.map(t => <span key={t} className="tech">{t}</span>)}
        </div>
      </div>
    </div>
  )
}

function ProjectGrid({ items }) {
  return (
    <div className="grid">
      {items.map(project => project.url
        ? <ProjectCard key={project.title} project={project} />
        : <SideCard key={project.title} project={project} />
      )}
    </div>
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
        <a className="nav-name" href="#">
          <img className="nav-logo" src="/logo.svg" alt="" width="30" height="30" />
          Yung-Fen Liu
        </a>
        <div className="nav-links">
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <Hero />

      <main>
        <section id="projects" className="section">
          <h2 className="section-title">Featured Projects</h2>
          <ProjectGrid items={learnerProjects} />

          <h3 className="section-subtitle">Other hobbies: reading and traveling</h3>
          <ProjectGrid items={hobbyProjects} />

          <h3 className="section-subtitle">More Projects</h3>
          <ProjectGrid items={moreProjects} />

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
