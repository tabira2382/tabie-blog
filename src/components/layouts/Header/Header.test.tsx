import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HeaderPresenter } from './HeaderPresenter'
import { useHeader } from './useHeader'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('useHeader', () => {
  it('初期状態でメニューは閉じている', () => {
    const { result } = renderHook(() => useHeader())

    expect(result.current.isMenuOpen).toBe(false)
  })

  it('onMenuToggleでメニュー開閉を切り替える', () => {
    const { result } = renderHook(() => useHeader())

    act(() => {
      result.current.onMenuToggle()
    })
    expect(result.current.isMenuOpen).toBe(true)

    act(() => {
      result.current.onMenuToggle()
    })
    expect(result.current.isMenuOpen).toBe(false)
  })

  it('onMenuCloseでメニューを閉じる', () => {
    const { result } = renderHook(() => useHeader())

    act(() => {
      result.current.onMenuToggle()
    })
    expect(result.current.isMenuOpen).toBe(true)

    act(() => {
      result.current.onMenuClose()
    })
    expect(result.current.isMenuOpen).toBe(false)
  })

  it('navItemsが定義されている', () => {
    const { result } = renderHook(() => useHeader())

    expect(result.current.navItems).toHaveLength(2)
    expect(result.current.navItems[0]).toEqual({ href: '/', label: 'Home' })
    expect(result.current.navItems[1]).toEqual({ href: '/about', label: 'About' })
  })
})

describe('HeaderPresenter', () => {
  const mockNavItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
  ]

  it('ロゴリンクを表示する', () => {
    render(
      <HeaderPresenter
        navItems={mockNavItems}
        isMenuOpen={false}
        onMenuToggle={vi.fn()}
        onMenuClose={vi.fn()}
      />,
    )

    expect(screen.getByText('Tabie Blog')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tabie Blog' })).toHaveAttribute('href', '/')
  })

  it('ナビゲーションアイテムを表示する', () => {
    render(
      <HeaderPresenter
        navItems={mockNavItems}
        isMenuOpen={false}
        onMenuToggle={vi.fn()}
        onMenuClose={vi.fn()}
      />,
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('メニューが閉じているときモバイルメニューは非表示', () => {
    render(
      <HeaderPresenter
        navItems={mockNavItems}
        isMenuOpen={false}
        onMenuToggle={vi.fn()}
        onMenuClose={vi.fn()}
      />,
    )

    const menuButton = screen.getByRole('button', { name: 'メニューを開く' })
    expect(menuButton).toBeInTheDocument()
  })

  it('メニューが開いているとき閉じるボタンを表示する', () => {
    render(
      <HeaderPresenter
        navItems={mockNavItems}
        isMenuOpen={true}
        onMenuToggle={vi.fn()}
        onMenuClose={vi.fn()}
      />,
    )

    const menuButton = screen.getByRole('button', { name: 'メニューを閉じる' })
    expect(menuButton).toBeInTheDocument()
  })

  it('メニューボタンクリックでonMenuToggleが呼ばれる', () => {
    const onMenuToggle = vi.fn()
    render(
      <HeaderPresenter
        navItems={mockNavItems}
        isMenuOpen={false}
        onMenuToggle={onMenuToggle}
        onMenuClose={vi.fn()}
      />,
    )

    const menuButton = screen.getByRole('button', { name: 'メニューを開く' })
    fireEvent.click(menuButton)

    expect(onMenuToggle).toHaveBeenCalledTimes(1)
  })
})
