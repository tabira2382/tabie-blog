# 個人開発ブログ プロジェクト設計書

## プロジェクト概要

技術ブログを Next.js App Router + TypeScript で構築する個人開発プロジェクト。
現場で通用する設計力を身につけることを目的とし、以下の設計方針を採用する。

### 目的
- 技術ノウハウの発信
- App Router / Server Components の実践的なアウトプット
- 現場で評価される設計パターンの習得

### 参考アーキテクチャ
1. **Bulletproof React** - 設計原則・考え方
   - https://github.com/alan2207/bulletproof-react
2. **Next.js App Router Architecture** - App Router実装パターン
   - https://github.com/YukiOnishi1129/next-app-router-architecture
   - https://zenn.dev/yukionishi/articles/cd79e39ea6c172

---

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript (strict mode) |
| スタイリング | Tailwind CSS v4 + shadcn/ui (new-york) |
| アイコン | lucide-react |
| コンテンツ | MDX (ローカルファイル管理) |
| MDX処理 | next-mdx-remote + gray-matter + shiki |
| テスト | Vitest + Testing Library + Playwright |
| Lint/Format | Biome |
| Git Hooks | Lefthook |
| パッケージ管理 | pnpm |
| ドキュメント | Storybook (必要に応じて) |
| ホスティング | Vercel |
| CI/CD | GitHub Actions |

---

## ディレクトリ構造

```
/
├── .github/
│   └── workflows/           # GitHub Actions
│       └── ci.yml
├── src/
│   ├── app/                      # App Router (薄く保つ)
│   │   ├── (main)/              # メインコンテンツ Route Group
│   │   │   ├── blog/
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── layout.tsx           # Root Layout
│   │   ├── page.tsx             # Home
│   │   └── providers.tsx        # Global Providers
│   │
│   ├── features/                 # 機能単位モジュール ⭐重要
│   │   ├── blog/
│   │   │   ├── components/
│   │   │   │   ├── server/      # Server Components
│   │   │   │   │   ├── PostListTemplate.tsx
│   │   │   │   │   └── PostDetailTemplate.tsx
│   │   │   │   └── client/      # Client Components
│   │   │   │       ├── SearchForm/
│   │   │   │       │   ├── SearchFormContainer.tsx
│   │   │   │       │   ├── SearchFormPresenter.tsx
│   │   │   │       │   └── index.ts
│   │   │   │       └── TableOfContents/
│   │   │   ├── lib/             # 機能固有のユーティリティ
│   │   │   │   ├── mdx.ts       # MDX処理
│   │   │   │   └── posts.ts     # 記事取得ロジック
│   │   │   ├── types/           # 機能固有の型定義
│   │   │   │   └── index.ts
│   │   │   └── index.ts         # Public API (re-export)
│   │   │
│   │   └── profile/
│   │       ├── components/
│   │       └── types/
│   │
│   ├── components/               # 共通UIコンポーネント
│   │   ├── ui/                  # 基礎UIパーツ (shadcn/ui)
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Card/
│   │   │   ├── Badge/
│   │   │   └── ...
│   │   └── layouts/             # レイアウト系
│   │       ├── Header/
│   │       ├── Footer/
│   │       └── Sidebar/
│   │
│   ├── lib/                      # 共通ライブラリ
│   │   ├── utils.ts             # cn(), formatDate() など
│   │   └── constants.ts         # 定数
│   │
│   ├── types/                    # 共通型定義
│   │   └── index.ts
│   │
│   └── styles/                   # グローバルスタイル
│       └── globals.css
│
├── content/                      # MDXコンテンツ (src外)
│   └── posts/
│       ├── first-post.mdx
│       └── second-post.mdx
│
├── biome.json                    # Biome設定
├── commitlint.config.js          # commitlint設定
├── components.json               # shadcn/ui設定
├── lefthook.yml                  # Git Hooks設定
├── next.config.ts                # Next.js設定
├── tsconfig.json                 # TypeScript設定
├── vitest.config.ts              # Vitest設定
├── playwright.config.ts          # Playwright設定
└── package.json
# Note: Tailwind CSS v4 はCSS-first設定のため tailwind.config.ts 不要
```

---

## 設計原則

### 1. 単方向依存の原則

コードの依存方向を一方向に保つ。

```
┌─────────────────────────────────────────────┐
│  shared (components, lib, types)            │ ← 依存なし
└─────────────────────────────────────────────┘
                    ↓ 参照可能
┌─────────────────────────────────────────────┐
│  features (blog, profile...)                │ ← sharedのみ参照可
└─────────────────────────────────────────────┘
                    ↓ 参照可能
┌─────────────────────────────────────────────┐
│  app (routes, pages)                        │ ← features + shared参照可
└─────────────────────────────────────────────┘
```

**禁止事項:**
- `features/` 間の相互参照
- `components/` から `features/` への参照
- `app/` から `lib/` の直接的なビジネスロジック呼び出し

### 2. app/ は薄く保つ

`app/` ディレクトリはルーティングとメタデータのみを担当。
ビジネスロジックは `features/` に委譲する。

```tsx
// ✅ Good: app/blog/[slug]/page.tsx
import { PostDetailTemplate } from '@/features/blog/components/server/PostDetailTemplate'

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  return <PostDetailTemplate slug={slug} />
}

// ❌ Bad: app/でデータフェッチやロジックを書かない
export default async function PostPage({ params }) {
  const post = await getPost(params.slug) // NG: features層に委譲すべき
  return <div>{post.title}</div>
}
```

### 3. Server/Client 境界の明確化

#### Server Components (デフォルト)
- データフェッチ
- 静的なUI
- `features/*/components/server/` に配置

#### Client Components ('use client')
- インタラクション（クリック、入力）
- useState, useEffect の使用
- `features/*/components/client/` に配置

```tsx
// features/blog/components/server/PostListTemplate.tsx
// Server Component - データフェッチを行う
export async function PostListTemplate() {
  const posts = await getPosts()
  return (
    <section>
      <h1>記事一覧</h1>
      <PostList posts={posts} />  {/* Client Component */}
    </section>
  )
}

// features/blog/components/client/PostList/PostListPresenter.tsx
'use client'
// Client Component - インタラクションを担当
export function PostListPresenter({ posts }: Props) {
  return (
    <ul>
      {posts.map(post => <li key={post.slug}>{post.title}</li>)}
    </ul>
  )
}
```

### 4. Container / Presenter パターン

Client Components は責務を分離する。

```
components/client/SearchForm/
├── SearchFormContainer.tsx   # Hook呼び出し、状態管理
├── SearchFormPresenter.tsx   # 純粋な描画（JSXのみ）
├── useSearchForm.ts          # カスタムフック
├── SearchForm.test.tsx       # テスト
└── index.ts                  # バレルエクスポート
```

```tsx
// Container: データを集める
'use client'
export function SearchFormContainer() {
  const { query, setQuery, handleSubmit } = useSearchForm()
  return <SearchFormPresenter query={query} onQueryChange={setQuery} onSubmit={handleSubmit} />
}

// Presenter: 描画のみ
export function SearchFormPresenter({ query, onQueryChange, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit}>
      <input value={query} onChange={(e) => onQueryChange(e.target.value)} />
      <button type="submit">検索</button>
    </form>
  )
}
```

### 5. Colocation（関連ファイルを近くに配置）

テスト、型定義、スタイルは対象ファイルと同じ場所に置く。

```
features/blog/components/client/PostCard/
├── PostCard.tsx
├── PostCard.test.tsx      # テストは隣に
├── PostCard.stories.tsx   # Storybookも隣に（使用時）
└── index.ts
```

---

## コンポーネント設計

### 命名規則

| 種類 | 命名 | 例 |
|------|------|-----|
| Server Template | `*Template.tsx` | `PostListTemplate.tsx` |
| Container | `*Container.tsx` | `SearchFormContainer.tsx` |
| Presenter | `*Presenter.tsx` | `SearchFormPresenter.tsx` |
| カスタムフック | `use*.ts` | `useSearchForm.ts` |
| 型定義 | `types/index.ts` または `*.types.ts` | - |
| ユーティリティ | `*.ts` (lib/配下) | `utils.ts`, `posts.ts` |

### ファイル命名

- **コンポーネント**: PascalCase (`PostCard.tsx`)
- **フック/ユーティリティ**: camelCase (`useSearchForm.ts`, `utils.ts`)
- **ディレクトリ**: kebab-case (`post-card/`) または PascalCase (`PostCard/`)

### インポートパス

絶対パスを使用する（`@/` エイリアス）

```tsx
// ✅ Good
import { Button } from '@/components/ui/button'
import { PostCard } from '@/features/blog/components/client/PostCard'

// ❌ Bad
import { Button } from '../../../components/ui/button'
```

---

## コーディング規約

### TypeScript

```typescript
// 型は明示的に定義
type Post = {
  slug: string
  title: string
  content: string
  publishedAt: Date
  tags: string[]
}

// Props型は型エイリアスで定義
type PostCardProps = {
  post: Post
  onTagClick?: (tag: string) => void
}

// 関数コンポーネントの書き方
export function PostCard({ post, onTagClick }: PostCardProps) {
  // ...
}
```

### エクスポート

```typescript
// index.ts でバレルエクスポート
export { PostCard } from './PostCard'
export type { PostCardProps } from './PostCard'

// default export は使わない（named export を推奨）
// ただし app/ 内の page.tsx, layout.tsx は例外
```

### 禁止事項

- `any` 型の使用
- `// @ts-ignore` の使用
- `console.log` の本番コードへの残存
- インラインスタイルの多用（Tailwind を使用）

---

## MDX コンテンツ管理

### ファイル構造

```
content/posts/
├── 2024-01-01-first-post.mdx
├── 2024-01-15-second-post.mdx
└── ...
```

### Frontmatter

```mdx
---
title: "記事タイトル"
description: "記事の説明文"
publishedAt: "2024-01-01"
updatedAt: "2024-01-05"
tags: ["Next.js", "React", "TypeScript"]
published: true
---

# 記事本文

ここに本文を書く...
```

### 型定義

```typescript
// features/blog/types/index.ts
export type PostFrontmatter = {
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  tags: string[]
  published: boolean
}

export type Post = PostFrontmatter & {
  slug: string
  content: string
}
```

---

## 開発ツール設定

### Biome 設定

```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/latest/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noExcessiveCognitiveComplexity": "warn"
      },
      "suspicious": {
        "noConsoleLog": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded"
    }
  },
  "files": {
    "ignore": [
      "node_modules",
      ".next",
      "dist",
      "coverage",
      "*.min.js"
    ]
  }
}
```

### Lefthook 設定

```yaml
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    biome:
      run: pnpm biome check --write --staged --files-ignore-unknown=true --no-errors-on-unmatched
      stage_fixed: true
    typecheck:
      glob: "*.{ts,tsx}"
      run: pnpm tsc --noEmit

pre-push:
  commands:
    test:
      run: pnpm test --run
    build:
      run: pnpm build

commit-msg:
  commands:
    commitlint:
      run: pnpm commitlint --edit {1}
```

### commitlint 設定

```js
// commitlint.config.js
export default { extends: ['@commitlint/config-conventional'] }
```

**必要な依存関係:**
```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

### shadcn/ui 設定

```json
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

### Tailwind CSS v4 設定 (CSS-first)

```css
/* src/styles/globals.css */
@import "tailwindcss";
@import "tw-animate-css";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  /* shadcn/ui のテーマ変数はここで定義 */
}
```

### pnpm スクリプト

```json
// package.json (scripts)
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "storybook": "storybook dev -p 6006",
    "prepare": "lefthook install"
  }
}
```

---

## Git コミット規約

Conventional Commits を使用する。

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

| Type | 説明 |
|------|------|
| feat | 新機能 |
| fix | バグ修正 |
| docs | ドキュメント |
| style | フォーマット（コードの意味に影響しない） |
| refactor | リファクタリング |
| test | テスト |
| chore | ビルド、補助ツール |

### 例

```
feat(blog): 記事一覧ページを実装

- PostListTemplate の作成
- PostCard コンポーネントの作成
- MDX からの記事取得ロジックの実装

Refs: #123
```

---

## 開発フロー

### 新機能追加時のチェックリスト

1. [ ] 適切な `features/` ディレクトリに配置
2. [ ] Server/Client の境界を明確に
3. [ ] Container/Presenter パターンを適用（Client の場合）
4. [ ] 型定義を作成
5. [ ] テストを作成（隣に配置）
6. [ ] `index.ts` でエクスポート
7. [ ] 絶対パスでインポート

### 新ページ追加時のチェックリスト

1. [ ] `app/` に page.tsx を作成（薄く）
2. [ ] `features/` に Template コンポーネントを作成
3. [ ] metadata を定義
4. [ ] loading.tsx / error.tsx を必要に応じて追加

---

## 参考リソース

### 必読ドキュメント

- [Bulletproof React - Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
- [Bulletproof React - Components and Styling](https://github.com/alan2207/bulletproof-react/blob/master/docs/components-and-styling.md)
- [Next.js App Router Architecture 記事](https://zenn.dev/yukionishi/articles/cd79e39ea6c172)

### リポジトリ

- https://github.com/alan2207/bulletproof-react
- https://github.com/YukiOnishi1129/next-app-router-architecture

---

## 注意事項

- この設計書は開発の指針であり、状況に応じて柔軟に対応すること
- 過度な抽象化は避け、シンプルさを保つ
- 迷った場合は「将来の変更に強いか？」を基準に判断