'use client'

import { HeaderPresenter } from './HeaderPresenter'
import { useHeader } from './useHeader'

export function HeaderContainer() {
  const { navItems, isMenuOpen, onMenuToggle, onMenuClose } = useHeader()

  return (
    <HeaderPresenter
      navItems={[...navItems]}
      isMenuOpen={isMenuOpen}
      onMenuToggle={onMenuToggle}
      onMenuClose={onMenuClose}
    />
  )
}
