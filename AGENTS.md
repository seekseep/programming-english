# AGENTS.md

## プロジェクト概要

プログラミングで使う英語を学習するブラウザゲーム。
ステージクリアでポイントを獲得し、アバターを育てて着せ替えを楽しむ。

## 技術スタック

- TanStack Start + React + Tailwind CSS
- データ永続化: localStorage
- デプロイ: Cloudflare Pages
- パッケージマネージャー: npm

## コーディング規約

- TypeScript を使用
- パスエイリアス: `#/*` → `./src/*`
- フォーマット: Prettier + ESLint
- テスト: Vitest + Testing Library

## エージェントへの指示

- ユーザーから指摘・修正を受けた内容はメモリに保存すること
- 設計ドキュメントは `docs/` 配下に配置
- アセット作成ツールは `scripts/` 配下に配置
- ブラウザで完結するアプリケーションとして構築する（サーバーサイドのデータ保存は不要）
