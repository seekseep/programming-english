# CSS の英単語を列挙してください

## 目的

プログラミングで使う英語を学習するゲームの単語データを作成しています。
CSS の文脈で頻出する英単語を列挙してください。

## 対象

予約語だけでなく、以下も含めてください:

- プロパティ名の英単語部分（color, display, position, margin, padding, border, font, width, height など）
- プロパティ値（visible, hidden, none, block, inline, flex, grid, absolute, relative, fixed, bold, italic, center, inherit, initial など）
- 単位に関連する語（percent, pixel など）
- セレクタ関連（hover, active, focus, first, last, child, before, after など）
- レイアウト関連（column, row, wrap, align, justify, gap, order, grow, shrink など）
- アニメーション関連（transition, transform, rotate, scale, translate, duration, delay, ease など）

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
