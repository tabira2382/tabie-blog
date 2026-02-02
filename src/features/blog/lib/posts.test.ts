import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// fsモジュールをモック
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
  },
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  readFileSync: vi.fn(),
}))

import fs from 'fs'
import { getAllPosts, getAllTags, getPostBySlug, getPostSlugs, getPostsByTag } from './posts'

const mockFrontmatter = (overrides: Record<string, unknown> = {}) => {
  const defaults = {
    title: 'テスト記事',
    description: 'テストの説明',
    publishedAt: '2025-01-15',
    tags: ['React', 'TypeScript'],
    published: true,
  }
  const merged = { ...defaults, ...overrides }
  return `---
title: "${merged.title}"
description: "${merged.description}"
publishedAt: "${merged.publishedAt}"
tags: ${JSON.stringify(merged.tags)}
published: ${merged.published}
---
本文です。`
}

describe('getPostSlugs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('存在するディレクトリからMDXファイル一覧を取得する', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readdirSync).mockReturnValue([
      'post1.mdx',
      'post2.mdx',
      'post3.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>)

    const result = getPostSlugs()

    expect(result).toEqual(['post1.mdx', 'post2.mdx', 'post3.mdx'])
  })

  it('ディレクトリが存在しない場合は空配列を返す', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    const result = getPostSlugs()

    expect(result).toEqual([])
  })

  it('.mdx以外のファイルは除外する', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readdirSync).mockReturnValue([
      'post1.mdx',
      'readme.md',
      'image.png',
      'post2.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>)

    const result = getPostSlugs()

    expect(result).toEqual(['post1.mdx', 'post2.mdx'])
  })
})

describe('getPostBySlug', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('slugから記事を取得する', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(mockFrontmatter())

    const result = getPostBySlug('test-post')

    expect(result).not.toBeNull()
    expect(result?.slug).toBe('test-post')
    expect(result?.title).toBe('テスト記事')
    expect(result?.description).toBe('テストの説明')
    expect(result?.tags).toEqual(['React', 'TypeScript'])
  })

  it('.mdx付きのslugも処理できる', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(mockFrontmatter())

    const result = getPostBySlug('test-post.mdx')

    expect(result).not.toBeNull()
    expect(result?.slug).toBe('test-post')
  })

  it('存在しない記事はnullを返す', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    const result = getPostBySlug('non-existent')

    expect(result).toBeNull()
  })
})

describe('getAllPosts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('公開記事のみを返す', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readdirSync).mockReturnValue([
      'published.mdx',
      'unpublished.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>)
    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      if (String(filePath).includes('unpublished')) {
        return mockFrontmatter({ published: false })
      }
      return mockFrontmatter()
    })

    const result = getAllPosts()

    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe('published')
  })

  it('公開日の降順でソートされる', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readdirSync).mockReturnValue([
      'old.mdx',
      'new.mdx',
      'middle.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>)
    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      const path = String(filePath)
      if (path.includes('old')) {
        return mockFrontmatter({ publishedAt: '2025-01-01' })
      }
      if (path.includes('new')) {
        return mockFrontmatter({ publishedAt: '2025-01-30' })
      }
      return mockFrontmatter({ publishedAt: '2025-01-15' })
    })

    const result = getAllPosts()

    expect(result).toHaveLength(3)
    expect(result[0].slug).toBe('new')
    expect(result[1].slug).toBe('middle')
    expect(result[2].slug).toBe('old')
  })
})

describe('getAllTags', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('全記事のタグと出現回数を集計する', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readdirSync).mockReturnValue(['post1.mdx', 'post2.mdx'] as unknown as ReturnType<
      typeof fs.readdirSync
    >)
    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      if (String(filePath).includes('post1')) {
        return mockFrontmatter({ tags: ['React', 'TypeScript'] })
      }
      return mockFrontmatter({ tags: ['React', 'Next.js'] })
    })

    const result = getAllTags()

    expect(result.get('React')).toBe(2)
    expect(result.get('TypeScript')).toBe(1)
    expect(result.get('Next.js')).toBe(1)
  })
})

describe('getPostsByTag', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('指定タグを持つ記事のみを返す', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readdirSync).mockReturnValue([
      'react-post.mdx',
      'vue-post.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>)
    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      if (String(filePath).includes('react')) {
        return mockFrontmatter({ tags: ['React'] })
      }
      return mockFrontmatter({ tags: ['Vue'] })
    })

    const result = getPostsByTag('React')

    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe('react-post')
  })

  it('該当なしの場合は空配列を返す', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readdirSync).mockReturnValue(['post.mdx'] as unknown as ReturnType<
      typeof fs.readdirSync
    >)
    vi.mocked(fs.readFileSync).mockReturnValue(mockFrontmatter({ tags: ['React'] }))

    const result = getPostsByTag('Angular')

    expect(result).toEqual([])
  })
})
