import { notFound } from 'next/navigation'
import { getAllTags, getPostsByTag } from '@/features/blog'
import { PostCard } from '@/features/blog/components/client/PostCard'

type TagPageProps = {
  params: Promise<{ tag: string }>
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const posts = getPostsByTag(decodedTag)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-bold text-3xl">
        タグ: {decodedTag}
        <span className="ml-2 text-muted-foreground text-lg">({posts.length}件)</span>
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}

/**
 * 静的生成するパスを指定
 */
export async function generateStaticParams() {
  const tags = getAllTags()

  return Array.from(tags.keys()).map((tag) => ({
    tag: tag,
  }))
}
