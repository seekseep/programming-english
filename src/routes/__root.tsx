import {
  HeadContent,
  Outlet,
  Scripts,
  Link,
  createRootRoute,
  useMatchRoute,
} from '@tanstack/react-router'
import { Layers, BookOpen, Settings } from 'lucide-react'
import { SaveDataProvider } from '#/context/SaveDataContext'
import {
  LanguagePreferenceProvider,
  useLanguagePreference,
} from '#/context/LanguagePreferenceContext'
import { LanguageSelector } from '#/components/LanguageSelector'

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
    <LanguagePreferenceProvider>
      <SaveDataProvider>
        <AppShell />
      </SaveDataProvider>
    </LanguagePreferenceProvider>
  )
}

function AppShell() {
  const matchRoute = useMatchRoute()
  const isPlayMode = matchRoute({ to: '/stages/$stageId/play', fuzzy: true })
  const { isLanguageSetup, isHydrated } = useLanguagePreference()

  if (!isHydrated) {
    return <LoadingScreen />
  }

  if (!isLanguageSetup) {
    return <LanguageSetupScreen />
  }

  return (
    <>
      {!isPlayMode && (
        <nav className="site-nav">
          <div className="nav-inner">
            <Link to="/" className="nav-logo">
              PEQ
            </Link>
            <div className="nav-links">
              <Link to="/">
                <Layers size={18} />
                <span>ステージ</span>
              </Link>
              <Link to="/words">
                <BookOpen size={18} />
                <span>単語帳</span>
              </Link>
              <Link to="/settings">
                <Settings size={18} />
                <span>設定</span>
              </Link>
            </div>
          </div>
        </nav>
      )}
      <Outlet />
    </>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <h1 className="text-2xl font-black">Programming English Quest</h1>
    </div>
  )
}

function LanguageSetupScreen() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black">Programming English Quest</h1>
          <p className="text-sm text-muted-foreground mt-2">
            出題に使用するプログラミング言語を選んでください
          </p>
        </div>
        <LanguageSelector />
      </div>
    </div>
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
