import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import type { Post, TocItem } from '../types'

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
      mdxOptions: {
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: 'github-dark',
              keepBackground: true,
            },
          ],
        ],
      },
    },
  })

  return content
}

/**
 * MDXコンテンツから見出し（h2, h3）を抽出する
 * @param content - MDXコンテンツ文字列
 * @returns 目次アイテムの配列
 */
export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const matches = [...content.matchAll(headingRegex)]

  return matches.map((match) => {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF-]/g, '')

    return { id, text, level }
  })
}
