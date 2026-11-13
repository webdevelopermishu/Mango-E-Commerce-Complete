import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Payload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'
import { freshPayload, seedMinimalStore } from './helpers'

let payload: Payload
let productId: number
let fileId: number
const mp4 = readFileSync(path.resolve('scripts/seed/assets/reel-mango.mp4'))

beforeAll(async () => {
  payload = await freshPayload()
  const s = await seedMinimalStore(payload)
  productId = s.product.id
  const file = await payload.create({ collection: 'video-files', data: { title: 'test' }, file: { data: mp4, mimetype: 'video/mp4', name: 'clip.mp4', size: mp4.length }, overrideAccess: true })
  fileId = file.id
})

describe('video posts', () => {
  it('stores uploads under a randomised name and serves them from the video library', async () => {
    const f = await payload.findByID({ collection: 'video-files', id: fileId, overrideAccess: true })
    expect(f.filename).toMatch(/^clip-[0-9a-f]{10}\.mp4$/)
    expect(f.url).toContain('/api/video-files/file/')
    expect(f.mimeType).toBe('video/mp4')
  })

  it('rejects non-video files in the video library', async () => {
    const png = Buffer.from('89504e470d0a1a0a', 'hex')
    await expect(
      payload.create({ collection: 'video-files', data: {}, file: { data: png, mimetype: 'image/png', name: 'x.png', size: png.length }, overrideAccess: true }),
    ).rejects.toThrow()
  })

  it('only shows published posts to visitors and keeps both languages', async () => {
    const pub = await payload.create({ collection: 'videos', locale: 'bn', data: { title: 'হিমসাগর', file: fileId, orientation: 'portrait', products: [productId], status: 'published' }, overrideAccess: true })
    await payload.update({ collection: 'videos', id: pub.id, locale: 'en', data: { title: 'Himsagar' }, overrideAccess: true })
    await payload.create({ collection: 'videos', locale: 'bn', data: { title: 'খসড়া', file: fileId, orientation: 'portrait', status: 'draft' }, overrideAccess: true })

    const visible = await payload.find({ collection: 'videos', locale: 'en', overrideAccess: false, depth: 0 })
    expect(visible.docs.map((d) => d.title)).toEqual(['Himsagar'])
    const forProduct = await payload.find({ collection: 'videos', where: { products: { in: [productId] } }, overrideAccess: false, depth: 0 })
    expect(forProduct.totalDocs).toBe(1)
  })

  it('does not let visitors create or edit video posts', async () => {
    await expect(payload.create({ collection: 'videos', data: { title: 'x', file: fileId, orientation: 'portrait', status: 'published' }, overrideAccess: false })).rejects.toThrow()
    await expect(
      payload.create({ collection: 'video-files', data: {}, file: { data: mp4, mimetype: 'video/mp4', name: 'y.mp4', size: mp4.length }, overrideAccess: false }),
    ).rejects.toThrow()
  })

  it('category card fields are saved per language', async () => {
    const cat = await payload.create({ collection: 'categories', locale: 'bn', data: { name: 'আম', slug: 'mango-2', status: 'published', tint: '#FFF1CF', subtitle: 'FRESH MANGO', comingSoon: true }, overrideAccess: true })
    await payload.update({ collection: 'categories', id: cat.id, locale: 'en', data: { subtitle: 'তাজা আম' }, overrideAccess: true })
    const bn = await payload.findByID({ collection: 'categories', id: cat.id, locale: 'bn', overrideAccess: true })
    const en = await payload.findByID({ collection: 'categories', id: cat.id, locale: 'en', overrideAccess: true })
    expect([bn.subtitle, en.subtitle, bn.tint, bn.comingSoon]).toEqual(['FRESH MANGO', 'তাজা আম', '#FFF1CF', true])
    await expect(payload.update({ collection: 'categories', id: cat.id, data: { tint: 'orange' }, overrideAccess: true })).rejects.toThrow()
  })
})
