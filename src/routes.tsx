import { Outlet } from 'react-router-dom'
import App from './App'

function Root() {
  return <Outlet />
}

export const routes = [
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <App /> },
      { path: '*', element: <App /> },
    ],
  },
]
