'use client'
import { Play, ShoppingBag, Volume2, VolumeX } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { VideoData } from '@/server/queries'
import { MangoMark } from '../layout/Logo'
import { useI18n } from '../providers/I18nProvider'

const noop = () => () => {}
/** Autoplay only when the visitor hasn't asked for reduced motion or data saving. */
function useAutoplayAllowed(): boolean {
  return useSyncExternalStore(
    noop,
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
      return !reduced && !saveData
    },
    () => false,
  )
}

/**
 * A story-style video card: muted autoplay while at least half visible (pauses off-screen to save battery
 * and data), a progress bar, brand tag, caption and a "Shop" link. Clicking opens the full player.
 */
export function VideoReel({
  video,
  brandName,
  variant = 'card',
  onOpen,
  className = '',
}: {
  video: VideoData
  brandName: string
  variant?: 'card' | 'story' | 'hero'
  onOpen?: () => void
  className?: string
}) {
  const { dict, locale, t } = useI18n()
  const ref = useRef<HTMLVideoElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)
  const autoplay = useAutoplayAllowed()

  useEffect(() => {
    const el = ref.current
    if (!el || !autoplay || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e!.isIntersecting) {
          el.preload = 'auto'
          el.play().catch(() => {})
        } else el.pause()
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [autoplay])

  // Progress bar is updated directly on the DOM node (no re-render per frame).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const tick = () => {
      if (bar.current && el.duration) bar.current.style.transform = `scaleX(${el.currentTime / el.duration})`
      raf = requestAnimationFrame(tick)
    }
    const onPlay = () => {
      setPlaying(true)
      raf = requestAnimationFrame(tick)
    }
    const onPause = () => {
      setPlaying(false)
      cancelAnimationFrame(raf)
    }
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
    }
  }, [])

  const aspect = video.orientation === 'landscape' ? 'aspect-video' : 'aspect-[9/16]'
  const big = variant !== 'card'
  return (
    <div className={`group relative ${className}`} data-testid="video-reel">
      <div className={`reel ${aspect} w-full ${variant === 'story' ? 'rounded-[26px]' : ''}`}>
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          poster={video.poster?.url}
          muted={muted}
          loop
          playsInline
          preload={big ? 'metadata' : 'none'}
          aria-hidden
          tabIndex={-1}
        >
          <source src={video.src} type={video.type} />
        </video>
        <span className="reel-shade pointer-events-none absolute inset-0" aria-hidden />

        {/* Top: progress + brand tag */}
        <div className="pointer-events-none absolute inset-x-3 top-3 z-10">
          <span className="block h-[3px] overflow-hidden rounded-full bg-white/30">
            <span ref={bar} className="block h-full w-full origin-left scale-x-0 rounded-full bg-white" />
          </span>
          <span className="mt-2.5 flex items-center gap-2 text-[0.8rem] text-white/95">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow">
              <MangoMark className="h-5 w-5" />
            </span>
            <span className="font-semibold">{brandName}</span>
            {video.label && <span className="truncate text-white/80">· {video.label}</span>}
          </span>
        </div>

        {/* Whole card opens the player */}
        <button
          type="button"
          onClick={onOpen}
          aria-label={t(dict.video.play, { title: video.title })}
          className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-offset-[-4px]"
        >
          {!playing && (
            <span className="absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-white ring-1 ring-white/50 backdrop-blur-md transition-transform group-hover:scale-110">
              <Play className="ml-1 h-7 w-7 fill-white" aria-hidden />
            </span>
          )}
        </button>

        {/* Bottom: caption, shop link, sound */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4">
          <p className={`font-semibold leading-snug text-white drop-shadow ${big ? 'text-lg md:text-xl' : 'text-[0.95rem]'}`}>{video.title}</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            {video.product ? (
              <Link
                href={`/${locale}/product/${video.product.slug}`}
                className="pointer-events-auto inline-flex h-9 items-center gap-1.5 rounded-full bg-white/95 px-3.5 text-sm font-semibold text-primary shadow-lg transition-transform hover:scale-105"
                aria-label={t(dict.video.shop, { name: video.product.name })}
              >
                <ShoppingBag className="h-4 w-4" aria-hidden /> {dict.video.shopShort}
              </Link>
            ) : (
              <span />
            )}
            {big && (
              <button
                type="button"
                onClick={() => {
                  const el = ref.current
                  setMuted((m) => !m)
                  if (el && el.paused) el.play().catch(() => {})
                }}
                aria-label={muted ? dict.video.unmute : dict.video.mute}
                aria-pressed={!muted}
                className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white ring-1 ring-white/40 backdrop-blur"
              >
                {muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
