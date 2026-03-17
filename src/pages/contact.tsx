import { Link } from 'react-router-dom'

const accentColor = '#2B7EFB'

export default function ContactPage() {
  return (
    <div style={{ fontFamily: 'Syne, sans-serif', backgroundColor: '#FFFFFF' }}>

      {/* Top nav */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors">
          <i className="ri-arrow-left-line text-base" aria-hidden />
          Back to app
        </Link>
      </div>

      {/* Hero */}
      <section className="border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-5 text-slate-400">
            Get in Touch
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6 max-w-3xl text-slate-900">
            We'd Love to Hear From You
          </h2>
          <p className="text-base md:text-lg max-w-2xl leading-relaxed text-slate-500 mb-6">
            Have a question, a bug to report, or just want to say hello? Send us an email and we'll get back to you as soon as we can.
          </p>
          <a
            href="mailto:hello@mockshot.app"
            className="inline-flex items-center gap-2 text-base font-bold transition-opacity hover:opacity-70"
            style={{ color: accentColor }}
          >
            <i className="ri-mail-line" aria-hidden />
            hello@mockshot.app
          </a>
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
