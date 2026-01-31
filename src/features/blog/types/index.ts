/** 記事のフロントマター（メタデータ）の型 */
export type PostFrontmatter = {
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  tags: string[]
  published: boolean
}

/** 記事全体の型 */
export type Post = PostFrontmatter & {
  slug: string
  content: string
}

/** 目次アイテムの型 */
export type TocItem = {
  id: string
  text: string
  level: number
}
