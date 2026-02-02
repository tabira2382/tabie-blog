# Tabie Blog

![CI](https://github.com/tabira2382/tabie-blog/actions/workflows/ci.yml/badge.svg)

技術ノウハウを発信するための個人技術ブログ。Next.js App Router + MDX で構築。

**サイトURL**: https://tabie-blog.vercel.app/blog

## 目次

- [機能](#機能)
- [技術スタック](#技術スタック)
- [アーキテクチャ](#アーキテクチャ)
- [開発環境構築](#開発環境構築)
- [コマンド一覧](#コマンド一覧)
- [ディレクトリ構成](#ディレクトリ構成)
- [記事の書き方](#記事の書き方)
- [テスト](#テスト)
- [設計ドキュメント](#設計ドキュメント)
- [ライセンス](#ライセンス)

## 機能

- **MDX ベースの記事管理** - ローカルファイルでコンテンツ管理（CMS 不要）
- **シンタックスハイライト** - Shiki + rehype-pretty-code による美しいコード表示
- **タグ機能** - 記事をカテゴリ分け
- **目次自動生成** - 記事の見出しから目次を自動生成
- **レスポンシブデザイン** - Tailwind CSS v4 + shadcn/ui
- **SEO 最適化** - Next.js Metadata API 活用

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript (strict mode) |
| スタイリング | Tailwind CSS v4 + shadcn/ui (new-york) |
| アイコン | lucide-react |
| コンテンツ | MDX (next-mdx-remote + gray-matter + shiki) |
| テスト | Vitest + Testing Library + Playwright |
| Lint/Format | Biome |
| Git Hooks | Lefthook + commitlint |
| パッケージ管理 | pnpm |
| ホスティング | Vercel |
| CI/CD | GitHub Actions |

## アーキテクチャ

このプロジェクトは [Bulletproof React](https://github.com/alan2207/bulletproof-react) と [Next.js App Router Architecture](https://github.com/YukiOnishi1129/next-app-router-architecture) を参考に設計しています。

### 主な設計方針

- **単方向依存** - `shared` → `features` → `app` の依存方向を厳守
- **app/ は薄く保つ** - ルーティングとメタデータのみ。ビジネスロジックは features へ
- **Server/Client 境界の明確化** - ディレクトリで分離
- **Container/Presenter パターン** - Client Components に適用

詳細は [docs/architecture.md](./docs/architecture.md) を参照してください。

## 開発環境構築

### 必要要件

- Node.js 20.x 以上
- pnpm 10.x 以上

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/tabira2382/tabie-blog.git
cd tabie-blog

# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev
```

http://localhost:3000 で確認できます。

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバーを起動 |
| `pnpm build` | プロダクションビルド |
| `pnpm start` | プロダクションサーバーを起動 |
| `pnpm lint` | Biome でコードをチェック |
| `pnpm lint:fix` | Biome で自動修正 |
| `pnpm format` | Biome でフォーマット |
| `pnpm test` | Vitest でテストを実行（watch モード） |
| `pnpm test:run` | Vitest でテストを 1 回実行 |
| `pnpm test:coverage` | カバレッジレポートを生成 |
| `pnpm test:e2e` | Playwright で E2E テストを実行 |

## ディレクトリ構成

```
├── .github/workflows/     # GitHub Actions 設定
├── content/posts/         # MDX 記事ファイル
├── docs/                  # 設計ドキュメント
├── e2e/                   # E2E テスト（Playwright）
├── public/                # 静的ファイル
└── src/
    ├── app/               # App Router（ルーティングのみ）
    ├── components/        # 共通コンポーネント
    │   ├── layouts/       # Header, Footer など
    │   └── ui/            # shadcn/ui コンポーネント
    ├── features/          # 機能単位モジュール
    │   ├── blog/          # ブログ機能
    │   └── profile/       # プロフィール機能
    ├── lib/               # ユーティリティ
    ├── styles/            # グローバルスタイル
    └── types/             # 共通型定義
```

## 記事の書き方

`content/posts/` に MDX ファイルを作成します。

### ファイル形式

```mdx
---
title: "記事タイトル"
description: "記事の説明文"
publishedAt: "2025-01-01"
tags: ["Next.js", "React"]
published: true
---

# 記事本文

ここに Markdown + JSX を記述...
```

### Frontmatter

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| title | string | Yes | 記事タイトル |
| description | string | Yes | 記事の説明（SEO 用） |
| publishedAt | string | Yes | 公開日（YYYY-MM-DD） |
| tags | string[] | Yes | タグの配列 |
| published | boolean | Yes | `true` で公開、`false` で下書き |

## テスト

### 単体テスト（Vitest）

```bash
# テスト実行（watch モード）
pnpm test

# 1 回だけ実行
pnpm test:run

# カバレッジ付き
pnpm test:coverage
```

### E2E テスト（Playwright）

```bash
# E2E テスト実行
pnpm test:e2e

# UI モードで実行
pnpm exec playwright test --ui
```

### テストファイル配置

テストファイルは対象ファイルと同じディレクトリに配置（Colocation）。

```
src/features/blog/components/client/PostCard/
├── PostCard.tsx
├── PostCard.test.tsx  # ← ここにテスト
└── index.ts
```

## 設計ドキュメント

| ドキュメント | 説明 |
|-------------|------|
| [architecture.md](./docs/architecture.md) | アーキテクチャ設計書（必読） |
| [nextjs-best-practices.md](./docs/nextjs-best-practices.md) | Next.js ベストプラクティス集 |
| [CLAUDE.md](./CLAUDE.md) | Claude Code 用プロジェクト設定 |

## ライセンス

MIT License
