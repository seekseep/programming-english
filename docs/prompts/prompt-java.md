# Java の英単語を列挙してください

## 目的

プログラミングで使う英語を学習するゲームの単語データを作成しています。
Java の文脈で頻出する英単語を列挙してください。

## 対象

予約語だけでなく、以下も含めてください:

- 予約語・キーワード（class, interface, extends, implements, abstract, final, static, return, throw, catch, switch, case など）
- アクセス修飾子（public, private, protected）
- 標準ライブラリの頻出語（string, list, array, map, set, stream, collection, iterator, optional, thread, exception など）
- よく使うメソッド名の英単語部分（get, set, put, add, remove, contains, equals, compare, sort, find, replace など）
- アノテーション関連（override, deprecated, suppress, nullable など）
- デザインパターン関連でよく見る語（factory, builder, singleton, observer, adapter, strategy など）

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
