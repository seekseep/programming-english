import {
  HeadContent,
  Outlet,
  Scripts,
  Link,
  createRootRoute,
  useMatchRoute,
} from '@tanstack/react-router'
import { Layers, BookOpen } from 'lucide-react'
import { SaveDataProvider } from '#/context/SaveDataContext'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Programming English Quest',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootComponent() {
  const matchRoute = useMatchRoute()
  const isPlayMode = matchRoute({ to: '/stages/$stageId/play', fuzzy: true })

  return (
    <SaveDataProvider>
      {!isPlayMode && (
        <nav className="site-nav">
          <div className="nav-inner">
            <Link to="/" className="nav-logo">
              PEQ
            </Link>
            <div className="nav-links">
              <Link to="/"><Layers size={18} /><span>ステージ</span></Link>
              <Link to="/words"><BookOpen size={18} /><span>単語帳</span></Link>
            </div>
          </div>
        </nav>
      )}
      <Outlet />
    </SaveDataProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
