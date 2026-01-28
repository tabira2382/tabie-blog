# Claude Code プロジェクト設定

## 設計ドキュメント

このプロジェクトの設計方針は以下を参照してください：

- `docs/architecture.md` - アーキテクチャ設計書（必読）
- `docs/nextjs-best-practices.md` - Next.js ベストプラクティス

## 開発ルール

### 学習モード

ユーザーが「学習モードをONにします」と言った場合：
- コードをファイルに書き込まない
- ユーザーが手動でコードを入力する
- 「チェック」と言われたらファイルを読んで確認する

### コミット

- コミットメッセージは日本語で記述
- Conventional Commits 形式を使用
- commitlint のルールに従う（PascalCase は避ける）

### コーディング規約

- JSDoc: カスタムフック、ユーティリティ関数には JSDoc を記述
- 型定義: Props は型エイリアスで定義
- Container/Presenter パターン: Client Components に適用

## 技術スタック

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4 + shadcn/ui
- Biome (Lint/Format)
- Lefthook (Git Hooks)
- pnpm
