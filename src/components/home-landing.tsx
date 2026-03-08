import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: 'ri-focus-3-line',
    title: 'Built to Look Real',
    description: 'Bubbles, fonts, and colors are carefully crafted to closely mimic the real apps — realistic enough to fool anyone at a glance.',
  },
  {
    icon: 'ri-contrast-2-line',
    title: 'Dark & Light Mode',
    description: 'Switch between themes on every platform. Match any device screenshot, from midnight black to full daylight white.',
  },
  {
    icon: 'ri-user-smile-line',
    title: 'Custom Contacts & Avatars',
    description: 'Set any contact name and upload a real profile photo to make every detail of your screenshot completely authentic.',
  },
  {
    icon: 'ri-image-2-line',
    title: 'Instant PNG Export — No Watermark',
    description: 'Download a high-resolution, watermark-free PNG in one click. Ready to post, share, or drop into any project immediately.',
  },
]

const PLATFORMS = [
  {
    name: 'iMessage',
    icon: 'ri-chat-3-line',
    color: '#2B7EFB',
    href: '/imessage',
    cta: 'Try iMessage Generator',
    description: 'Pixel-accurate blue bubbles, SF Pro typography, read receipts, and the native iOS status bar. Looks exactly like a real iPhone screenshot.',
    tags: ['Dark Mode', 'Light Mode', 'Read Receipts', 'Timestamps'],
  },
  {
    name: 'WhatsApp',
    icon: 'ri-whatsapp-line',
    color: '#25D366',
    href: '/whatsapp',
    cta: 'Try WhatsApp Generator',
    description: 'Double-tick delivery indicators, timestamps inside bubbles, and the signature dark green color scheme. The world\'s most-used messaging app, faithfully replicated.',
    tags: ['Dark Mode', 'Light Mode', 'Tick Receipts', 'Timestamps'],
  },
  {
    name: 'Messenger',
    icon: 'ri-messenger-line',
    color: '#0084FF',
    href: '/messenger',
    cta: 'Try Messenger Generator',
    description: 'Emoji reactions, avatar bubbles, and the iconic blue gradient — in both light and dark mode, indistinguishable from the real Facebook Messenger app.',
    tags: ['Dark Mode', 'Light Mode', 'Reactions', 'Avatars'],
  },
]

const USE_CASES = [
  {
    icon: 'ri-video-line',
    title: 'Content Creators',
    description: 'Make engaging YouTube thumbnails, story mockups, and social media props that drive clicks and views.',
  },
  {
    icon: 'ri-emotion-laugh-line',
    title: 'Memes & Comedy',
    description: 'Build the perfect punchline. Craft absurd fake conversations that land every time on Reddit, Twitter, or your group chat.',
  },
  {
    icon: 'ri-layout-line',
    title: 'UI/UX Design',
    description: 'Prototype chat interfaces and create realistic wireframes without staging a real conversation.',
  },
  {
    icon: 'ri-megaphone-line',
    title: 'Marketing & Ads',
    description: 'Illustrate customer support wins, testimonial scenarios, and campaign concepts in polished visual form.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Choose a Platform',
    desc: 'Pick iMessage, WhatsApp, or Messenger. Select dark or light mode to match the screenshot you need.',
  },
  {
    n: '02',
    title: 'Write Your Conversation',
    desc: 'Add messages from either side, set a contact name, adjust timestamps, and upload a profile photo.',
  },
  {
    n: '03',
    title: 'Export as PNG',
    desc: 'Hit Export and download a high-resolution, watermark-free image instantly. No account required.',
  },
]

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Is MockShot free to use?',
    a: 'Yes, completely free. No subscription, no watermark, no hidden fees. MockShot is and will remain free to use for everyone.',
  },
  {
    q: 'Do I need to sign up or create an account?',
    a: 'No account needed. Open the app and start creating immediately — no email address or password required.',
  },
  {
    q: 'What format are the exported screenshots in?',
    a: 'All screenshots export as high-resolution PNG files at 2× pixel density, ready for social media, presentations, or print.',
  },
  {
    q: 'Can I use a real profile photo for the contact?',
    a: 'Yes. Tap the avatar in the Recipient settings to upload any image as the contact\'s profile picture. It appears in all received message bubbles.',
  },
  {
    q: 'Is my data safe and private?',
    a: 'Everything runs locally in your browser. Your messages and images never leave your device — nothing is stored or transmitted to any server.',
  },
  {
    q: 'Does MockShot work on mobile devices?',
    a: 'Yes. MockShot is fully responsive and works on iPhone, Android, and all modern browsers including Safari, Chrome, and Firefox.',
  },
]

interface Props {
  accentColor: string
  background: string
  colorMode: 'dark' | 'light'
}

export function HomeLanding({ accentColor, background, colorMode }: Props) {
  const isDark = colorMode === 'dark'

  const txt = isDark ? 'text-white' : 'text-slate-900'
  const sub = isDark ? 'text-white/40' : 'text-black/45'
  const label = isDark ? 'text-white/30' : 'text-black/35'
  const border = isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'
  const cardHover = isDark ? 'hover:border-white/15 hover:bg-white/[0.04]' : 'hover:border-black/15 hover:bg-black/[0.03]'
  const stepNum = isDark ? 'text-white/[0.07]' : 'text-black/[0.06]'
  const iconBorder = isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'
  const tagStyle = isDark ? 'border-white/[0.08] text-white/25' : 'border-black/[0.08] text-black/30'
  const sectionBorder = isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'
  const footerText = isDark ? 'text-white/20' : 'text-black/20'

  return (
    <div style={{ fontFamily: 'Syne, sans-serif', backgroundColor: background }}>

      {/* Intro */}
      <section className={`border-b ${sectionBorder}`}>
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-5 ${label}`}>
            Free Fake Chat Screenshot Generator
          </p>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6 max-w-3xl ${txt}`}>
            Create Realistic Fake Chat Screenshots — Free & Instant
          </h2>
          <p className={`text-base md:text-lg max-w-2xl leading-relaxed ${sub}`}>
            MockShot lets you generate pixel-perfect fake iMessage, WhatsApp, and Messenger screenshots directly in your browser.
            No sign-up required, no watermarks, no limits. Type your messages and export a high-quality PNG in seconds.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className={`border-b ${sectionBorder}`}>
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-10 ${label}`}>Why MockShot</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className={`border rounded-2xl p-6 transition-all duration-200 ${border} ${cardHover}`}
              >
                <i className={`${f.icon} text-xl mb-4 block`} aria-hidden style={{ color: accentColor }} />
                <h3 className={`text-sm font-bold mb-2 ${txt}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${sub}`}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className={`border-b ${sectionBorder}`}>
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-10 ${label}`}>Supported Platforms</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLATFORMS.map(p => (
              <Link
                key={p.name}
                to={p.href}
                className={`group flex flex-col gap-4 border rounded-2xl p-6 transition-all duration-200 ${border} ${cardHover}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${p.color}1a` }}
                  >
                    <i className={`${p.icon} text-base`} style={{ color: p.color }} aria-hidden />
                  </div>
                  <h3 className={`font-bold text-sm ${txt}`}>{p.name}</h3>
                </div>
                <p className={`text-sm leading-relaxed flex-1 ${sub}`}>{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map(tag => (
                    <span
                      key={tag}
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tagStyle}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-bold mt-1 group-hover:opacity-80 transition-opacity" style={{ color: p.color }}>
                  {p.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className={`border-b ${sectionBorder}`}>
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-10 ${label}`}>Who Uses MockShot</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {USE_CASES.map(u => (
              <div key={u.title} className="flex gap-4">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${iconBorder}`}>
                  <i className={`${u.icon} text-sm`} aria-hidden style={{ color: accentColor }} />
                </div>
                <div>
                  <h3 className={`font-bold text-sm mb-1.5 ${txt}`}>{u.title}</h3>
                  <p className={`text-sm leading-relaxed ${sub}`}>{u.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={`border-b ${sectionBorder}`}>
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-10 ${label}`}>How It Works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {STEPS.map(s => (
              <div key={s.n} className="flex flex-col gap-3">
                <span className={`text-5xl font-bold leading-none tabular-nums ${stepNum}`}>{s.n}</span>
                <h3 className={`font-bold text-sm ${txt}`}>{s.title}</h3>
                <p className={`text-sm leading-relaxed ${sub}`}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`border-b ${sectionBorder}`}>
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-10 ${label}`}>
            Frequently Asked Questions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
            {FAQS.map(f => (
              <div key={f.q}>
                <h3 className={`font-bold text-sm mb-2 ${txt}`}>{f.q}</h3>
                <p className={`text-sm leading-relaxed ${sub}`}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between gap-4">
        <span className={`text-sm font-bold ${txt}`}>MockShot</span>
        <p className={`text-xs ${footerText}`}>Free fake chat screenshot generator. No sign-up required.</p>
      </footer>

    </div>
  )
}
