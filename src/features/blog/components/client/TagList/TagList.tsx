import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

type TagListProps = {
  tags: Map<string, number>
}

/**
 * タグ一覧を表示するコンポーネント
 */
export function TagList({ tags }: TagListProps) {
  const tagEntries = Array.from(tags.entries())

  return (
    <div className="flex flex-wrap gap-2">
      {tagEntries.map(([tag, count]) => (
        <Link key={tag} href={`/blog/tags/${tag}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">
            {tag} ({count})
          </Badge>
        </Link>
      ))}
    </div>
  )
}
