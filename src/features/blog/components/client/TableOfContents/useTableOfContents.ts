'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '@/features/blog/types'

/**
 * 目次のスクロール追従を管理するカスタムフック
 * @param toc - 目次アイテムの配列
 * @returns activeId - 現在アクティブな見出しのID
 * @returns onClickItem - 見出しクリック時のハンドラ
 */

export function useTableOfContents(toc: TocItem[]) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      },
    )

    for (const item of toc) {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    }

    return () => observer.disconnect()
  }, [toc])

  const onClickItem = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return { activeId, onClickItem }
}
