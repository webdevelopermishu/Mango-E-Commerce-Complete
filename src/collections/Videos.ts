import crypto from 'crypto'
import path from 'path'
import { APIError, type CollectionConfig } from 'payload'
import { anyone, isStaff, publishedOrStaff } from '../access'
import { requiredInDefaultLocale } from '../fields/localized-required'
import { slugify } from '../fields/slug'
import { computeTranslationStatus, translationStatusField } from '../fields/translation-status'
import { mediaDir } from './Media'

export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm']
const MB = 1024 * 1024
const maxVideoBytes = () => Number(process.env.MAX_VIDEO_UPLOAD_BYTES) || 60 * MB

/**
 * Raw video files (MP4/WebM). Kept apart from the image library so images keep their own, smaller size limit
 * and video files are never pushed through image resizing. Stored under MEDIA_DIR/videos (or the S3 bucket).
 */
export const VideoFiles: CollectionConfig = {
  slug: 'video-files',
  labels: { singular: 'Video file', plural: 'Video files' },
  admin: {
    group: 'Content',
    defaultColumns: ['filename', 'title', 'filesize', 'updatedAt'],
    description: 'MP4 (H.264) recommended. Vertical 1080×1920 for reels, 1920×1080 for wide videos. Keep clips short (15–60 s) and under the upload limit.',
  },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  hooks: {
    beforeOperation: [
      ({ req, operation }) => {
        const file = req.file
        if ((operation === 'create' || operation === 'update') && file?.name) {
          if (file.size > maxVideoBytes()) {
            throw new APIError(`Video is larger than the ${Math.round(maxVideoBytes() / MB)} MB limit. Compress it (e.g. HandBrake, 1080p, H.264) and try again.`, 413)
          }
          const ext = path.extname(file.name).toLowerCase()
          const base = slugify(path.basename(file.name, ext)) || 'video'
          file.name = `${base.slice(0, 40)}-${crypto.randomBytes(5).toString('hex')}${ext}`
        }
      },
    ],
  },
  upload: {
    staticDir: path.join(mediaDir, 'videos'),
    mimeTypes: ALLOWED_VIDEO_TYPES,
  },
  fields: [{ name: 'title', type: 'text', admin: { description: 'Internal name, e.g. "Gur making — Jan 2027".' } }],
}

/** A short video shown on the storefront: in the homepage story, the reels row, the video page and product pages. */
export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: { singular: 'Video post', plural: 'Video posts' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'orientation', 'showInReels', 'status', 'sortOrder', 'translationStatus'],
    description: 'Short videos for the homepage reels, the brand story and product pages. Upload the file under "Video files" or right here.',
  },
  defaultSort: 'sortOrder',
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { beforeChange: [computeTranslationStatus(['title'])] },
  fields: [
    { name: 'title', type: 'text', localized: true, validate: requiredInDefaultLocale, admin: { description: 'Shown over the bottom of the video.' } },
    { name: 'label', type: 'text', localized: true, admin: { description: 'Small tag next to the brand name, e.g. "প্রতিষ্ঠাতার কথা" / "Behind the scenes".' } },
    { name: 'caption', type: 'textarea', localized: true, admin: { description: 'Optional longer text shown when the video is opened.' } },
    {
      type: 'row',
      fields: [
        { name: 'file', type: 'upload', relationTo: 'video-files', required: true, admin: { width: '50%' } },
        { name: 'poster', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'Cover image shown before the video loads (recommended).' } },
      ],
    },
    {
      name: 'orientation',
      type: 'select',
      defaultValue: 'portrait',
      required: true,
      options: [
        { label: 'Vertical 9:16 (reels)', value: 'portrait' },
        { label: 'Wide 16:9', value: 'landscape' },
      ],
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: { description: 'Products featured in this video: a "Shop" button links to the first, and the video appears on these product pages.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'showInReels', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', description: 'Include in the homepage reels row and the videos page.' } },
    { name: 'sortOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar', description: 'Lower numbers appear first.' } },
    translationStatusField(),
  ],
}
