import { getAllPosts } from '@/features/blog'
import { PostCard } from '../client/PostCard'

/**
 * ブログ記事一覧を表示する
 */
export function PostListTemplate() {
  const posts = getAllPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-bold text-3xl">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">記事がありません。</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
