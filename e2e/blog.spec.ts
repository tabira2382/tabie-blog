import { expect, test } from '@playwright/test'

test.describe('ブログ機能', () => {
  test('記事一覧ページが表示される', async ({ page }) => {
    await page.goto('/blog')

    // ページタイトルを確認
    await expect(page.locator('h1')).toBeVisible()

    // 記事カードが存在する
    const postCards = page.locator('[data-testid="post-card"]')
    await expect(postCards.first()).toBeVisible()
  })

  test('記事一覧から詳細ページへ遷移できる', async ({ page }) => {
    await page.goto('/blog')

    // 最初の記事カードをクリック
    const firstCard = page.locator('[data-testid="post-card"]').first()
    await firstCard.click()

    // URLが /blog/xxx 形式に変わる
    await expect(page).toHaveURL(/\/blog\/[\w-]+/)

    // 記事タイトルが表示される
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('タグでフィルタリングできる', async ({ page }) => {
    // タグページに直接アクセス
    await page.goto('/blog/tags/React')

    // タグ名を含む見出しが表示される
    await expect(page.locator('h1')).toBeVisible()

    // フィルタされた記事カードが存在する
    const postCards = page.locator('[data-testid="post-card"]')
    await expect(postCards.first()).toBeVisible()
  })
})
