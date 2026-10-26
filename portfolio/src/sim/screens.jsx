import { useEffect, useRef, useState } from 'react'
import { apps } from './apps.js'
import { confirmLeave } from '../confirmLeave.js'
import StatusBar from './StatusBar.jsx'

function GetButton({ app, toast, compact }) {
  const [state, setState] = useState('idle')
  const timer = useRef()
  useEffect(() => () => clearTimeout(timer.current), [])

  if (app.kind === 'ios') {
    return (
      <button type="button" className="get-btn ghost" onClick={() => toast(`${app.name} is in TestFlight beta, coming to the App Store soon.`)}>
        {compact ? 'BETA' : 'TestFlight beta'}
      </button>
    )
  }
  if (app.kind === 'web') {
    return app.url ? (
      <a className="get-btn" href={app.url} target="_blank" rel="noopener noreferrer" onClick={confirmLeave}>
        {compact ? 'OPEN' : 'Open web app ↗'}
      </a>
    ) : (
      <button type="button" className="get-btn ghost" onClick={() => toast('Classroom tool: demo only.')}>
        {compact ? 'DEMO' : 'Classroom demo'}
      </button>
    )
  }
  if (app.kind !== 'appinventor') return null

  const start = e => {
    if (!app.downloadUrl) {
      e.preventDefault()
      toast('下載連結即將上線 · Download link coming soon')
      return
    }
    confirmLeave(e)
    if (e.defaultPrevented) return
    setState('loading')
    timer.current = setTimeout(() => setState('done'), 1400)
  }

  return (
    <a
      className={`get-btn download ${state}`}
      href={app.downloadUrl || '#'}
      target="_blank"
      rel="noopener noreferrer"
      onClick={start}
    >
      {state === 'loading' ? <span className="dl-ring" aria-label="Downloading" /> : state === 'done' ? (compact ? 'OPEN' : 'Downloaded ✓') : (compact ? 'GET' : '⬇ 下載 App')}
    </a>
  )
}

function Header({ title, onBack, right, tone }) {
  return (
    <div className={`scr-header ${tone ?? ''}`}>
      {onBack ? <button type="button" className="scr-back" onClick={onBack}>‹ Back</button> : <span />}
      <strong>{title}</strong>
      <span className="scr-right">{right}</span>
    </div>
  )
}

/* ---------- English Town ---------- */

const residents = [
  {
    id: 'baker', name: 'Ben the Baker', emoji: '🥐', place: 'Sunny Bakery',
    hello: "Good morning! What would you like today? Our croissants just came out of the oven.",
    replies: {
      'Can I have two croissants, please?': "Of course! That's sixty dollars. Would you like a bag?",
      'What do you recommend?': 'Try the melon bread. It is sweet, soft and very popular with kids!',
      'How much is the cake?': 'A slice of chocolate cake is forty-five dollars.'
    },
    word: 'croissant'
  },
  {
    id: 'librarian', name: 'Lily the Librarian', emoji: '📚', place: 'Town Library',
    hello: 'Hi there! Are you looking for a book? Please speak quietly in the library.',
    replies: {
      'Where can I find comic books?': 'Comic books are on the second floor, next to the windows.',
      'Can I borrow this book?': 'Sure! You can keep it for two weeks. Do you have your library card?',
      'What time do you close?': 'We close at eight p.m. from Monday to Friday.'
    },
    word: 'borrow'
  },
  {
    id: 'officer', name: 'Officer Olivia', emoji: '👮‍♀️', place: 'Main Street',
    hello: "Hello! Are you lost? I can help you find your way around English Town.",
    replies: {
      'How do I get to the park?': 'Go straight and turn left at the bakery. The park is on your right.',
      'Is the museum far from here?': "Not at all. It's about five minutes on foot.",
      'Where is the bus stop?': 'The bus stop is across the street, in front of the post office.'
    },
    word: 'turn left'
  }
]

export function EnglishTown({ app, now, toast }) {
  const [who, setWho] = useState(null)
  const [msgs, setMsgs] = useState([])
  const [words, setWords] = useState([])
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs])

  const talk = r => {
    setWho(r)
    setMsgs([{ from: 'npc', text: r.hello }])
  }
  const say = text => {
    setMsgs(m => [...m, { from: 'me', text }])
    setTimeout(() => setMsgs(m => [...m, { from: 'npc', text: who.replies[text] }]), 650)
    if (!words.includes(who.word)) {
      setWords(w => [...w, who.word])
      toast(`New word saved: “${who.word}”`)
    }
  }

  if (who) {
    const asked = new Set(msgs.filter(m => m.from === 'me').map(m => m.text))
    return (
      <div className="scr scr-town">
        <StatusBar now={now} tone="dark" />
        <Header title={`${who.emoji} ${who.name}`} onBack={() => setWho(null)} tone="dark" />
        <div className="chat" ref={listRef}>
          {msgs.map((m, i) => <div key={i} className={`bubble ${m.from}`}>{m.text}</div>)}
        </div>
        <div className="chips">
          {Object.keys(who.replies).filter(q => !asked.has(q)).map(q => (
            <button key={q} type="button" className="chip" onClick={() => say(q)}>{q}</button>
          ))}
          <button type="button" className="chip mic" onClick={() => toast('In the full app you can talk by voice 🎙️')}>🎙️ Speak</button>
        </div>
      </div>
    )
  }

  return (
    <div className="scr scr-town">
      <StatusBar now={now} tone="dark" />
      <div className="town-hero" style={{ backgroundImage: 'url(/screenshots/english-town.png)' }}>
        <div>
          <span className="pill">VR English practice</span>
          <h3>English Town</h3>
        </div>
      </div>
      <p className="scr-sub">Who do you want to talk to?</p>
      <div className="list">
        {residents.map(r => (
          <button key={r.id} type="button" className="row" onClick={() => talk(r)}>
            <span className="row-emoji">{r.emoji}</span>
            <span className="row-text"><strong>{r.name}</strong><span>{r.place}</span></span>
            <span className="row-go">›</span>
          </button>
        ))}
      </div>
      <div className="vocab-strip">📒 Words learned: {words.length ? words.join(', ') : 'none yet'}</div>
      <div className="scr-foot"><GetButton app={app} toast={toast} /></div>
    </div>
  )
}

/* ---------- Tutoring Toolkit ---------- */

const quiz = [
  { q: 'I ___ to school by bus every day.', options: ['go', 'goes', 'going', 'went'], a: 0, note: 'Subject “I” + simple present: go.' },
  { q: 'Look! The children ___ in the park now.', options: ['play', 'played', 'are playing', 'plays'], a: 2, note: '“Look!” and “now” → present progressive.' },
  { q: 'My sister is ___ than me.', options: ['tall', 'taller', 'tallest', 'more tall'], a: 1, note: 'Comparing two people → comparative: taller.' },
  { q: 'There ___ some milk in the fridge.', options: ['are', 'be', 'is', 'am'], a: 2, note: 'Milk is uncountable → is.' }
]

export function Tutoring({ app, now, toast }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [teacher, setTeacher] = useState(false)
  const done = i >= quiz.length
  const item = quiz[i]

  const pick = k => {
    if (picked !== null) return
    setPicked(k)
    if (k === item.a) setScore(s => s + 1)
  }
  const next = () => {
    setPicked(null)
    setI(n => n + 1)
  }

  return (
    <div className="scr scr-paper">
      <StatusBar now={now} tone="dark" />
      <Header
        title="Grade 8 · Unit 2 Quiz"
        right={<button type="button" className={`toggle ${teacher ? 'on' : ''}`} onClick={() => setTeacher(t => !t)}>{teacher ? 'Teacher' : 'Student'}</button>}
      />
      {done ? (
        <div className="quiz-done">
          <div className="big">{score}/{quiz.length}</div>
          <p>Mistakes go into the class record, so the next quiz practises them again.</p>
          <button type="button" className="get-btn" onClick={() => { setI(0); setScore(0) }}>Try again</button>
        </div>
      ) : (
        <div className="quiz">
          <div className="quiz-progress"><span style={{ width: `${(i / quiz.length) * 100}%` }} /></div>
          <p className="quiz-num">Question {i + 1} of {quiz.length}</p>
          <p className="quiz-q">{item.q}</p>
          <div className="quiz-opts">
            {item.options.map((o, k) => {
              const cls = picked === null
                ? (teacher && k === item.a ? 'answer' : '')
                : k === item.a ? 'right' : k === picked ? 'wrong' : 'dim'
              return (
                <button key={o} type="button" className={`opt ${cls}`} onClick={() => pick(k)}>
                  <span>{'ABCD'[k]}</span>{o}
                </button>
              )
            })}
          </div>
          {picked !== null && (
            <div className={`quiz-note ${picked === item.a ? 'ok' : 'no'}`}>
              {picked === item.a ? '✓ Correct! ' : '✗ Not quite. '}{item.note}
              <button type="button" className="get-btn" onClick={next}>Next</button>
            </div>
          )}
        </div>
      )}
      <div className="scr-foot"><GetButton app={app} toast={toast} /></div>
    </div>
  )
}

/* ---------- 英語輕鬆學：交通工具篇 (MIT App Inventor) ---------- */

const vehicles = [
  ['⛵', 'boat', '船'], ['✈️', 'airplane', '飛機'], ['🚗', 'car', '汽車'], ['🚌', 'bus', '公車'],
  ['🚲', 'bike', '腳踏車'], ['🚆', 'train', '火車'], ['🚕', 'taxi', '計程車'], ['🛵', 'scooter', '機車']
]

const speak = word => {
  if (!('speechSynthesis' in window)) return
  const u = new SpeechSynthesisUtterance(word)
  u.lang = 'en-US'
  u.rate = 0.85
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
}

export function Transport({ app, now, toast }) {
  const [user, setUser] = useState(null)
  const [seat, setSeat] = useState('60512')
  const [name, setName] = useState('王小明')
  const [flipped, setFlipped] = useState({})

  return (
    <div className="scr scr-ai2">
      <div className="ai2-top">
        <StatusBar now={now} />
        <div className="ai2-bar">
          <span />
          <strong>{user ? '單字卡' : '登入頁'}</strong>
          <GetButton app={app} toast={toast} compact />
        </div>
      </div>
      {!user ? (
        <div className="ai2-login">
          <p className="ai2-title">歡迎來到英語輕鬆學：交通工具篇！</p>
          <div className="ai2-art">⛵✈️<br />🚌🚗🚙</div>
          <label>班級座號：<input value={seat} onChange={e => setSeat(e.target.value)} /></label>
          <label>姓名：<input value={name} onChange={e => setName(e.target.value)} /></label>
          <button type="button" className="ai2-btn" onClick={() => setUser(name || '同學')}>登入</button>
          <div className="ai2-dl">
            <p>這是用 MIT App Inventor 做的 Android App</p>
            <GetButton app={app} toast={toast} />
          </div>
        </div>
      ) : (
        <div className="ai2-cards">
          <p className="ai2-hello">{user}，點卡片聽發音、看中文 🔊</p>
          <div className="ai2-grid">
            {vehicles.map(([e, en, zh]) => (
              <button
                key={en}
                type="button"
                className={`ai2-card ${flipped[en] ? 'flip' : ''}`}
                onClick={() => {
                  speak(en)
                  setFlipped(f => ({ ...f, [en]: !f[en] }))
                }}
              >
                <span className="ai2-emoji">{e}</span>
                <strong>{en}</strong>
                {flipped[en] && <span className="ai2-zh">{zh}</span>}
              </button>
            ))}
          </div>
          <button type="button" className="scr-back light" onClick={() => setUser(null)}>‹ 登出</button>
        </div>
      )}
    </div>
  )
}

/* ---------- Screenshot apps (Book Collector, Clipway) ---------- */

function Gallery({ app, toast, shots }) {
  const [i, setI] = useState(0)
  const go = d => setI(n => (n + d + shots.length) % shots.length)
  return (
    <div className="scr scr-shots">
      <img src={shots[i].src} alt={`${app.name}: ${shots[i].label}`} />
      <button type="button" className="tap-zone left" onClick={() => go(-1)} aria-label="Previous screen" />
      <button type="button" className="tap-zone right" onClick={() => go(1)} aria-label="Next screen" />
      <div className="shots-caption">
        <span>{shots[i].label}</span>
        <span className="shots-dots">{shots.map((s, k) => <i key={s.src} className={k === i ? 'on' : ''} />)}</span>
        <GetButton app={app} toast={toast} compact />
      </div>
    </div>
  )
}

const bookShots = [
  ['book-1-1', 'Library shelves'], ['book-1-2', 'Book details'], ['book-1-3', 'Review'],
  ['book-2-2', 'Scan a barcode'], ['book-2-3', 'Shelf inventory'], ['book-2-1', 'Search highlights'],
  ['book-3-1', 'Drafts'], ['book-3-2', 'Inzai, the AI owl'], ['book-3-3', 'Letter to future self']
].map(([f, label]) => ({ src: `/sim/${f}.jpg`, label }))

const clipShots = [
  ['clipway-1', 'Trip overview'], ['clipway-2', 'Day plan on a map'], ['clipway-3', 'Share as boarding pass']
].map(([f, label]) => ({ src: `/sim/${f}.jpg`, label }))

/* ---------- Make Time ---------- */

export function MakeTime({ app, now, toast }) {
  const [tasks, setTasks] = useState([
    { t: 'Plan Unit 3 vocabulary quiz', done: false },
    { t: 'Grade writing homework', done: true },
    { t: 'Reply to parent emails', done: false }
  ])
  const [draft, setDraft] = useState('')
  const [secs, setSecs] = useState(25 * 60)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [running])

  const add = e => {
    e.preventDefault()
    if (!draft.trim()) return
    setTasks(ts => [...ts, { t: draft.trim(), done: false }])
    setDraft('')
  }
  const left = tasks.filter(t => !t.done).length

  return (
    <div className="scr scr-foam">
      <StatusBar now={now} tone="dark" />
      <div className="mt-title"><h3>Today</h3><span>{left} left</span></div>
      <div className="mt-timer">
        <div className="mt-clock">{String(Math.floor(secs / 60)).padStart(2, '0')}:{String(secs % 60).padStart(2, '0')}</div>
        <div className="mt-btns">
          <button type="button" className="get-btn" onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Focus'}</button>
          <button type="button" className="get-btn ghost" onClick={() => { setRunning(false); setSecs(25 * 60) }}>Reset</button>
        </div>
      </div>
      <ul className="mt-list">
        {tasks.map((task, k) => (
          <li key={k}>
            <button
              type="button"
              className={task.done ? 'done' : ''}
              onClick={() => {
                setTasks(ts => ts.map((x, j) => (j === k ? { ...x, done: !x.done } : x)))
                if (!task.done && left === 1) toast('All done for today 🎉')
              }}
            >
              <span className="check">{task.done ? '✓' : ''}</span>{task.t}
            </button>
          </li>
        ))}
      </ul>
      <form className="mt-add" onSubmit={add}>
        <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Add a task…" />
        <button type="submit">+</button>
      </form>
      <div className="scr-foot"><GetButton app={app} toast={toast} /></div>
    </div>
  )
}

/* ---------- Daily Bible Quote ---------- */

const verses = [
  { en: 'Thy word is a lamp unto my feet, and a light unto my path.', zh: '你的話是我腳前的燈，是我路上的光。', ref: 'Psalm 119:105', zref: '詩篇 119:105' },
  { en: 'I can do all things through Christ which strengtheneth me.', zh: '我靠著那加給我力量的，凡事都能做。', ref: 'Philippians 4:13', zref: '腓立比書 4:13' },
  { en: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.', zh: '你要專心仰賴耶和華，不可倚靠自己的聰明。', ref: 'Proverbs 3:5', zref: '箴言 3:5' },
  { en: 'They that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.', zh: '但那等候耶和華的必從新得力。他們必如鷹展翅上騰。', ref: 'Isaiah 40:31', zref: '以賽亞書 40:31' }
]
const themes = ['dawn', 'paper', 'night']

export function Bible({ app, now, toast }) {
  const [i, setI] = useState(0)
  const [lang, setLang] = useState('en')
  const [theme, setTheme] = useState(0)
  const v = verses[i]
  return (
    <div className={`scr scr-verse ${themes[theme]}`}>
      <StatusBar now={now} tone={themes[theme] === 'paper' ? 'dark' : 'light'} />
      <div className="verse-tabs">
        {['en', 'zh', 'both'].map(l => (
          <button key={l} type="button" className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>
            {l === 'en' ? 'English' : l === 'zh' ? '中文' : 'Both'}
          </button>
        ))}
      </div>
      <button type="button" className="verse-card" onClick={() => setI(n => (n + 1) % verses.length)}>
        {lang !== 'zh' && <p className="verse-en">“{v.en}”</p>}
        {lang !== 'en' && <p className="verse-zh">「{v.zh}」</p>}
        <span className="verse-ref">{lang === 'zh' ? v.zref : v.ref}</span>
        <span className="verse-hint">Tap for the next verse</span>
      </button>
      <div className="verse-actions">
        <button type="button" className="get-btn ghost" onClick={() => setTheme(t => (t + 1) % themes.length)}>🎨 Theme</button>
        <button type="button" className="get-btn ghost" onClick={() => toast('Saved as a phone wallpaper (demo)')}>🖼 Wallpaper</button>
      </div>
      <div className="scr-foot"><GetButton app={app} toast={toast} /></div>
    </div>
  )
}

/* ---------- Western Festivals ---------- */

const festivals = [
  { e: '🎄', n: 'Christmas', d: 'December 25', words: ['wreath', 'stocking', 'reindeer', 'carol'] },
  { e: '🎃', n: 'Halloween', d: 'October 31', words: ['costume', 'pumpkin', 'trick or treat', 'witch'] },
  { e: '🐣', n: 'Easter', d: 'Spring', words: ['egg hunt', 'bunny', 'basket', 'chick'] },
  { e: '🦃', n: 'Thanksgiving', d: '4th Thursday of November', words: ['turkey', 'grateful', 'harvest', 'pie'] }
]

export function Festivals({ app, now, toast }) {
  const [f, setF] = useState(null)
  return (
    <div className="scr scr-fest">
      <StatusBar now={now} tone="dark" />
      <Header title={f ? `${f.e} ${f.n}` : 'Western Festivals'} onBack={f ? () => setF(null) : null} tone="dark" />
      {!f ? (
        <div className="fest-grid">
          {festivals.map(x => (
            <button key={x.n} type="button" className="fest" onClick={() => setF(x)}>
              <span>{x.e}</span><strong>{x.n}</strong><small>{x.d}</small>
            </button>
          ))}
        </div>
      ) : (
        <div className="fest-detail">
          <div className="fest-big">{f.e}</div>
          <p>{f.n} is celebrated on {f.d}. Tap a word to hear it:</p>
          <div className="chips wrap">
            {f.words.map(w => <button key={w} type="button" className="chip" onClick={() => speak(w)}>🔊 {w}</button>)}
          </div>
        </div>
      )}
      <div className="scr-foot"><GetButton app={app} toast={toast} /></div>
    </div>
  )
}

/* ---------- App Store ---------- */

export function Store({ now, toast, open }) {
  const list = apps.filter(a => a.kind !== 'system')
  const featured = list.find(a => a.kind === 'appinventor')
  return (
    <div className="scr scr-store">
      <StatusBar now={now} tone="dark" />
      <div className="store-head">
        <span>{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}</span>
        <h3>Tiffany’s Apps</h3>
      </div>
      <div className="store-feature" style={{ background: featured.bg }}>
        <span className="pill">Download · MIT App Inventor</span>
        <strong>英語輕鬆學：交通工具篇</strong>
        <span>Learn vehicle words with pictures and sound.</span>
        <GetButton app={featured} toast={toast} />
      </div>
      <div className="store-list">
        {list.map(a => (
          <div key={a.id} className="store-row">
            <button type="button" className="store-app" onClick={e => open(a.id, e)}>
              <span className="ios-icon sm" style={{ background: a.bg }}>{a.icon}</span>
              <span className="row-text"><strong>{a.name}</strong><span>{a.tagline}</span></span>
            </button>
            <GetButton app={a} toast={toast} compact />
          </div>
        ))}
      </div>
    </div>
  )
}

export const BookCollector = props => <Gallery {...props} shots={bookShots} />
export const Clipway = props => <Gallery {...props} shots={clipShots} />
