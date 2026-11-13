'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Adds `.is-in` to every [data-reveal] element as it scrolls into view (see globals.css).
 * Content is only hidden while `html.js` is set, so without JavaScript everything is visible.
 * Runs again after client-side navigation so new pages animate too.
 */
export function RevealObserver() {
  const pathname = usePathname()
  useEffect(() => {
    const pending = () => Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'))
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pending().forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // Also reveal anything already scrolled past (e.g. page restored mid-way or scrolled before hydration).
          if (e.isIntersecting || e.boundingClientRect.bottom < 0) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    const observeAll = () => pending().forEach((el) => io.observe(el))
    observeAll()
    // Sections streamed in later (Suspense) or rendered after hydration.
    const mo = new MutationObserver(observeAll)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])
  return null
}
