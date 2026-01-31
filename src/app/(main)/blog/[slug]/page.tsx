import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPostSlugs } from '@/features/blog'
import { PostDetailTemplate } from '@/features/blog/components/server/PostDetailTemplate'

type PostPageProps = {
  params: Promise<{ slug: string }>
}

/**
 * 記事ごとのメタデータを動的に生成する
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
    },
  }
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
