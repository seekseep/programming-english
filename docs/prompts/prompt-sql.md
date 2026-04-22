# SQL の英単語を列挙してください

## 目的

プログラミングで使う英語を学習するゲームの単語データを作成しています。
SQL の文脈で頻出する英単語を列挙してください。

## 対象

予約語だけでなく、以下も含めてください:

- 基本句（select, insert, update, delete, create, drop, alter, from, where, order, group, having など）
- 結合関連（join, inner, outer, left, right, cross, union など）
- 条件・演算（between, like, exists, distinct, null, case, when, then, else など）
- 集約関数の英単語部分（count, sum, average, maximum, minimum など）
- テーブル定義関連（table, column, primary, foreign, key, index, constraint, unique, default, check, reference など）
- データ型関連（integer, decimal, character, text, boolean, date, time, timestamp など）
- トランザクション関連（commit, rollback, transaction, grant, revoke など）

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
