import { Highlight, themes } from 'prism-react-renderer'
import type { Token } from 'prism-react-renderer'

/**
 * データ上の language 値を prism-react-renderer にバンドルされた言語名に変換する。
 * prism-react-renderer v2 のバンドル済み言語:
 *   javascript, sql, css, html, json, python, go, swift, c, objectivec,
 *   graphql, markdown, xml, reason, actionscript
 * 上記に該当しない言語は "plain"（ハイライトなし）にフォールバックする。
 */
const prismLanguageMap: Record<string, string> = {
  javascript: 'javascript',
  js: 'javascript',
  sql: 'sql',
  'visual basic': 'plain',
  vb: 'plain',
  vba: 'plain',
  css: 'css',
  html: 'html',
  json: 'json',
  python: 'python',
  go: 'go',
  swift: 'swift',
  c: 'c',
  'objective-c': 'objectivec',
  objectivec: 'objectivec',
  java: 'plain',
  graphql: 'graphql',
  markdown: 'markdown',
  xml: 'xml',
}

export function toPrismLanguage(language: string): string {
  return prismLanguageMap[language.toLowerCase()] ?? 'plain'
}

type Props = {
  code: string
  language: string
  highlightWord?: string
}

function renderToken(
  token: Token,
  props: Record<string, unknown>,
  highlightWord: string | undefined,
  key: number,
) {
  if (!highlightWord) {
    return <span key={key} {...props} />
  }

  const text = token.content
  const regex = new RegExp(
    `(${highlightWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi',
  )
  const parts = text.split(regex)

  if (parts.length === 1) {
    return <span key={key} {...props} />
  }

  return (
    <span key={key}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-yellow-300/80 text-yellow-950 rounded px-0.5 font-bold"
            style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}
          >
            {part}
          </mark>
        ) : (
          <span key={i} {...props} style={{ ...(props.style as object) }}>
            {part}
          </span>
        ),
      )}
    </span>
  )
}

export function CodeBlock({ code, language, highlightWord }: Props) {
  const lang = toPrismLanguage(language)

  return (
    <Highlight theme={themes.oneDark} code={code.trim()} language={lang}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className="text-sm rounded-xl p-4 overflow-x-auto"
          style={{ ...style, margin: 0 }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => {
                const tokenProps = getTokenProps({ token })
                return renderToken(token, tokenProps, highlightWord, key)
              })}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
