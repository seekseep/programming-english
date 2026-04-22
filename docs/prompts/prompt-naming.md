# 命名で使う英単語を列挙してください

## 目的

プログラミングで使う英語を学習するゲームの単語データを作成しています。
変数名・関数名・クラス名・プロパティ名など、命名で頻出する英単語を列挙してください。

## 対象

以下のような、命名でよく見る英単語を含めてください:

- 状態を表す語（active, pending, completed, visible, hidden, enabled, disabled など）
- 役割を表す語（handler, manager, service, repository, factory, provider など）
- データのまとまりを表す語（item, list, group, record, history, summary, detail など）
- 操作や処理を表す語（create, update, delete, validate, calculate, convert, merge, split など）
- 範囲や優先度を表す語（current, previous, next, primary, secondary, default, optional など）
- 設定や保持に関する語（setting, profile, session, cache, backup, version, schema など）

## ルール

- 1文字や2文字の単語（if, as, in, do など）は除外する
- 略語（var, func, int, config, auth など）は除外する
- 英語として意味のある単語のみ（造語やライブラリ固有の名前は除外）
- 同じ単語が複数の意味を持つ場合、命名やプログラミング文脈での意味を優先する
- 最低50個、できれば100個以上を目標にする

## 出力形式

JSON配列で出力してください。他のテキストは不要です。

```json
[
  { "word": "visible", "meaning": "見える、表示される" },
  { "word": "enable", "meaning": "有効にする" }
]
```
