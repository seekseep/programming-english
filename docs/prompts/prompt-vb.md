# Visual Basic の英単語を列挙してください

## 目的

プログラミングで使う英語を学習するゲームの単語データを作成しています。
Visual Basic（VB.NET / VBA）の文脈で頻出する英単語を列挙してください。

## 対象

予約語だけでなく、以下も含めてください:

- 予約語・キーワード（module, function, sub, dim, public, private, shared, return, nothing, each, next, until, loop, step, exit, end など）
- データ型（string, integer, double, boolean, object, date, byte, long, single, decimal など）
- コレクション関連（collection, dictionary, array, list, range, cell, worksheet, workbook など）
- VBA/Office関連の頻出語（active, selection, value, property, method, event, handler など）
- エラー処理（error, resume, goto, raise など）
- よく使うメソッドの英単語部分（open, close, save, read, write, print, format, convert, replace, split, trim, length など）

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
