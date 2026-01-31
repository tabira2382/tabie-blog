'use client'

import type { TocItem } from '@/features/blog/types'
import { TableOfContentsPresenter } from './TableOfContentsPresenter'
import { useTableOfContents } from './useTableOfContents'

type TableOfContentsContainerProps = {
  toc: TocItem[]
}

/**
 * 目次の Container コンポーネント
 * Hook を呼び出し、Presenter に渡す
 */
export function TableOfContentsContainer({ toc }: TableOfContentsContainerProps) {
  const { activeId, onClickItem } = useTableOfContents(toc)

  return <TableOfContentsPresenter toc={toc} activeId={activeId} onClickItem={onClickItem} />
}
