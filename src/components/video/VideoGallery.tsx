'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'
import type { VideoData } from '@/server/queries'
import { useI18n } from '../providers/I18nProvider'
import { VideoPlayerDialog } from './VideoPlayerDialog'
import { VideoReel } from './VideoReel'

/** Horizontal, swipeable row of reels (snap scrolling) with desktop arrow buttons and a shared player. */
export function ReelsRow({ videos, brandName }: { videos: VideoData[]; brandName: string }) {
  const { dict } = useI18n()
  const [open, setOpen] = useState<number | null>(null)
  const track = useRef<HTMLUListElement>(null)
  const scroll = (d: number) => track.current?.scrollBy({ left: d * track.current.clientWidth * 0.8, behavior: 'smooth' })
  return (
    <div className="relative">
      <ul ref={track} className="no-scrollbar -mx-4 -my-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-6 md:-mx-6 md:gap-5 md:px-6">
        {videos.map((v, i) => (
          <li key={v.id} data-reveal style={{ ['--i' as string]: i }} className="w-[62vw] max-w-[270px] shrink-0 snap-start sm:w-[42vw] md:w-[23%] md:max-w-none">
            <VideoReel video={v} brandName={brandName} onOpen={() => setOpen(i)} />
          </li>
        ))}
      </ul>
      {videos.length > 4 && (
        <div className="pointer-events-none absolute -top-16 right-0 hidden gap-2 md:flex">
          <button type="button" onClick={() => scroll(-1)} aria-label={dict.video.previous} className="btn btn-glass pointer-events-auto h-11 w-11 min-h-0 px-0">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={dict.video.next} className="btn btn-glass pointer-events-auto h-11 w-11 min-h-0 px-0">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      )}
      <VideoPlayerDialog videos={videos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </div>
  )
}

/** Responsive grid of reels (videos page). */
export function ReelsGrid({ videos, brandName }: { videos: VideoData[]; brandName: string }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {videos.map((v, i) => (
          <li key={v.id} data-reveal style={{ ['--i' as string]: i % 4 }} className={v.orientation === 'landscape' ? 'col-span-2' : ''}>
            <VideoReel video={v} brandName={brandName} onOpen={() => setOpen(i)} />
          </li>
        ))}
      </ul>
      <VideoPlayerDialog videos={videos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </>
  )
}

/** A single featured reel (brand story / hero) with its own player. */
export function FeaturedReel({ video, brandName, variant = 'story', className }: { video: VideoData; brandName: string; variant?: 'story' | 'hero'; className?: string }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <>
      <VideoReel video={video} brandName={brandName} variant={variant} onOpen={() => setOpen(0)} className={className} />
      <VideoPlayerDialog videos={[video]} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </>
  )
}
