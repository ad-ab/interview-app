import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
} from '@tanstack/react-router'
import App from './App'
import DashboardPage from './routes/DashboardPage'
import ConfigurationLayout from './routes/configuration/ConfigurationLayout'
import PoolsPage from './routes/configuration/PoolsPage'
import PerformancePage from './routes/configuration/PerformancePage'
import CoolingPage from './routes/configuration/CoolingPage'
import SystemLayout from './routes/system/SystemLayout'
import SettingsPage from './routes/system/SettingsPage'
import NetworkPage from './routes/system/NetworkPage'
import LogPage from './routes/system/LogPage'
import './i18n'
import './index.scss'

const rootRoute = createRootRoute({
  component: () => <App />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/dashboard' }) },
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
})

const configRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/configuration',
  component: ConfigurationLayout,
  beforeLoad: ({ location }) => {
    if (location.pathname === '/configuration' || location.pathname === '/configuration/') {
      throw redirect({ to: '/configuration/pools' })
    }
  },
})

const poolsRoute = createRoute({
  getParentRoute: () => configRoute,
  path: '/pools',
  component: PoolsPage,
})

const performanceRoute = createRoute({
  getParentRoute: () => configRoute,
  path: '/performance',
  component: PerformancePage,
})

const coolingRoute = createRoute({
  getParentRoute: () => configRoute,
  path: '/cooling',
  component: CoolingPage,
})

const systemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/system',
  component: SystemLayout,
  beforeLoad: ({ location }) => {
    if (location.pathname === '/system' || location.pathname === '/system/') {
      throw redirect({ to: '/system/settings' })
    }
  },
})

const settingsRoute = createRoute({
  getParentRoute: () => systemRoute,
  path: '/settings',
  component: SettingsPage,
})

const networkRoute = createRoute({
  getParentRoute: () => systemRoute,
  path: '/network',
  component: NetworkPage,
})

const logRoute = createRoute({
  getParentRoute: () => systemRoute,
  path: '/log',
  component: LogPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  configRoute.addChildren([poolsRoute, performanceRoute, coolingRoute]),
  systemRoute.addChildren([settingsRoute, networkRoute, logRoute]),
])

const router = createRouter({ routeTree })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
