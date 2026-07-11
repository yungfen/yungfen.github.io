import './App.css'

const projects = [
  {
    title: 'Daily Bible Quote Widget',
    url: 'https://daily-bible-quote-widget.netlify.app/',
    description: 'Delivers daily biblical passages with bilingual support (English KJV & Chinese). Features multiple design styles, daily rotation, device-specific wallpapers, and sharing capabilities across platforms.',
    tech: ['React', 'API Integration'],
    tags: ['Spiritual', 'Multilingual']
  },
  {
    title: 'English Town: VR English Practice',
    url: 'https://english-town-tiffany.netlify.app/',
    description: 'Immersive language learning app combining VR with conversational practice. Navigate a virtual neighborhood, practice everyday English with AI-powered characters, with text or voice interaction using ElevenLabs realistic voices.',
    tech: ['React', 'AI/LLM', 'WebGL', 'ElevenLabs API'],
    tags: ['Language Learning', 'AI', 'VR']
  },
  {
    title: 'Teacher Evaluation Comment Generator',
    url: 'https://teacher-evaulation.netlify.app/',
    description: 'Helps educators create positive, Montessori-aligned feedback for students. Supports CSV/Excel import, observation logging, batch comment generation, data persistence, and export functionality.',
    tech: ['React', 'CSV Processing'],
    tags: ['Education', 'Productivity']
  },
  {
    title: 'Make Time',
    url: 'https://make-time.netlify.app/',
    description: 'Task and time management application. Available as web app, iOS app (SwiftUI + SwiftData), and Chrome Extension for seamless cross-platform productivity.',
    tech: ['React', 'Swift', 'Chrome Extension'],
    tags: ['Productivity', 'Cross-Platform']
  }
]

function ProjectCard({ project }) {
  return (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="tech-stack">
        {project.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
      </div>
      <div className="tags">
        {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
      </div>
      <div className="visit-link">Visit →</div>
    </a>
  )
}

function App() {
  return (
    <div className="app">
      <header>
        <h1>Tiffany's Portfolio</h1>
        <p className="subtitle">Built with Agentic Coding</p>
      </header>

      <section className="intro">
        <h2>Projects</h2>
        <p>A collection of web applications, iOS apps, and browser extensions built using Claude Code (Agentic Coding).</p>
      </section>

      <section className="projects-grid">
        {projects.map(project => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </section>

      <footer>
        <p>Built with ✨ agentic coding • All projects deployed and actively maintained</p>
      </footer>
    </div>
  )
}

export default App
