import { describe, expect, it } from 'vitest'
import { extractToc } from './mdx'

describe('extractToc', () => {
  it('h2とh3の見出しを抽出する', () => {
    const content = `
## 見出し2
### 見出し3
## もう一つの見出し2
`
    const result = extractToc(content)

    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ id: '見出し2', text: '見出し2', level: 2 })
    expect(result[1]).toEqual({ id: '見出し3', text: '見出し3', level: 3 })
    expect(result[2]).toEqual({ id: 'もう一つの見出し2', text: 'もう一つの見出し2', level: 2 })
  })

  it('h1とh4以上は無視する', () => {
    const content = `
# h1見出し
## h2見出し
### h3見出し
#### h4見出し
##### h5見出し
`
    const result = extractToc(content)

    expect(result).toHaveLength(2)
    expect(result[0].text).toBe('h2見出し')
    expect(result[1].text).toBe('h3見出し')
  })

  it('日本語の見出しを正しく処理する', () => {
    const content = `
## ひらがなの見出し
## カタカナの見出し
## 漢字の見出し
`
    const result = extractToc(content)

    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ id: 'ひらがなの見出し', text: 'ひらがなの見出し', level: 2 })
    expect(result[1]).toEqual({ id: 'カタカナの見出し', text: 'カタカナの見出し', level: 2 })
    expect(result[2]).toEqual({ id: '漢字の見出し', text: '漢字の見出し', level: 2 })
  })

  it('見出しがない場合は空配列を返す', () => {
    const content = `
これは本文です。
見出しはありません。
`
    const result = extractToc(content)

    expect(result).toEqual([])
  })

  it('IDはケバブケース化される', () => {
    const content = `
## Hello World
## Multiple   Spaces   Here
`
    const result = extractToc(content)

    expect(result[0].id).toBe('hello-world')
    // 複数スペースは1つの-に変換される
    expect(result[1].id).toBe('multiple-spaces-here')
  })

  it('特殊文字はIDから除去される', () => {
    const content = `
## 見出し!@#$%^&*()
## Test: Special Characters?
`
    const result = extractToc(content)

    expect(result[0].id).toBe('見出し')
    expect(result[1].id).toBe('test-special-characters')
  })
})
