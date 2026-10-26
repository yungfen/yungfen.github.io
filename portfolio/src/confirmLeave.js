export const confirmLeave = e => {
  if (!window.confirm('You are leaving this site. Continue?')) {
    e.preventDefault()
  }
}
