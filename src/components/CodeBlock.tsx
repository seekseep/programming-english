import { Highlight, themes } from 'prism-react-renderer'

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
}

export function CodeBlock({ code, language }: Props) {
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
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
