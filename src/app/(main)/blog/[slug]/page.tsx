import { notFound } from 'next/navigation'
import { getPostBySlug, getPostSlugs } from '@/features/blog'
import { PostDetailTemplate } from '@/features/blog/components/server/PostDetailTemplate'

type PostPageProps = {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params

  const post = getPostBySlug(slug)
  if (!post) {
    notFound()
  }

  return <PostDetailTemplate slug={slug} />
}

/**
 * 静的生成するパスを指定
 * ビルド時に全ての記事ページを事前生成する
 */
export async function generateStaticParams() {
  const slugs = getPostSlugs()

  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ''),
  }))
}
