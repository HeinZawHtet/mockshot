# MockShot

Generate realistic fake chat screenshots for iMessage, WhatsApp, and Facebook Messenger. Build conversations visually and export as PNG - no sign-up required.

**Live:** [mockshot.io](https://mockshot.io)

---

## Features

- iMessage, WhatsApp, and Messenger screenshot generation
- Light and dark mode for each platform
- Customize contact name and avatar
- Edit messages, timestamps, and reactions
- AI-generated conversations (Anthropic or OpenAI)
- Export as high-quality PNG (retina 2x)
- Fully static - no backend required

---

## Tech Stack

| Layer      | Tech                              |
|------------|-----------------------------------|
| Framework  | React 19 + TypeScript (strict)    |
| Build / SSG | Vite 7 + vite-react-ssg          |
| Styling    | Tailwind CSS v4                   |
| UI         | shadcn/ui v3                      |
| Export     | html-to-image                     |
| AI         | Vercel AI SDK (Anthropic / OpenAI)|
| Hosting    | Cloudflare Pages                  |

---

## Getting Started

**Prerequisites:** Node 18+, npm

```bash
git clone https://github.com/heinafk/mockshot.git
cd mockshot
npm install
```

### Environment (optional — AI features only)

```bash
cp .env.save .env
```

| Variable    | Description                                          |
|-------------|------------------------------------------------------|
| `AI_API_KEY` | Anthropic or OpenAI API key                         |
| `AI_MODEL`  | Model ID (e.g. `anthropic/claude-haiku-4-5-20251001`) |

### Dev server

```bash
npm run dev       # http://localhost:5173
```

### Build

```bash
npm run build     # TypeScript check + SSG → dist/
npm run preview   # Preview dist/ locally
npm run lint      # ESLint
```

---

## Project Structure

```
src/
  components/       # Shared UI (chat-bubble, phone-frame, drawers, etc.)
  contexts/         # ThemeContext
  hooks/            # useAppState
  modules/chat/     # Per-platform chat views (imessage, whatsapp, messenger)
  themes/           # ChatTheme objects per platform
  types/            # TypeScript interfaces (Message, ChatTheme, etc.)
  utils/            # export.ts, ai.ts, ai-storage.ts, helpers.ts
  pages/            # Static pages (about.tsx)
  data/             # Seed messages for demo
  App.tsx           # Root component
  routes.tsx        # React Router routes + SSG path registration
```

---

## Platforms

| Platform   | Accent      | Modes       |
|------------|-------------|-------------|
| iMessage   | `#2B7EFB`   | Light/Dark  |
| WhatsApp   | `#25D366`   | Light/Dark  |
| Messenger  | `#0084FF`   | Light/Dark  |

All platforms render inside a fixed 390×844px iPhone 14 frame.

---

## Deployment

`npm run build` outputs a fully static `dist/` — no Node.js server needed. Deployed on Cloudflare Pages. `public/_redirects` provides an SPA fallback for client-side routing.
