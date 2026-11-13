import { ArrowUp, ArrowUpRight, ChevronRight, Mail, MapPin, Phone, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Dictionary } from '@/lib/i18n/dictionaries/en'
import type { Locale } from '@/lib/i18n/config'
import { formatNumber } from '@/lib/i18n/format'
import { isExternal, localizeHref } from '@/lib/links'
import type { ImageData } from '@/server/queries'
import { Logo } from './Logo'

const platformNames: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  x: 'X',
}

/** Simple line icons for social platforms (drawn here: the icon library ships no brand marks). */
function SocialIcon({ platform }: { platform: string }) {
  const common = { viewBox: '0 0 24 24', className: 'h-[18px] w-[18px]', 'aria-hidden': true, focusable: false } as const
  switch (platform) {
    case 'facebook':
      return (
        <svg {...common} fill="currentColor">
          <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'youtube':
      return (
        <svg {...common} fill="currentColor">
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg {...common} fill="currentColor">
          <path d="M16.6 3c.3 2.1 1.6 3.6 3.6 3.8v3a7 7 0 0 1-3.6-1.1v6.2A5.9 5.9 0 1 1 10.7 9v3.1a2.9 2.9 0 1 0 2.9 2.8V3h3z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg {...common} fill="currentColor">
          <path d="M6.9 8.8H3.8V20h3.1V8.8zM5.4 4a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM20.2 13.5c0-3-1.6-4.9-4.2-4.9-1.5 0-2.4.8-2.9 1.6V8.8H10V20h3.1v-5.9c0-1.5.6-2.6 2-2.6s1.9 1 1.9 2.6V20h3.2v-6.5z" />
        </svg>
      )
    case 'x':
      return (
        <svg {...common} fill="currentColor">
          <path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z" />
        </svg>
      )
    default:
      return <ArrowUpRight className="h-[18px] w-[18px]" aria-hidden />
  }
}

function ContactRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-accent ring-1 ring-white/15">{icon}</span>
      <span className="min-w-0 pt-1.5 leading-snug">{children}</span>
    </li>
  )
}

interface Column {
  title: string
  links: { label: string; href: string }[]
}

const linkClass = 'group inline-flex items-center gap-1.5 text-cream/80 transition-colors hover:text-white'

export function Footer({
  locale,
  dict,
  brandName,
  logo,
  description,
  columns,
  phone,
  email,
  address,
  socials,
  paymentNote,
  copyright,
}: {
  locale: Locale
  dict: Dictionary
  brandName: string
  logo: ImageData | null
  description: string
  columns: Column[]
  phone?: string | null
  email?: string | null
  address?: string | null
  socials: { platform: string; url: string }[]
  paymentNote?: string | null
  copyright?: string | null
}) {
  const year = formatNumber(new Date().getFullYear(), locale).replace(/,/g, '')
  const tel = phone ? phone.replace(/[^\d+]/g, '') : ''
  const linkColumns = columns

  return (
    <footer className="site-footer relative mt-28 overflow-hidden text-cream">
      {/* Curved top edge, glows and a faint dot texture give the footer depth in any brand colour. */}
      <svg className="absolute inset-x-0 top-0 h-10 w-full text-cream md:h-14" viewBox="0 0 1440 56" preserveAspectRatio="none" aria-hidden>
        <path d="M0 0h1440v8c-240 40-480 48-720 48S240 48 0 8V0z" fill="currentColor" />
      </svg>
      <div className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-accent/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-primary/40 blur-3xl" aria-hidden />
      <div className="footer-dots pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />

      <div className="container-page relative pt-24 md:pt-28">
        {/* Call-to-action card */}
        <div className="footer-cta relative flex flex-col gap-6 overflow-hidden rounded-[1.75rem] p-6 ring-1 ring-white/15 backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-8">
          <div className="max-w-xl">
            <p className="font-display text-2xl leading-snug text-white md:text-[1.75rem]">{dict.footer.ctaTitle}</p>
            <p className="mt-2 text-cream/75">{dict.footer.ctaText}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {tel && (
              <a href={`tel:${tel}`} className="btn btn-mango whitespace-nowrap">
                <Phone className="h-4 w-4" aria-hidden /> {dict.footer.callNow}
              </a>
            )}
            <Link href={`/${locale}/shop`} className="btn btn-glass whitespace-nowrap">
              <ShoppingBag className="h-4 w-4" aria-hidden /> {dict.footer.shopAll}
            </Link>
          </div>
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              href={`/${locale}`}
              aria-label={brandName}
              className="inline-flex rounded-2xl bg-white p-3 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.55)] ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <Logo brandName={brandName} logo={logo} variant="footer" />
            </Link>
            {description && <p className="mt-5 max-w-sm text-[0.97rem] leading-relaxed text-cream/80">{description}</p>}
            {socials.length > 0 && (
              <div className="mt-6">
                <h2 className="sr-only">{dict.footer.follow}</h2>
                <ul className="flex flex-wrap gap-2.5">
                  {socials.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={platformNames[s.platform] ?? s.platform}
                        className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-cream ring-1 ring-white/15 transition hover:-translate-y-0.5 hover:bg-accent hover:text-primary-deep"
                      >
                        <SocialIcon platform={s.platform} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-5">
            {linkColumns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="footer-heading">{col.title}</h2>
                <ul className="mt-5 space-y-3 text-[0.95rem]">
                  {col.links.map((l) => {
                    const inner = (
                      <>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-accent/70 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
                        <span>{l.label}</span>
                      </>
                    )
                    return (
                      <li key={l.href + l.label}>
                        {isExternal(l.href) ? (
                          <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                            {inner}
                          </a>
                        ) : (
                          <Link href={localizeHref(l.href, locale)} className={linkClass}>
                            {inner}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </nav>
            ))}
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="footer-heading">{dict.footer.contact}</h2>
            <address className="mt-5 not-italic text-[0.95rem] text-cream/85">
              <ul className="space-y-4">
                {phone && (
                  <ContactRow icon={<Phone className="h-4 w-4" aria-hidden />}>
                    <a href={`tel:${tel}`} className="hover:text-white">
                      {phone}
                    </a>
                  </ContactRow>
                )}
                {email && (
                  <ContactRow icon={<Mail className="h-4 w-4" aria-hidden />}>
                    <a href={`mailto:${email}`} className="[overflow-wrap:anywhere] hover:text-white">
                      {email}
                    </a>
                  </ContactRow>
                )}
                {address && (
                  <ContactRow icon={<MapPin className="h-4 w-4" aria-hidden />}>
                    <span className="whitespace-pre-line">{address}</span>
                  </ContactRow>
                )}
              </ul>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 bg-black/15">
        <div className="container-page flex flex-col items-center gap-3 py-5 pb-24 text-center text-sm text-cream/70 md:flex-row md:justify-between md:pb-5 md:pr-24 md:text-left">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
            <p>{copyright || `© ${year} ${brandName}. ${dict.footer.rights}`}</p>
            {paymentNote && (
              <p>
                <span className="text-cream/90">{dict.footer.payments}:</span> {paymentNote}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://devifynow.com"
              target="_blank"
              rel="noopener"
              className="credit-pill group inline-flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-3 pr-2 text-cream/85 ring-1 ring-white/15 transition hover:bg-white/15 hover:text-white"
            >
              <span className="text-cream/60">{dict.footer.credit}</span>
              <span className="font-semibold text-white">
                <span aria-hidden>✨</span> DevifyNow
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
            <a
              href="#main"
              aria-label={dict.footer.backToTop}
              title={dict.footer.backToTop}
              className="grid h-9 w-9 place-items-center rounded-full bg-accent text-primary-deep shadow-lg transition hover:-translate-y-0.5"
            >
              <ArrowUp className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
