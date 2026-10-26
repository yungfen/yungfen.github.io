import { hhmm } from './time.js'

export default function StatusBar({ now, tone = 'light' }) {
  return (
    <div className={`ios-status ${tone}`}>
      <span className="ios-time">{hhmm(now)}</span>
      <span className="ios-island" />
      <span className="ios-icons" aria-hidden="true">
        <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>
        <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 2.2c2.1 0 4 .8 5.4 2.1l1.1-1.1A9.2 9.2 0 0 0 7.5.6 9.2 9.2 0 0 0 1 3.2l1.1 1.1a7.6 7.6 0 0 1 5.4-2.1Zm0 3.2c1.2 0 2.3.5 3.2 1.2l1.1-1.1a6.1 6.1 0 0 0-8.6 0l1.1 1.1c.9-.7 2-1.2 3.2-1.2Zm0 3.1c-.4 0-.8.2-1.1.5L7.5 10l1.1-1c-.3-.3-.7-.5-1.1-.5Z" /></svg>
        <span className="ios-battery"><span /></span>
      </span>
    </div>
  )
}
