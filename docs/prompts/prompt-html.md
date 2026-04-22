# HTML の英単語を列挙してください

## 目的

プログラミングで使う英語を学習するゲームの単語データを作成しています。
HTML の文脈で頻出する英単語を列挙してください。

## 対象

予約語だけでなく、以下も含めてください:

- 要素名（body, header, footer, section, article, button, input, form, table, image など）
- 属性名（class, hidden, disabled, required, placeholder, action, method, target など）
- 属性値として使われる英単語（submit, reset, password, checkbox, radio など）
- メタ情報関連（charset, viewport, content, description, author など）
- セマンティック要素（navigation, main, aside, figure, caption, summary, details など）

## ルール

- 1文字や2文字の単語（if, as, in, do など）は除外する
- 略語（var, func, intなど）は除外する。ただし略語でないもの（例: select, return）は含める
- 英語として意味のある単語のみ（造語やライブラリ固有の名前は除外）
- 同じ単語が複数の意味を持つ場合、プログラミング文脈での意味を優先する
- 最低50個、できれば100個以上を目標にする

## 出力形式

JSON配列で出力してください。他のテキストは不要です。

```json
[
  { "word": "visible", "meaning": "見える、表示される" },
  { "word": "enable", "meaning": "有効にする" }
]
```
