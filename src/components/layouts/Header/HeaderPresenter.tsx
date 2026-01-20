import Link from 'next/link'
import { Menu, X } from 'lucide-react'

type NavItem = {
  href: string
  label: string
}

type HeaderPresenterProps = {
  navItems: NavItem[]
  isMenuOpen: boolean
  onMenuToggle: () => void
  onMenuClose: () => void
}

export function HeaderPresenter({
  navItems,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
}: HeaderPresenterProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          Tabie Blog
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
          onClick={onMenuToggle}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-border/40 md:hidden">
          <ul className="mx-auto max-w-4xl space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={onMenuClose}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}