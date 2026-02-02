import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Post } from '@/features/blog'
import { PostCard } from './PostCard'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockPost: Post = {
  slug: 'test-post',
  title: 'テスト記事のタイトル',
  description: 'これはテスト記事の説明です。',
  publishedAt: '2025-01-15',
  tags: ['React', 'TypeScript'],
  published: true,
  content: '本文',
}

describe('PostCard', () => {
  it('記事タイトルを表示する', () => {
    render(<PostCard post={mockPost} />)

    expect(screen.getByText('テスト記事のタイトル')).toBeInTheDocument()
  })

  it('公開日を表示する', () => {
    render(<PostCard post={mockPost} />)

    expect(screen.getByText('2025-01-15')).toBeInTheDocument()
  })

  it('説明文を表示する', () => {
    render(<PostCard post={mockPost} />)

    expect(screen.getByText('これはテスト記事の説明です。')).toBeInTheDocument()
  })

  it('タグをBadgeとして表示する', () => {
    render(<PostCard post={mockPost} />)

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('記事詳細ページへのリンクを持つ', () => {
    render(<PostCard post={mockPost} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/blog/test-post')
  })

  it('タグがない場合でも正常にレンダリングされる', () => {
    const postWithoutTags: Post = {
      ...mockPost,
      tags: [],
    }
    render(<PostCard post={postWithoutTags} />)

    expect(screen.getByText('テスト記事のタイトル')).toBeInTheDocument()
  })
})
