import { Link } from 'react-router-dom'

const accentColor = '#2B7EFB'

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
    description: "Double-tick delivery indicators, timestamps inside bubbles, and the signature dark green color scheme. The world's most-used messaging app, faithfully replicated.",
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
    a: "Yes. Tap the avatar in the Recipient settings to upload any image as the contact's profile picture. It appears in all received message bubbles.",
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

export default function AboutPage() {
  return (
    <div style={{ fontFamily: 'Syne, sans-serif', backgroundColor: '#FFFFFF' }}>

      {/* Top nav */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors">
          <i className="ri-arrow-left-line text-base" aria-hidden />
          Back to app
        </Link>
      </div>

      {/* Intro */}
      <section className="border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-5 text-slate-400">
            Free Fake Chat Screenshot Generator
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6 max-w-3xl text-slate-900">
            Create Realistic Fake Chat Screenshots — Free & Instant
          </h2>
          <p className="text-base md:text-lg max-w-2xl leading-relaxed text-slate-500">
            MockShot lets you generate pixel-perfect fake iMessage, WhatsApp, and Messenger screenshots directly in your browser.
            No sign-up required, no watermarks, no limits. Type your messages and export a high-quality PNG in seconds.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-10 text-slate-400">Why MockShot</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="border border-slate-100 rounded-2xl p-6 transition-all duration-200 hover:border-slate-200 hover:bg-slate-50"
              >
                <i className={`${f.icon} text-xl mb-4 block`} aria-hidden style={{ color: accentColor }} />
                <h3 className="text-sm font-bold mb-2 text-slate-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-10 text-slate-400">Supported Platforms</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLATFORMS.map(p => (
              <Link
                key={p.name}
                to={p.href}
                className="group flex flex-col gap-4 border border-slate-100 rounded-2xl p-6 transition-all duration-200 hover:border-slate-200 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${p.color}1a` }}
                  >
                    <i className={`${p.icon} text-base`} style={{ color: p.color }} aria-hidden />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{p.name}</h3>
                </div>
                <p className="text-sm leading-relaxed flex-1 text-slate-500">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-slate-100 text-slate-400"
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
      <section className="border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-10 text-slate-400">Who Uses MockShot</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {USE_CASES.map(u => (
              <div key={u.title} className="flex gap-4">
                <div className="w-9 h-9 rounded-xl border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <i className={`${u.icon} text-sm`} aria-hidden style={{ color: accentColor }} />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1.5 text-slate-900">{u.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{u.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-10 text-slate-400">How It Works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {STEPS.map(s => (
              <div key={s.n} className="flex flex-col gap-3">
                <span className="text-5xl font-bold leading-none tabular-nums text-slate-200">{s.n}</span>
                <h3 className="font-bold text-sm text-slate-900">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-10 text-slate-400">
            Frequently Asked Questions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
            {FAQS.map(f => (
              <div key={f.q}>
                <h3 className="font-bold text-sm mb-2 text-slate-900">{f.q}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between gap-4">
        <span className="text-sm font-bold text-slate-900">MockShot</span>
        <p className="text-xs text-slate-300">Free fake chat screenshot generator. No sign-up required.</p>
      </footer>

    </div>
  )
}
