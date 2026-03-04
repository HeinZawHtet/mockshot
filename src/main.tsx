import { ViteReactSSG } from 'vite-react-ssg'
import './index.css'
import 'remixicon/fonts/remixicon.css'
import { routes } from './routes'

export const createRoot = ViteReactSSG({ routes })
