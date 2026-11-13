import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { Benefits, CategoryRows, CategoryShowcase, FaqList, Marquee, ProductsSection, PromoBanner, ReelsSection, StorySection, Testimonials } from '@/components/home/sections'
import { stripEmph } from '@/components/ui/Emph'
import { getDictionary } from '@/lib/i18n'
import { localizeHref } from '@/lib/links'
import { buildMetadata } from '@/lib/seo/metadata'
import { env } from '@/server/env'
import { resolveLocale, seoFrom } from '@/server/page-helpers'
import { getCategories, getCategoryProductCounts, getFaqs, getHomepage, getSiteSettings, getTestimonials, getVideos, listProducts, toImage, toVideo, type ProductCardData } from '@/server/queries'
import type { Category, Product, Video } from '@/payload-types'

type Params = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const [home, { branding }] = await Promise.all([getHomepage(locale), getSiteSettings(locale)])
  const meta = buildMetadata({
    baseUrl: env.NEXT_PUBLIC_SERVER_URL,
    locale,
    path: '',
    title: stripEmph(branding.defaultSeoTitle || branding.siteTitle || branding.brandName || ''),
    description: branding.defaultSeoDescription || home.hero?.subheadline,
    imageUrl: toImage(home.hero?.image as never, 'og')?.url,
    seo: seoFrom(home.seo),
    siteName: branding.siteTitle || branding.brandName || '',
  })
  // The homepage title should not get the "| Site" suffix twice.
  return { ...meta, title: { absolute: String(meta.title) } }
}

const idOf = (v: number | { id: number } | null | undefined) => (typeof v === 'object' && v ? v.id : v)

export default async function HomePage({ params }: Params) {
  const locale = await resolveLocale(params)
  const dict = getDictionary(locale)
  const other = locale === 'bn' ? 'en' : 'bn'
  const [home, categories, otherCategories, counts, { branding }] = await Promise.all([
    getHomepage(locale),
    getCategories(locale),
    getCategories(other),
    getCategoryProductCounts(),
    getSiteSettings(locale),
  ])
  const brandName = branding.brandName || ''
  const published = new Map(categories.map((c) => [c.id, c]))
  const otherName = new Map(otherCategories.map((c) => [c.id, c.name]))

  // Category tiles: chosen list in admin order, else featured categories.
  const chosen = (home.categoriesSection?.categories ?? []).map((c) => published.get(idOf(c as Category)!)).filter((c): c is Category => Boolean(c))
  const tiles = (chosen.length ? chosen : categories.filter((c) => c.featured)).map((c) => ({
    slug: c.slug,
    name: c.name ?? '',
    // Small-caps line: admin subtitle, else the name in the other language (e.g. "MANGOES" under "আম").
    subtitle: c.subtitle || otherName.get(c.id) || '',
    count: counts.get(c.id) ?? 0,
    comingSoon: Boolean(c.comingSoon),
    tint: c.tint ?? null,
    image: toImage((c.cutout || c.image) as never, 'large'),
  }))

  // Featured mangoes: hand-picked products, else featured products of the chosen category.
  const feat = home.featured
  const featCat = feat?.category ? published.get(idOf(feat.category as Category)!) : categories.find((c) => c.slug === 'mango')
  const pickedIds = (feat?.products ?? []).map((p) => idOf(p as Product)!).filter(Boolean)
  const featured: ProductCardData[] = feat?.enabled === false
    ? []
    : pickedIds.length
      ? (await listProducts(locale, { ids: pickedIds, limit: pickedIds.length })).docs
      : featCat
        ? (await listProducts(locale, { category: featCat.slug, limit: feat?.limit ?? 8 })).docs
        : []

  // Traditional foods: one row per selected category.
  const trad = home.traditional
  const tradCats = (trad?.categories ?? []).map((c) => published.get(idOf(c as Category)!)).filter((c): c is Category => Boolean(c))
  const rows =
    trad?.enabled === false
      ? []
      : await Promise.all(
          tradCats.map(async (c) => ({ slug: c.slug, name: c.name ?? '', products: (await listProducts(locale, { category: c.slug, limit: trad?.perCategory ?? 4 })).docs })),
        )

  const pop = home.popular
  const popIds = (pop?.products ?? []).map((p) => idOf(p as Product)!).filter(Boolean)
  const popular = pop?.enabled === false ? [] : (await listProducts(locale, popIds.length ? { ids: popIds, limit: popIds.length } : { bestSeller: true, limit: 4 })).docs

  const [testimonials, faqs] = await Promise.all([
    home.testimonials?.enabled === false ? Promise.resolve([]) : getTestimonials(locale),
    home.faq?.enabled === false ? Promise.resolve([]) : getFaqs(locale, true),
  ])

  // Video posts: hand-picked reels, else the reels feed; story/hero use their own chosen post.
  const reelIds = (home.reels?.videos ?? []).map((v) => idOf(v as Video)!).filter(Boolean)
  const reels = home.reels?.enabled === false ? [] : await getVideos(locale, reelIds.length ? { ids: reelIds } : { limit: home.reels?.limit ?? 8 })
  const storyVideo = toVideo(home.story?.video as Video | null)
  const heroVideo = toVideo(home.hero?.video as Video | null)
  const marquee = home.marquee?.enabled === false ? [] : (home.marquee?.items ?? []).map((m) => m.text ?? '').filter(Boolean)

  const hero = home.hero
  return (
    <>
      <Hero
        locale={locale}
        headline={hero?.headline || ''}
        subheadline={hero?.subheadline}
        image={toImage(hero?.image as never, 'large')}
        primary={hero?.primaryCta}
        secondary={hero?.secondaryCta}
        badge={hero?.seasonalBadge?.enabled ? hero.seasonalBadge.text : null}
        video={heroVideo?.orientation === 'landscape' ? heroVideo : null}
        brandName={brandName}
      />
      <Benefits items={(home.benefits ?? []).map((b) => ({ icon: b.icon, title: b.title ?? '', text: b.text }))} />
      {home.categoriesSection?.enabled !== false && (
        <CategoryShowcase
          locale={locale}
          dict={dict}
          title={home.categoriesSection?.heading || dict.home.categories}
          linkLabel={home.categoriesSection?.linkLabel || dict.home.browseAll}
          tiles={tiles}
        />
      )}
      <ProductsSection
        id="featured-title"
        locale={locale}
        dict={dict}
        title={feat?.heading || dict.home.featuredMangoes}
        intro={feat?.intro}
        products={featured}
        cta={{ label: feat?.cta?.label || dict.home.allMangoes, href: localizeHref(feat?.cta?.href || `/category/${featCat?.slug ?? 'mango'}`, locale) }}
        tone="leaf"
      />
      <Marquee items={marquee} />
      <CategoryRows locale={locale} dict={dict} title={trad?.heading || dict.home.traditional} intro={trad?.intro} rows={rows} />
      {home.promo?.enabled && home.promo.heading && (
        <PromoBanner locale={locale} heading={home.promo.heading} text={home.promo.text} image={toImage(home.promo.image as never, 'large')} cta={home.promo.cta} />
      )}
      {home.story?.enabled !== false && home.story?.heading && home.story.body && (
        <StorySection
          locale={locale}
          eyebrow={home.story.eyebrow}
          heading={home.story.heading}
          body={home.story.body}
          steps={(home.story.steps ?? []).map((st) => ({ title: st.title ?? '', text: st.text })).filter((st) => st.title)}
          image={toImage(home.story.image as never, 'large')}
          video={storyVideo}
          brandName={brandName}
          cta={home.story.cta}
        />
      )}
      <ReelsSection title={home.reels?.heading || dict.home.reels} intro={home.reels?.intro ?? dict.home.reelsIntro} videos={reels} brandName={brandName} locale={locale} dict={dict} />
      <ProductsSection id="popular-title" locale={locale} dict={dict} title={pop?.heading || dict.home.popular} products={popular} />
      <Testimonials
        title={home.testimonials?.heading || dict.home.testimonials}
        items={testimonials.map((t) => ({ id: t.id, customerName: t.customerName, location: t.location, quote: t.quote ?? '', rating: t.rating }))}
      />
      <FaqList title={home.faq?.heading || dict.home.faq} items={faqs.map((f) => ({ id: f.id, question: f.question ?? '', answer: f.answer ?? '' }))} />
    </>
  )
}
