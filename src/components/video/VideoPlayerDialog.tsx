'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronLeft, ChevronRight, ShoppingBag, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import type { VideoData } from '@/server/queries'
import { formatNumber } from '@/lib/i18n/format'
import { useI18n } from '../providers/I18nProvider'

/** Full-screen player with sound and native controls. Arrow keys / buttons move between videos. */
export function VideoPlayerDialog({
  videos,
  index,
  onIndex,
  onClose,
}: {
  videos: VideoData[]
  index: number | null
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const { dict, locale, t } = useI18n()
  const ref = useRef<HTMLVideoElement>(null)
  const v = index == null ? null : videos[index]
  const many = videos.length > 1

  useEffect(() => {
    const el = ref.current
    if (el && v) el.play().catch(() => {})
  }, [v])

  const go = (d: number) => index != null && onIndex((index + d + videos.length) % videos.length)

  return (
    <Dialog.Root open={v != null} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="drawer-overlay fixed inset-0 z-[70] bg-black/85 backdrop-blur-sm" />
        <Dialog.Content
          data-testid="video-dialog"
          aria-describedby={undefined}
          onKeyDown={(e) => {
            if (!many) return
            if (e.key === 'ArrowRight') go(1)
            if (e.key === 'ArrowLeft') go(-1)
          }}
          className="fixed inset-0 z-[71] flex items-center justify-center p-3 focus:outline-none sm:p-6"
        >
          {v && (
            <div className="relative flex max-h-full w-full max-w-5xl flex-col items-center gap-4 md:flex-row md:items-end md:justify-center">
              <video
                key={v.id}
                ref={ref}
                className={`max-h-[78dvh] rounded-2xl bg-black shadow-2xl ${v.orientation === 'landscape' ? 'w-full md:max-w-4xl' : 'aspect-[9/16] h-[78dvh] max-w-full'}`}
                poster={v.poster?.url}
                controls
                playsInline
                autoPlay
              >
                <source src={v.src} type={v.type} />
              </video>
              <div className="w-full max-w-sm text-white md:pb-2">
                {v.label && <p className="text-sm text-white/70">{v.label}</p>}
                <Dialog.Title className="mt-1 font-display text-2xl leading-snug">{v.title}</Dialog.Title>
                {v.caption && <p className="mt-2 whitespace-pre-line text-white/80">{v.caption}</p>}
                {v.product && (
                  <Link href={`/${locale}/product/${v.product.slug}`} onClick={onClose} className="btn btn-mango mt-4">
                    <ShoppingBag className="h-4 w-4" aria-hidden /> {t(dict.video.shop, { name: v.product.name })}
                  </Link>
                )}
                {many && (
                  <div className="mt-5 flex items-center gap-3">
                    <button type="button" onClick={() => go(-1)} aria-label={dict.video.previous} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 hover:bg-white/25">
                      <ChevronLeft className="h-5 w-5" aria-hidden />
                    </button>
                    <span className="text-sm text-white/70 tabular-nums">
                      {t(dict.video.counter, { current: formatNumber(index! + 1, locale), total: formatNumber(videos.length, locale) })}
                    </span>
                    <button type="button" onClick={() => go(1)} aria-label={dict.video.next} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 hover:bg-white/25">
                      <ChevronRight className="h-5 w-5" aria-hidden />
                    </button>
                  </div>
                )}
              </div>
              <Dialog.Close aria-label={dict.video.close} className="absolute -top-1 right-0 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 md:-right-4 md:-top-4">
                <X className="h-6 w-6" aria-hidden />
              </Dialog.Close>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
