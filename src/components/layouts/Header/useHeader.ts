import { useCallback, useState } from 'react'

/** ナビゲーション項目の定義 */
const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
] as const

/**
 * Header コンポーネントの状態管理を行うカスタムフック
 * @returns navItems - ナビゲーション項目の配列
 * @returns isMenuOpen - モバイルメニューの開閉状態
 * @returns onMenuToggle - メニュー開閉をトグルする関数
 * @returns onMenuClose - メニューを閉じる関数
 */
export function useHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  return {
    navItems: NAV_ITEMS,
    isMenuOpen,
    onMenuToggle: handleMenuToggle,
    onMenuClose: handleMenuClose,
  }
}
