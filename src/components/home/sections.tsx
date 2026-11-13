import { ArrowRight, ArrowUpRight, Clock, HeartHandshake, Leaf, Package, Phone, ShieldCheck, Sparkles, Truck, Wallet, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries/en'
import { formatNumber, interpolate } from '@/lib/i18n/format'
import { localizeHref } from '@/lib/links'
import type { ImageData, ProductCardData, VideoData } from '@/server/queries'
import { ProductCard, ProductGrid } from '../product/ProductCard'
import { Emph } from '../ui/Emph'
import { FeaturedReel, ReelsRow } from '../video/VideoGallery'

const ICONS: Record<string, LucideIcon> = {
  leaf: Leaf,
  package: Package,
  truck: Truck,
  wallet: Wallet,
  shield: ShieldCheck,
  phone: Phone,
  clock: Clock,
  heart: HeartHandshake,
}
const delay = (i: number) => ({ ['--i' as string]: i }) as CSSProperties

export function SectionHeading({ id, title, intro, action, eyebrow }: { id: string; title: string; intro?: string | null; action?: ReactNode; eyebrow?: string | null }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-10" data-reveal>
      <div>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 id={id} className="hl text-[clamp(1.9rem,3.8vw,3rem)] text-primary">
          <Emph text={title} />
        </h2>
        {intro && <p className="mt-2 max-w-[60ch] text-ink-soft">{intro}</p>}
      </div>
      {action}
    </div>
  )
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-1.5 font-semibold text-primary">
      <span className="bg-[linear-gradient(var(--color-accent-warm),var(--color-accent-warm))] bg-[length:100%_2px] bg-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:0%_2px]">
        {children}
      </span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
    </Link>
  )
}

export function Benefits({ items }: { items: { icon?: string | null; title: string; text?: string | null }[] }) {
  if (!items.length) return null
  return (
    <section aria-label="Benefits" className="container-page relative z-10 -mt-6 md:-mt-10">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {items.map((b, i) => {
          const Icon = ICONS[b.icon ?? 'leaf'] ?? Leaf
          return (
            <li key={b.title} data-reveal style={delay(i)} className="gloss lift flex items-start gap-3 rounded-[20px] p-4 md:p-5">
              <span
                className="relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_8px_16px_-8px_rgba(36,91,50,0.9)]"
                style={{ background: i % 2 ? 'var(--grad-mango)' : 'var(--grad-leaf)' }}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="relative z-10">
                <p className="font-semibold leading-snug">{b.title}</p>
                {b.text && <p className="mt-0.5 text-sm text-ink-soft">{b.text}</p>}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/** Slowly scrolling band of short phrases. Duplicated once (aria-hidden) for a seamless loop. */
export function Marquee({ items }: { items: string[] }) {
  if (!items.length) return null
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <li key={i} className="flex items-center gap-6 whitespace-nowrap px-6 font-display text-[clamp(1.2rem,2.4vw,1.8rem)]">
          <Sparkles className="h-5 w-5 text-accent" aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  )
  return (
    // The tilted band is wider than the screen; the outer section clips it so the page never scrolls sideways.
    <section aria-label={items.join(' · ')} className="marquee-wrap mt-12 overflow-hidden py-4 md:mt-20">
      <div className="-mx-4 -rotate-[1.2deg] py-4 text-cream shadow-[0_18px_40px_-22px_rgba(20,60,30,0.8)]" style={{ background: 'var(--grad-leaf)' }}>
        <div className="marquee" style={{ ['--marquee-duration' as string]: `${Math.max(24, items.length * 7)}s` }}>
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  )
}

export interface CategoryTile {
  slug: string
  name: string
  subtitle: string
  count: number
  comingSoon: boolean
  tint: string | null
  image: ImageData | null
}

const CAT_TINTS = ['#FFF1CF', '#F9E8E4', '#F5EBDD', '#FDE6D2', '#EEF3DC', '#F3EEE2']

/**
 * Category showcase: numbered cards, a pastel glossy panel per category with a cut-out image that floats
 * over its top-left corner and lifts on hover. Swipeable on phones, 2–3 columns on larger screens.
 */
export function CategoryShowcase({ locale, dict, title, linkLabel, tiles }: { locale: Locale; dict: Dictionary; title: string; linkLabel: string; tiles: CategoryTile[] }) {
  if (!tiles.length) return null
  return (
    <section className="container-page mt-16 md:mt-24" aria-labelledby="cats-title">
      <div className="overflow-hidden rounded-[28px] border border-line bg-white/60 shadow-[var(--shadow-soft)] backdrop-blur-sm">
        <div className="flex items-stretch justify-between border-b border-line">
          <h2 id="cats-title" className="hl px-5 py-6 text-[clamp(1.9rem,4vw,3.1rem)] text-[#3B1F0E] md:px-10 md:py-8" data-reveal>
            <Emph text={title} />
          </h2>
          <Link
            href={`/${locale}/shop`}
            className="group hidden items-center gap-2 border-l border-line px-8 text-sm font-semibold text-[#6B3A1C] transition-colors hover:bg-white/70 sm:flex"
          >
            {linkLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {tiles.map((c, i) => {
            const meta =
              c.comingSoon || c.count === 0
                ? dict.home.comingSoon
                : c.count === 1
                  ? dict.home.productCountOne
                  : interpolate(dict.home.productCount, { count: formatNumber(c.count, locale) })
            return (
              <li
                key={c.slug}
                data-reveal
                style={delay(i % 3)}
                className="cat-cell border-b border-line p-5 last:border-b-0 max-md:px-4 max-md:py-3 md:border-r md:p-8 md:last:border-b md:last:border-r-0 md:[&:nth-child(2n)]:border-r-0 lg:p-10 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
              >
                <Link href={`/${locale}/category/${c.slug}`} className="group relative block h-full min-h-[20rem] focus-visible:outline-offset-4 max-md:min-h-[11.5rem]" data-testid="category-card">
                  <span
                    className="cat-card gloss lift absolute bottom-0 right-0 flex h-[60%] w-[82%] flex-col justify-end p-5 md:p-6 max-md:grid max-md:h-[74%] max-md:w-full max-md:grid-cols-[1fr_auto] max-md:content-center max-md:items-center max-md:gap-x-4 max-md:py-4 max-md:pl-[40%] max-md:pr-4 max-md:text-right"
                    style={{ ['--tint' as string]: c.tint || CAT_TINTS[i % CAT_TINTS.length] }}
                  >
                    <span className="relative z-10 text-xs font-medium tabular-nums text-[#7A4A2A] max-md:col-start-1">{formatNumber(i + 1, locale).padStart(2, locale === 'bn' ? '০' : '0')}</span>
                    <span className="relative z-10 mt-1 font-display text-[1.65rem] leading-tight text-[#3B1F0E] max-md:col-start-1 max-md:text-[1.45rem] md:text-[1.9rem]">{c.name}</span>
                    <span className="relative z-10 mt-1 flex items-end justify-between gap-3 max-md:contents">
                      <span className="cat-sub text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[#9A5B36] max-md:relative max-md:z-10 max-md:col-start-1 max-md:mt-1">
                        {c.subtitle} · <span className="whitespace-nowrap normal-case tracking-normal">{meta}</span>
                      </span>
                      <span className="cat-arrow inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#3B1F0E]/70 text-[#3B1F0E] max-md:relative max-md:z-10 max-md:col-start-2 max-md:row-span-3 max-md:row-start-1" aria-hidden>
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </span>
                  </span>
                  {c.image && (
                    <span className="pointer-events-none absolute left-0 top-0 z-10 aspect-square w-[64%] max-md:w-[44%] max-md:max-w-[200px]">
                      <span className="float-y-slow relative block h-full w-full" style={{ animationDelay: `${-i * 1.3}s` }}>
                        <Image src={c.image.url} alt="" fill sizes="(min-width:1024px) 22vw, (min-width:768px) 34vw, 62vw" className="cat-cutout object-contain" />
                      </span>
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export function ProductsSection({
  id,
  locale,
  dict,
  title,
  intro,
  products,
  cta,
  tone = 'plain',
}: {
  id: string
  locale: Locale
  dict: Dictionary
  title: string
  intro?: string | null
  products: ProductCardData[]
  cta?: { label: string; href: string } | null
  tone?: 'plain' | 'leaf'
}) {
  if (!products.length) return null
  const inner = (
    <div className="container-page relative">
      <SectionHeading id={id} title={title} intro={intro} action={cta ? <TextLink href={cta.href}>{cta.label}</TextLink> : undefined} />
      <ProductGrid products={products} locale={locale} dict={dict} />
    </div>
  )
  return tone === 'leaf' ? (
    <section className="relative isolate mt-16 overflow-hidden py-14 md:mt-24 md:py-20" aria-labelledby={id}>
      <span className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-secondary)_16%,var(--color-cream))_0%,var(--color-cream)_100%)]" aria-hidden />
      <span className="blob drift -left-20 top-10 -z-10 h-80 w-80 bg-[#FFD54F] opacity-35" aria-hidden />
      <span className="blob drift -right-24 bottom-0 -z-10 h-96 w-96 bg-[#A7D47A] opacity-35" style={{ animationDelay: '-8s' }} aria-hidden />
      {inner}
    </section>
  ) : (
    <section className="mt-16 md:mt-24" aria-labelledby={id}>
      {inner}
    </section>
  )
}

/** One row per traditional-food category; scrolls sideways on phones. */
export function CategoryRows({
  locale,
  dict,
  title,
  intro,
  rows,
}: {
  locale: Locale
  dict: Dictionary
  title: string
  intro?: string | null
  rows: { slug: string; name: string; products: ProductCardData[] }[]
}) {
  const visible = rows.filter((r) => r.products.length)
  if (!visible.length) return null
  return (
    <section className="container-page mt-16 md:mt-24" aria-labelledby="trad-title">
      <SectionHeading id="trad-title" title={title} intro={intro} />
      <div className="space-y-12">
        {visible.map((r) => (
          <div key={r.slug}>
            <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-line pb-2" data-reveal>
              <h3 className="font-display text-2xl text-ink">{r.name}</h3>
              <TextLink href={`/${locale}/category/${r.slug}`}>{dict.common.viewAll}</TextLink>
            </div>
            <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 pt-1 sm:gap-5 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 xl:grid-cols-4">
              {r.products.map((p, i) => (
                <li key={p.id} data-reveal style={delay(i)} className="w-[48vw] max-w-[260px] shrink-0 snap-start md:w-auto md:max-w-none">
                  <ProductCard product={p} locale={locale} dict={dict} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export function PromoBanner({ locale, heading, text, image, cta }: { locale: Locale; heading: string; text?: string | null; image: ImageData | null; cta?: { label?: string | null; href?: string | null } | null }) {
  return (
    <section className="container-page mt-16 md:mt-24" aria-labelledby="promo-title">
      <div className="group relative grid overflow-hidden rounded-[30px] shadow-[var(--shadow-lift)] md:grid-cols-2" style={{ background: 'var(--grad-mango)' }} data-reveal="zoom">
        <span className="blob drift -left-16 -top-16 h-72 w-72 bg-white opacity-50" aria-hidden />
        <div className="relative z-10 flex flex-col justify-center p-7 sm:p-10 lg:p-14">
          <h2 id="promo-title" className="hl text-[clamp(2rem,4vw,3.2rem)] text-ink">
            <Emph text={heading} />
          </h2>
          {text && <p className="mt-3 max-w-[46ch] text-ink/80">{text}</p>}
          {cta?.label && (
            <Link href={localizeHref(cta.href || '/shop', locale)} className="group btn btn-leaf mt-7 w-fit">
              {cta.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          )}
        </div>
        <div className="relative min-h-[260px] overflow-hidden md:min-h-[380px]">
          {image && (
            <Image src={image.url} alt={image.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * Brand story (like a founder's note): eyebrow, heading, paragraphs, numbered steps and — when a video post is
 * chosen — a phone-style vertical reel. Falls back to the image.
 */
export function StorySection({
  locale,
  eyebrow,
  heading,
  body,
  steps,
  image,
  video,
  brandName,
  cta,
}: {
  locale: Locale
  eyebrow?: string | null
  heading: string
  body: string
  steps: { title: string; text?: string | null }[]
  image: ImageData | null
  video: VideoData | null
  brandName: string
  cta?: { label?: string | null; href?: string | null } | null
}) {
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  return (
    <section className="relative isolate mt-16 overflow-hidden py-14 md:mt-24 md:py-20" aria-labelledby="story-title">
      <span className="absolute inset-y-0 right-0 -z-10 hidden w-[44%] rounded-l-[56px] bg-[linear-gradient(160deg,#FFF3D6,#FBE2C4)] md:block" aria-hidden />
      <div className="container-page grid items-center gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-6" data-reveal="left">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h2 id="story-title" className="hl text-[clamp(2rem,4.2vw,3.4rem)] text-[#3B1F0E]">
            <Emph text={heading} />
          </h2>
          <div className="mt-5 space-y-4 text-[1.05rem] text-ink/85">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          {steps.length > 0 && (
            <ol className="mt-8 space-y-4">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-semibold tabular-nums text-ink shadow-[0_6px_14px_-6px_rgba(245,154,35,0.9)]"
                    style={{ background: 'var(--grad-mango)' }}
                  >
                    {formatNumber(i + 1, locale)}
                  </span>
                  <p className="pt-1">
                    <strong className="font-semibold text-[#3B1F0E]">{s.title}</strong>
                    {s.text ? <span className="text-ink/75"> — {s.text}</span> : null}
                  </p>
                </li>
              ))}
            </ol>
          )}
          {cta?.label && (
            <p className="mt-8">
              <TextLink href={localizeHref(cta.href || '/pages/our-story', locale)}>{cta.label}</TextLink>
            </p>
          )}
        </div>
        <div className="relative md:col-span-5 md:col-start-8" data-reveal="right">
          <span className="blob drift left-1/4 top-1/4 -z-10 h-64 w-64 bg-[#FFC928] opacity-40" aria-hidden />
          {video ? (
            <div className="phone-frame relative mx-auto w-full max-w-[340px] rotate-[2deg] transition-transform duration-700 hover:rotate-0">
              <FeaturedReel video={video} brandName={brandName} variant="story" />
            </div>
          ) : (
            image && (
              <div className="gloss relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[30px]">
                <Image src={image.url} alt={image.alt} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  )
}

export function ReelsSection({ title, intro, videos, brandName, locale, dict }: { title: string; intro?: string | null; videos: VideoData[]; brandName: string; locale: Locale; dict: Dictionary }) {
  if (!videos.length) return null
  return (
    <section className="container-page mt-16 md:mt-24" aria-labelledby="reels-title">
      <SectionHeading id="reels-title" title={title} intro={intro} action={<TextLink href={`/${locale}/videos`}>{dict.common.viewAll}</TextLink>} />
      <ReelsRow videos={videos} brandName={brandName} />
    </section>
  )
}

export function Testimonials({ title, items }: { title: string; items: { id: number; customerName: string; location?: string | null; quote: string; rating?: number | null }[] }) {
  if (!items.length) return null
  return (
    <section className="container-page mt-16 md:mt-24" aria-labelledby="reviews-title">
      <SectionHeading id="reviews-title" title={title} />
      <ul className="grid gap-5 md:grid-cols-3">
        {items.map((r, i) => (
          <li key={r.id} data-reveal style={delay(i)}>
            <figure className="gloss lift flex h-full flex-col rounded-[24px] p-6">
              {r.rating ? (
                <p className="relative z-10 text-accent-warm" aria-label={`${r.rating}/5`}>
                  {'★'.repeat(r.rating)}
                  <span className="text-line">{'★'.repeat(5 - r.rating)}</span>
                </p>
              ) : null}
              <blockquote className="relative z-10 mt-2 flex-1 font-display text-xl leading-relaxed text-ink">“{r.quote}”</blockquote>
              <figcaption className="relative z-10 mt-4 text-sm text-ink-soft">
                {r.customerName}
                {r.location ? `, ${r.location}` : ''}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function FaqList({ title, items, headingId = 'faq-title' }: { title: string; items: { id: number; question: string; answer: string }[]; headingId?: string }) {
  if (!items.length) return null
  return (
    <section className="container-page mt-16 md:mt-24" aria-labelledby={headingId}>
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4" data-reveal>
          <h2 id={headingId} className="hl text-[clamp(1.9rem,3.8vw,3rem)] text-primary">
            <Emph text={title} />
          </h2>
        </div>
        <div className="space-y-3 md:col-span-8">
          {items.map((f, i) => (
            <details key={f.id} className="gloss group rounded-[20px] px-5 open:shadow-[var(--shadow-lift)]" data-reveal style={delay(i)}>
              <summary className="relative z-10 flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[1.05rem] font-semibold marker:hidden">
                {f.question}
                <span
                  aria-hidden
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg leading-none text-white transition-transform duration-300 group-open:rotate-45"
                  style={{ background: 'var(--grad-leaf)' }}
                >
                  +
                </span>
              </summary>
              <p className="relative z-10 whitespace-pre-line pb-5 pr-8 text-ink/85">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
