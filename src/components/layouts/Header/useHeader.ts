import { useCallback, useState } from 'react'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
] as const

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
