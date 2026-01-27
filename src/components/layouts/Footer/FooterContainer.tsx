import { FooterPresenter } from './FooterPresenter'

export function FooterContainer() {
  const currentYear = new Date().getFullYear()

  return <FooterPresenter currentYear={currentYear} />
}
