import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { } from 'vite-react-ssg'

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'MockShot — Fake Chat Screenshot Generator',
    description: 'Create realistic fake iMessage, WhatsApp, and Messenger screenshots instantly. Free, no sign-up required.',
  },
  '/imessage': {
    title: 'iMessage Screenshot Generator — MockShot',
    description: 'Create realistic fake iMessage screenshots instantly. Customize conversations with dark/light mode and export as PNG. Free to use.',
  },
  '/whatsapp': {
    title: 'WhatsApp Screenshot Generator — MockShot',
    description: 'Generate fake WhatsApp chat screenshots for free. Set sender, receiver, and timestamps. Export as high-quality PNG instantly.',
  },
  '/messenger': {
    title: 'Facebook Messenger Screenshot Generator — MockShot',
    description: 'Create fake Facebook Messenger chat screenshots online. Customize names, avatars, and reactions. Free PNG export.',
  },
  '/about': {
    title: 'About MockShot — Free Fake Chat Screenshot Generator',
    description: 'Learn about MockShot, the free tool to generate realistic fake iMessage, WhatsApp, and Messenger screenshots instantly.',
  },
}

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  ssgOptions: {
    dirStyle: 'nested',
    includedRoutes: () => ['/', '/imessage', '/whatsapp', '/messenger', '/about'],
    onBeforePageRender: (route, indexHTML) => {
      const meta = PAGE_META[route]
      if (!meta) return indexHTML
      return indexHTML
        .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
        .replace(/(<meta name="description" content=")[^"]*"/, `$1${meta.description}"`)
    },
  },
})
