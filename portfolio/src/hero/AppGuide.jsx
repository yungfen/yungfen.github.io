import { appById } from '../sim/apps.js'
import { appInfo, phoneGuide } from '../sim/appInfo.js'

export default function AppGuide({ view, layout }) {
  const app = appById[view]
  const info = (app && appInfo[app.id]) || phoneGuide
  return (
    <aside className={`app-guide guide-${layout}`} aria-live="polite" key={app?.id ?? 'phone'}>
      <div className="guide-head">
        {app ? <span className="guide-icon" style={{ background: app.bg }}>{app.icon}</span> : <span className="guide-icon plain">📱</span>}
        <div>
          <span className="guide-eyebrow">{app ? 'Now open' : 'Try it'}</span>
          <strong>{app ? app.name : info.title}</strong>
        </div>
      </div>
      <p>{info.about}</p>
      <ol>
        {info.steps.map(s => <li key={s}>{s}</li>)}
      </ol>
      {info.ui && <span className="guide-ui">App language: {info.ui}</span>}
    </aside>
  )
}
