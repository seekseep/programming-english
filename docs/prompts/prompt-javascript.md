# JavaScript / TypeScript の英単語を列挙してください

## 目的

プログラミングで使う英語を学習するゲームの単語データを作成しています。
JavaScript および TypeScript の文脈で頻出する英単語を列挙してください。

## 対象

予約語だけでなく、以下も含めてください:

- 予約語・キーワード（return, function, class, const, switch, case, throw, catch など）
- 組み込みオブジェクト・メソッド（Array, Promise, map, filter, reduce, slice, splice など の英単語部分）
- DOM操作でよく使う語（document, element, query, selector, append, remove など）
- イベント関連（click, submit, change, load, focus, blur など）
- 型関連（string, number, boolean, undefined, null, void, never, unknown など）
- よく使われる命名パターンの英単語部分（handle, fetch, parse, validate, render, update, create, delete など）

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
