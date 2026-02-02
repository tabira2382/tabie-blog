import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FooterPresenter } from './FooterPresenter'

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    target,
    rel,
  }: {
    children: React.ReactNode
    href: string
    target?: string
    rel?: string
  }) => (
    <a href={href} target={target} rel={rel}>
      {children}
    </a>
  ),
}))

describe('FooterPresenter', () => {
  it('著作権表示に渡された年を表示する', () => {
    render(<FooterPresenter currentYear={2025} />)

    expect(screen.getByText(/© 2025 Tabie Blog/)).toBeInTheDocument()
  })

  it('Privacyリンクを表示する', () => {
    render(<FooterPresenter currentYear={2025} />)

    const privacyLink = screen.getByRole('link', { name: 'Privacy' })
    expect(privacyLink).toHaveAttribute('href', '/privacy')
  })

  it('GitHubリンクを外部リンクとして表示する', () => {
    render(<FooterPresenter currentYear={2025} />)

    const githubLink = screen.getByRole('link', { name: 'GitHub' })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/tabira2382')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
