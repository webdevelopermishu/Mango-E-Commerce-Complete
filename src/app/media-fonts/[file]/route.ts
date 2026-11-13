import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'

export const dynamic = 'force-dynamic'

const TYPES: Record<string, string> = { '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf' }

/**
 * Serves self-hosted custom fonts from MEDIA_DIR/fonts (e.g. the Bangla hero-title font).
 * Lives outside the build so a font can be added or replaced on the server without rebuilding,
 * and survives redeploys like the rest of the uploads. Only plain font file names are accepted.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  const ext = path.extname(file).toLowerCase()
  if (!/^[a-z0-9][a-z0-9._-]{0,80}$/i.test(file) || !TYPES[ext]) return new Response('Not found', { status: 404 })
  const dir = path.resolve(process.env.MEDIA_DIR || path.join(process.cwd(), 'media'), 'fonts')
  const full = path.join(dir, file)
  try {
    const info = await stat(full)
    if (!info.isFile()) throw new Error('not a file')
    const body = await readFile(full)
    return new Response(new Uint8Array(body), {
      headers: {
        'Content-Type': TYPES[ext],
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Last-Modified': info.mtime.toUTCString(),
        'X-Content-Type-Options': 'nosniff',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'public, max-age=300' } })
  }
}
