import { FooterPresenter } from './FooterPresenter'

/**
 * Footer の Container コンポーネント
 * 現在の年を取得して Presenter に渡す
 */
export function FooterContainer() {
  const currentYear = new Date().getFullYear()

  return <FooterPresenter currentYear={currentYear} />
}
