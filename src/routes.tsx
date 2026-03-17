import { Navigate, Outlet } from 'react-router-dom'
import App from './App'
import AboutPage from './pages/about'
import ContactPage from './pages/contact'

function Root() {
  return <Outlet />
}

export const routes = [
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <App /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'contact-us', element: <Navigate to="/contact" replace /> },
      { path: '*', element: <App /> },
    ],
  },
]
