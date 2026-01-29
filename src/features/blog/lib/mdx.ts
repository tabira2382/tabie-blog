import { compileMDX } from 'next-mdx-remote/rsc'
import type { Post } from '../types'

/**
 * MDX コンテンツをコンパイルしてReactコンポーネントに変換する
 * @param post - 記事データ
 * @returns コンパイル済みのMDXコンテンツ
 */

export async function compileMdxContent(post: Post) {
  const { content } = await compileMDX({
    source: post.content,
    options: {
      parseFrontmatter: false,
    },
  })

  return content
}
