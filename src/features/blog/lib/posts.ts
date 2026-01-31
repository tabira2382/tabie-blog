import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import type { Post, PostFrontmatter } from '../types'

const postsDirectory = path.join(process.cwd(), 'content/posts')

/**
 * content/posts/ ディレクトリから全ての MDX ファイル名を取得する
 * @returns MDX ファイル名の配列（例: ['first-post.mdx', 'second-post.mdx']）
 */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.mdx'))
}

/**
 * slug から記事データを取得する
 * @param slug - 記事の slug（ファイル名から .mdx を除いたもの）
 * @returns 記事データ、存在しない場合は null
 */
export function getPostBySlug(slug: string): Post | null {
  const realSlug = slug.replace(/\.mdx$/, '')
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const frontmatter = data as PostFrontmatter

  return {
    slug: realSlug,
    content,
    ...frontmatter,
  }
}

/**
 * 全ての公開記事を取得する（公開日の降順でソート）
 * @returns 公開記事の配列
 */
export function getAllPosts(): Post[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null && post.published)
    .sort((a, b) => (a.publishedAt > b.publishedAt ? -1 : 1))

  return posts
}

/**
 * 全ての記事から使用されているタグを取得する
 * @returns タグと記事数のマップ
 */
export function getAllTags(): Map<string, number> {
  const posts = getAllPosts()
  const tagCount = new Map<string, number>()

  for (const post of posts) {
    for (const tag of post.tags) {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1)
    }
  }

  return tagCount
}

/**
 * 指定したタグを持つ記事を取得する
 * @param tag - タグ名
 * @returns 該当する記事の配列
 */
export function getPostsByTag(tag: string): Post[] {
  const posts = getAllPosts()
  return posts.filter((post) => post.tags.includes(tag))
}
