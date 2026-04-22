import {
  HeadContent,
  Outlet,
  Scripts,
  Link,
  createRootRoute,
} from '@tanstack/react-router'
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
  return (
    <SaveDataProvider>
      <nav className="site-nav">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            PEQ
          </Link>
          <div className="nav-links">
            <Link to="/stages">ステージ</Link>
            <Link to="/words">単語帳</Link>
            <Link to="/store">ストア</Link>
            <Link to="/avatar">アバター</Link>
          </div>
        </div>
      </nav>
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
