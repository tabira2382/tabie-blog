export type PostFrontmatter = {
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  tags: string[]
  published: boolean
}

export type Post = PostFrontmatter & {
  slug: string
  content: string
}
