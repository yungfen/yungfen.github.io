// Apps shown on the simulated iPhone on the homepage.
// video: optional real screen recording (e.g. '/sim/video/clipway.mp4'); it plays when the app opens.
// poster: still frame shown while the video loads; videoFit: 'contain' letterboxes a landscape recording.
// kind: 'web' opens the live site, 'ios' is in TestFlight, 'appinventor' can be downloaded (Android .apk / App Inventor link).
export const apps = [
  {
    id: 'english-town',
    name: 'English Town',
    icon: '🏘️',
    bg: 'linear-gradient(145deg, #c4a7e7, #6d5bd0)',
    kind: 'web',
    url: 'https://english-town.yungfen.workers.dev/',
    video: '/sim/video/english-town.mp4',
    poster: '/sim/video/english-town.jpg',
    tagline: 'Talk to AI residents in a 3D town'
  },
  {
    id: 'tutoring',
    name: 'Tutoring',
    icon: '📝',
    bg: 'linear-gradient(145deg, #f6c177, #e07b53)',
    kind: 'web',
    tagline: 'Grade 8 quiz generator + class records'
  },
  {
    id: 'comments',
    name: 'Comments',
    icon: '🌱',
    bg: 'linear-gradient(145deg, #ebbcba, #d16d8c)',
    kind: 'web',
    url: 'https://teacher-portal.yungfen.workers.dev/',
    tagline: 'Montessori-aligned student feedback'
  },
  {
    id: 'transport',
    name: '交通工具篇',
    icon: '🚌',
    bg: 'linear-gradient(145deg, #5b6ee1, #3f51b5)',
    kind: 'appinventor',
    // Paste the MIT App Inventor link (gallery page or .apk download) here.
    downloadUrl: '',
    tagline: '英語輕鬆學 · MIT App Inventor'
  },
  {
    id: 'book-collector',
    name: 'Books',
    icon: '📚',
    bg: 'linear-gradient(145deg, #f3d9b1, #e8916b)',
    kind: 'ios',
    status: 'TestFlight beta',
    tagline: 'Reading log with Inzai the AI owl'
  },
  {
    id: 'clipway',
    name: 'Clipway',
    icon: '🧭',
    bg: 'linear-gradient(145deg, #9ccfd8, #31748f)',
    kind: 'ios',
    status: 'TestFlight beta',
    tagline: 'Saved posts → trip itinerary'
  },
  {
    id: 'make-time',
    name: 'Make Time',
    icon: '⏳',
    bg: 'linear-gradient(145deg, #9ccfd8, #4f8a8b)',
    kind: 'web',
    url: 'https://make-time.netlify.app/',
    video: '/sim/video/make-time.mp4',
    poster: '/sim/video/make-time.jpg',
    tagline: 'Tasks and focus timer'
  },
  {
    id: 'bible',
    name: 'Daily Verse',
    icon: '✨',
    bg: 'linear-gradient(145deg, #f6c177, #b9832f)',
    kind: 'web',
    url: 'https://daily-bible-quote-widget.netlify.app/',
    video: '/sim/video/bible.mp4',
    poster: '/sim/video/bible.jpg',
    tagline: 'Bilingual daily scripture'
  },
  {
    id: 'festivals',
    name: 'Festivals',
    icon: '🎃',
    bg: 'linear-gradient(145deg, #ff9f68, #c0392b)',
    kind: 'web',
    url: 'https://learn-english-western-festival.netlify.app/',
    // Desktop site, so the recording is landscape and shown letterboxed.
    video: '/sim/video/festivals.mp4',
    poster: '/sim/video/festivals.jpg',
    videoFit: 'contain',
    tagline: 'Learn English through Western festivals'
  },
  {
    id: 'store',
    name: 'App Store',
    icon: '⬇️',
    bg: 'linear-gradient(145deg, #4fc3f7, #1565c0)',
    kind: 'system',
    tagline: 'Get all my apps'
  }
]

export const dock = ['english-town', 'transport', 'book-collector', 'store']
export const appById = Object.fromEntries(apps.map(a => [a.id, a]))
