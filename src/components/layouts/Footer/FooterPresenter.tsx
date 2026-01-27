import Link from 'next/link'

type FooterPresenterProps = {
  currentYear: number
}

export function FooterPresenter({ currentYear }: FooterPresenterProps) {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Tabie Blog. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="https://github.com/tabira2382"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
