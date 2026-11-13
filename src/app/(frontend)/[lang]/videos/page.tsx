import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ReelsGrid } from '@/components/video/VideoGallery'
import { getDictionary } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo/metadata'
import { env } from '@/server/env'
import { resolveLocale } from '@/server/page-helpers'
import { getSiteSettings, getVideos } from '@/server/queries'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const dict = getDictionary(locale)
  const { branding } = await getSiteSettings(locale)
  return buildMetadata({
    baseUrl: env.NEXT_PUBLIC_SERVER_URL,
    locale,
    path: '/videos',
    title: dict.video.pageTitle,
    description: dict.video.pageIntro,
    siteName: branding.siteTitle || branding.brandName || '',
  })
}

export default async function VideosPage({ params }: Props) {
  const locale = await resolveLocale(params)
  const dict = getDictionary(locale)
  const [videos, { branding }] = await Promise.all([getVideos(locale, { limit: 48 }), getSiteSettings(locale)])
  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs
        label={dict.common.breadcrumb}
        baseUrl={env.NEXT_PUBLIC_SERVER_URL}
        items={[
          { name: dict.common.home, href: `/${locale}` },
          { name: dict.video.pageTitle, href: `/${locale}/videos` },
        ]}
      />
      <h1 className="hl mt-4 text-[clamp(2.2rem,5vw,3.6rem)] text-primary">{dict.video.pageTitle}</h1>
      <p className="mb-10 mt-3 max-w-[56ch] text-lg text-ink-soft">{dict.video.pageIntro}</p>
      {videos.length ? <ReelsGrid videos={videos} brandName={branding.brandName || ''} /> : <p className="text-ink-soft">{dict.video.empty}</p>}
    </div>
  )
}
