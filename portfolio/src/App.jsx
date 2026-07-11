import './App.css'

const projects = [
  {
    title: 'English Town',
    subtitle: 'VR English Practice',
    url: 'https://english-town-tiffany.netlify.app/',
    description: 'Immersive language learning in a 3D neighborhood. Walk around, talk to AI-powered residents by text or voice, and build vocabulary through real interactions — powered by Claude and ElevenLabs voices.',
    tech: ['React', 'Three.js', 'Claude API', 'ElevenLabs'],
    accent: 'iris',
    featured: true
  },
  {
    title: 'Make Time',
    subtitle: 'Cross-platform time management',
    url: 'https://make-time.netlify.app/',
    description: 'Task and time management that follows you everywhere — web app, native iOS app built with SwiftUI + SwiftData, and a Chrome Extension.',
    tech: ['React', 'SwiftUI', 'SwiftData', 'Chrome Extension'],
    accent: 'foam',
    platforms: ['Web', 'iOS', 'Chrome']
  },
  {
    title: 'Daily Bible Quote',
    subtitle: 'Bilingual scripture widget',
    url: 'https://daily-bible-quote-widget.netlify.app/',
    description: 'Daily scripture in English (KJV) and Chinese, with multiple design themes, device-sized wallpapers, and shareable story / post formats.',
    tech: ['React', 'Canvas'],
    accent: 'gold'
  },
  {
    title: 'Comment Generator',
    subtitle: 'Montessori teacher feedback',
    url: 'https://teacher-evaulation.netlify.app/',
    description: 'Turns raw classroom observations into positive, Montessori-aligned student feedback. CSV/Excel import, batch generation, and export built for real classroom scale.',
    tech: ['React', 'Claude API'],
    accent: 'rose'
  }
]

function ProjectCard({ project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`card accent-${project.accent}${project.featured ? ' featured' : ''}`}
    >
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
    </a>
  )
}

function App() {
  return (
    <div className="app">
      <div className="glow glow-1" />
      <div className="glow glow-2" />

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
