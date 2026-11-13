/**
 * Dev-only: regenerates the SAMPLE video clips in scripts/seed/assets/ from the original seed artwork.
 * The resulting .mp4/.jpg files are committed, so `npm run seed` never needs ffmpeg.
 *   npx tsx scripts/seed/make-sample-videos.ts      (requires ffmpeg with libx264 on PATH)
 * Replace these placeholders with your own footage in Admin → Content → Video posts.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'
import * as art from './art'

const OUT = path.join(import.meta.dirname, 'assets')
const W = 1440
const H = 2560

const clips = [
  { key: 'reel-mango', svg: art.mangoCutout(), bg: ['#FFE07A', '#F59A23'] },
  { key: 'reel-gur', svg: art.gurArt('khejur', true), bg: ['#F3D3A8', '#9A4E1E'] },
  { key: 'reel-achar', svg: art.acharArt('mixed', true), bg: ['#E7F0C8', '#477B3B'] },
]

async function frame(svg: string, [top, bottom]: string[]): Promise<Buffer> {
  const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
    <radialGradient id="r" cx="50%" cy="42%" r="45%"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".55"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/><circle cx="${W / 2}" cy="${H * 0.42}" r="${W * 0.62}" fill="url(#r)"/></svg>`
  const subject = await sharp(Buffer.from(svg)).resize(1300, 1300).png().toBuffer()
  return sharp(Buffer.from(bgSvg))
    .composite([{ input: subject, left: Math.round((W - 1300) / 2), top: Math.round(H * 0.42 - 650) }])
    .png()
    .toBuffer()
}

const tmp = mkdtempSync(path.join(os.tmpdir(), 'reels-'))
try {
  for (const c of clips) {
    const png = path.join(tmp, `${c.key}.png`)
    await sharp(await frame(c.svg, c.bg)).toFile(png)
    // Slow push-in with a gentle vertical drift (Ken Burns), 7 s at 30 fps, 720×1280 H.264, web-optimised.
    execFileSync('ffmpeg', [
      '-y', '-loglevel', 'error', '-loop', '1', '-i', png,
      '-vf', "zoompan=z='1+0.0009*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)+sin(on/35)*40':d=210:s=720x1280:fps=30,format=yuv420p",
      '-t', '7', '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-movflags', '+faststart', '-an',
      path.join(OUT, `${c.key}.mp4`),
    ])
    await sharp(png).resize(720, 1280).jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(OUT, `${c.key}.jpg`))
    console.log('wrote', c.key)
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
