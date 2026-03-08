import { Outlet } from 'react-router-dom'
import App from './App'
import AboutPage from './pages/about'

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
      { path: '*', element: <App /> },
    ],
  },
]
