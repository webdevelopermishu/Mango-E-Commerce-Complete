import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { Locale } from '@/lib/i18n/config'
import { localizeHref } from '@/lib/links'
import type { ImageData, VideoData } from '@/server/queries'
import { Emph } from '../ui/Emph'
import { FeaturedReel } from '../video/VideoGallery'

const d = (i: number) => ({ ['--i' as string]: i }) as CSSProperties

/** Small decorative mango cube (pure SVG, no request). */
function Cube({ className, style }: { className: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden focusable="false">
      <defs>
        <linearGradient id="hc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE066" />
          <stop offset="1" stopColor="#F59A23" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="32" height="32" rx="8" fill="url(#hc)" />
      <rect x="4" y="4" width="32" height="11" rx="6" fill="#FFF6B8" opacity=".65" />
      <rect x="9" y="8" width="10" height="3" rx="1.5" fill="#fff" opacity=".9" />
    </svg>
  )
}

function LeafSprite({ className, style }: { className: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 80 40" className={className} style={style} aria-hidden focusable="false">
      <path d="M2 20 C 20 2 58 2 78 20 C 58 36 20 36 2 20 Z" fill="var(--color-secondary)" />
      <path d="M6 20 Q 40 17 74 20" stroke="#D7E8B8" strokeWidth="2" fill="none" opacity=".7" />
    </svg>
  )
}

export function Hero({
  locale,
  headline,
  subheadline,
  image,
  video,
  primary,
  secondary,
  badge,
  brandName,
}: {
  locale: Locale
  headline: string
  subheadline?: string | null
  image: ImageData | null
  video?: VideoData | null
  primary?: { label?: string | null; href?: string | null } | null
  secondary?: { label?: string | null; href?: string | null } | null
  badge?: string | null
  brandName: string
}) {
  return (
    <section className="relative isolate overflow-hidden" style={{ background: 'var(--grad-sunrise)' }} aria-labelledby="hero-title">
      {/* Drifting colour glows */}
      <span className="blob drift -right-24 -top-24 h-[28rem] w-[28rem] bg-[#FFC928]" aria-hidden />
      <span className="blob drift -bottom-40 -left-32 h-[26rem] w-[26rem] bg-[#9BCB6A]" style={{ animationDelay: '-6s' }} aria-hidden />
      <span className="blob drift right-[30%] top-[40%] h-64 w-64 bg-[#F59A23] opacity-30" style={{ animationDelay: '-11s' }} aria-hidden />

      {/* Soft fade into the page colour so the glows never end in a hard line. */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-cream" aria-hidden />
      <div className="container-page relative grid items-center gap-6 pb-12 pt-8 md:min-h-[min(82vh,760px)] md:grid-cols-[1.05fr_1fr] md:gap-4 md:pb-16 md:pt-10">
        <div className="relative z-10">
          {badge && (
            <p className="rise-in inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/70 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm backdrop-blur" style={d(0)}>
              <span className="pulse-ring h-2.5 w-2.5 rounded-full bg-accent-warm" aria-hidden />
              {badge}
            </p>
          )}
          <h1 id="hero-title" className="hero-title hl rise-in mt-5 max-w-[14ch] text-[clamp(2.6rem,7vw,5.4rem)] leading-[1.08] text-primary" style={d(1)}>
            <Emph text={headline} />
          </h1>
          {subheadline && (
            <p className="rise-in mt-5 max-w-[46ch] text-[1.08rem] text-ink/80 md:text-lg" style={d(2)}>
              {subheadline}
            </p>
          )}
          <div className="rise-in mt-8 flex flex-wrap gap-3" style={d(3)}>
            {primary?.label && (
              <Link href={localizeHref(primary.href || '/category/mango', locale)} className="group btn btn-leaf h-14 px-7 text-base">
                {primary.label}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            )}
            {secondary?.label && (
              <Link href={localizeHref(secondary.href || '/shop', locale)} className="btn btn-glass h-14 px-7 text-base">
                {secondary.label}
              </Link>
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[640px]">
          {video ? (
            <div className="rise-in relative rotate-[1.5deg] rounded-[30px] bg-white/60 p-2 shadow-[var(--shadow-lift)] backdrop-blur" style={d(2)}>
              <FeaturedReel video={video} brandName={brandName} variant="hero" />
            </div>
          ) : (
            <div className="relative aspect-[7/6]">
              {/* Glow + slowly turning dashed ring behind the fruit */}
              <span className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_45%_40%,#fff6c9_0%,#ffd95a_45%,rgb(245_154_35/0.0)_72%)]" aria-hidden />
              <svg viewBox="0 0 200 200" className="spin-slow absolute inset-[4%] h-[92%] w-[92%] text-primary/25" aria-hidden>
                <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 7" strokeLinecap="round" />
              </svg>
              {image && (
                <div className="hero-fruit absolute inset-0">
                  <div className="float-y relative h-full w-full">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      priority
                      fetchPriority="high"
                      sizes="(min-width: 768px) 46vw, 92vw"
                      className="object-contain drop-shadow-[0_30px_30px_rgba(90,50,0,0.25)]"
                    />
                  </div>
                </div>
              )}
              <Cube className="float-y absolute left-[4%] top-[12%] h-9 w-9 rotate-12" style={{ animationDelay: '-1s' }} />
              <Cube className="float-y-slow absolute right-[6%] top-[4%] h-7 w-7 -rotate-12" style={{ animationDelay: '-3s' }} />
              <Cube className="float-y absolute bottom-[10%] right-[2%] h-11 w-11 rotate-6" style={{ animationDelay: '-2s' }} />
              <LeafSprite className="float-y-slow absolute bottom-[6%] left-[6%] h-8 w-16 -rotate-[24deg]" style={{ animationDelay: '-4s' }} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
