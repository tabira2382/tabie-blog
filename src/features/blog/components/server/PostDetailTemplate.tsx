import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { compileMdxContent, getPostBySlug } from '@/features/blog'
import { extractToc } from '@/features/blog/lib/mdx'
import { TableOfContentsContainer } from '../client/TableOfContents'

type PostDetailTemplateProps = {
  slug: string
}

/**
 * ブログ記事詳細を表示する
 */
export async function PostDetailTemplate({ slug }: PostDetailTemplateProps) {
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const content = await compileMdxContent(post)
  const toc = extractToc(post.content)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_250px]">
        <article>
          <header className="mb-8">
            <h1 className="mb-4 font-bold text-4xl">{post.title}</h1>
            <div className="mb-4 flex items-center gap-4 text-muted-foreground text-sm">
              <time>{post.publishedAt}</time>
              {post.updatedAt && <span>（更新: {post.updatedAt}）</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none">{content}</div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <TableOfContentsContainer toc={toc} />
          </div>
        </aside>
      </div>
    </div>
  )
}
