import type { TocItem } from '@/features/blog/types'
import { cn } from '@/lib/utils'

type TableOfContentsPresenterProps = {
  toc: TocItem[]
  activeId: string
  onClickItem: (id: string) => void
}

/**
 * 目次の見た目を担当する Presenter コンポーネント
 */
export function TableOfContentsPresenter({
  toc,
  activeId,
  onClickItem,
}: TableOfContentsPresenterProps) {
  if (toc.length === 0) {
    return null
  }

  return (
    <nav className="space-y-1">
      <p className="mb-4 font-semibold text-sm">目次</p>
      <ul className="space-y-2 text-sm">
        {toc.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
            <button
              type="button"
              onClick={() => onClickItem(item.id)}
              className={cn(
                'text-left text-muted-foreground transition-colors hover:text-foreground',
                activeId === item.id && 'font-medium text-foreground',
              )}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
