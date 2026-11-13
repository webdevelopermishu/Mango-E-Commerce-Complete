import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { describe, expect, it } from 'vitest'
import { Emph, stripEmph } from '@/components/ui/Emph'

const html = (text: string) => renderToStaticMarkup(createElement(Emph, { text }))

describe('heading emphasis (**bold** markup from the admin)', () => {
  it('turns **words** into <strong> and keeps the rest as text', () => {
    expect(html('আমাদের **ক্যাটাগরিসমূহ**')).toBe('আমাদের <strong>ক্যাটাগরিসমূহ</strong>')
    expect(html('A **b** c **d**')).toBe('A <strong>b</strong> c <strong>d</strong>')
  })
  it('renders headings without markup at a solid weight', () => {
    expect(html('সাধারণ জিজ্ঞাসা')).toBe('<span class="hl-solid">সাধারণ জিজ্ঞাসা</span>')
  })
  it('never injects HTML from admin text', () => {
    expect(html('<img src=x onerror=alert(1)> **<b>x</b>**')).not.toContain('<img')
  })
  it('strips markers for plain-text uses such as page titles', () => {
    expect(stripEmph('Our **categories**')).toBe('Our categories')
  })
})
