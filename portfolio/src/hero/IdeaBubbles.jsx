import { useState } from 'react'

const ideas = [
  { app: 'english-town', q: 'What if we could learn English in a virtual town?' },
  { app: 'tutoring', q: 'What if a quiz could be built from the textbook in minutes?' },
  { app: 'comments', q: 'What if report comments took seconds, not hours?' },
  { app: 'transport', q: 'What if kids learned vehicle words with pictures and sound?' },
  { app: 'book-collector', q: 'What if my bookshelf had an AI reading buddy?' },
  { app: 'clipway', q: 'What if saved posts became a trip plan?' },
  { app: 'make-time', q: 'What if my to-do list followed me everywhere?' },
  { app: 'bible', q: 'What if a daily verse came in two languages?' },
  { app: 'festivals', q: 'What if festivals could teach English culture?' }
]

export default function IdeaBubbles({ onPick }) {
  const [lit, setLit] = useState([])
  const [popping, setPopping] = useState(null)

  const pick = idea => {
    setPopping(idea.app)
    setLit(l => (l.includes(idea.app) ? l : [...l, idea.app]))
    setTimeout(() => setPopping(p => (p === idea.app ? null : p)), 900)
    onPick(idea.app)
  }

  return (
    <div className="ideas" role="list" aria-label="Ideas behind my apps">
      {ideas.map((idea, i) => {
        const on = lit.includes(idea.app)
        return (
          <button
            key={idea.app}
            type="button"
            role="listitem"
            className={`idea${on ? ' lit' : ''}${popping === idea.app ? ' pop' : ''}`}
            style={{ '--i': i }}
            onClick={() => pick(idea)}
          >
            <span className="idea-icon" aria-hidden="true">{on ? '💡' : '💭'}</span>
            <span>{idea.q}</span>
            {popping === idea.app && <span className="idea-burst" aria-hidden="true">💡</span>}
          </button>
        )
      })}
    </div>
  )
}
