import type { Field, GlobalConfig } from 'payload'
import { anyone, isStaff } from '../access'
import { seoFields } from '../fields/seo'
import { requiredInDefaultLocale } from '../fields/localized-required'

const cta = (name: string, label: string): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', localized: true, admin: { width: '50%' } },
        { name: 'href', type: 'text', admin: { width: '50%', description: 'e.g. /category/mango' } },
      ],
    },
  ],
})

const enabled = (defaultValue = true): Field => ({ name: 'enabled', type: 'checkbox', defaultValue })

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  admin: { group: 'Content', description: 'Every homepage section, in page order. Hidden sections are skipped.' },
  access: { read: anyone, update: isStaff },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Top',
          fields: [
            {
              name: 'announcement',
              label: 'Announcement bar',
              type: 'group',
              fields: [
                enabled(),
                { name: 'text', type: 'text', localized: true },
                { name: 'href', type: 'text', admin: { description: 'Optional link, e.g. /category/mango' } },
                {
                  name: 'tone',
                  type: 'select',
                  defaultValue: 'green',
                  options: [
                    { label: 'Deep green', value: 'green' },
                    { label: 'Mango yellow', value: 'mango' },
                    { label: 'Cream', value: 'cream' },
                  ],
                },
              ],
            },
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'headline', type: 'text', localized: true, validate: requiredInDefaultLocale, admin: { description: 'Wrap words in **double asterisks** to make them bold, e.g. আমাদের **ক্যাটাগরিসমূহ**.' } },
                { name: 'subheadline', type: 'textarea', localized: true },
                { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Large mango photograph or artwork. Transparent PNG/WebP cut-outs look best.' } },
                {
                  name: 'video',
                  label: 'Hero video (optional)',
                  type: 'relationship',
                  relationTo: 'videos',
                  admin: { description: 'A wide (16:9) video post that plays silently in a loop instead of the image. Its poster is shown while loading.' },
                },
                cta('primaryCta', 'Primary button'),
                cta('secondaryCta', 'Secondary button'),
                {
                  name: 'seasonalBadge',
                  type: 'group',
                  fields: [enabled(), { name: 'text', type: 'text', localized: true, admin: { description: 'e.g. "মৌসুম চলছে"' } }],
                },
              ],
            },
            {
              name: 'benefits',
              label: 'Trust benefits',
              type: 'array',
              maxRows: 4,
              admin: { description: 'Up to four short promises you can keep.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'icon',
                      type: 'select',
                      defaultValue: 'leaf',
                      admin: { width: '25%' },
                      options: ['leaf', 'package', 'truck', 'wallet', 'shield', 'phone', 'clock', 'heart'].map((v) => ({ label: v, value: v })),
                    },
                    { name: 'title', type: 'text', localized: true, validate: requiredInDefaultLocale, admin: { width: '35%' } },
                    { name: 'text', type: 'text', localized: true, admin: { width: '40%' } },
                  ],
                },
              ],
            },
            {
              name: 'marquee',
              label: 'Scrolling strip',
              type: 'group',
              admin: { description: 'A slowly scrolling band of short phrases between sections (pauses on hover, still for reduced-motion users).' },
              fields: [
                enabled(),
                {
                  name: 'items',
                  type: 'array',
                  maxRows: 10,
                  fields: [{ name: 'text', type: 'text', localized: true, validate: requiredInDefaultLocale }],
                },
              ],
            },
          ],
        },
        {
          label: 'Products',
          fields: [
            {
              name: 'categoriesSection',
              type: 'group',
              fields: [
                enabled(),
                { name: 'heading', type: 'text', localized: true, admin: { description: 'Wrap words in **double asterisks** to make them bold, e.g. আমাদের **ক্যাটাগরিসমূহ**.' } },
                { name: 'linkLabel', type: 'text', localized: true, admin: { description: 'Link to the shop beside the heading, e.g. "যা খুঁজছেন".' } },
                { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true, admin: { description: 'In display order. Empty = featured categories. Card colours and cut-out images are set on each category (Card design tab).' } },
              ],
            },
            {
              name: 'featured',
              label: 'Featured mangoes',
              type: 'group',
              fields: [
                enabled(),
                { name: 'heading', type: 'text', localized: true },
                { name: 'intro', type: 'text', localized: true },
                { name: 'category', type: 'relationship', relationTo: 'categories', admin: { description: 'Products come from this category (featured first).' } },
                { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true, admin: { description: 'Optional hand-picked list, overrides the category.' } },
                { name: 'limit', type: 'number', defaultValue: 8, min: 2, max: 16 },
                cta('cta', 'Button'),
              ],
            },
            {
              name: 'traditional',
              label: 'Other traditional foods',
              type: 'group',
              fields: [
                enabled(),
                { name: 'heading', type: 'text', localized: true },
                { name: 'intro', type: 'text', localized: true },
                { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true, admin: { description: 'Which categories appear, in order.' } },
                { name: 'perCategory', type: 'number', defaultValue: 4, min: 1, max: 8 },
              ],
            },
            {
              name: 'popular',
              label: 'Popular products & bundles',
              type: 'group',
              fields: [
                enabled(),
                { name: 'heading', type: 'text', localized: true },
                { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true, admin: { description: 'Empty = products marked "best seller" and bundles.' } },
              ],
            },
          ],
        },
        {
          label: 'Story, video & promo',
          fields: [
            {
              name: 'promo',
              label: 'Promotional banner',
              type: 'group',
              fields: [
                enabled(),
                { name: 'heading', type: 'text', localized: true },
                { name: 'text', type: 'textarea', localized: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
                cta('cta', 'Button'),
              ],
            },
            {
              name: 'story',
              label: 'Brand story',
              type: 'group',
              fields: [
                enabled(),
                { name: 'eyebrow', type: 'text', localized: true, admin: { description: 'Small line above the heading, e.g. "আমাদের গল্প".' } },
                { name: 'heading', type: 'text', localized: true, admin: { description: 'Wrap words in **double asterisks** to make them bold, e.g. আমাদের **ক্যাটাগরিসমূহ**.' } },
                { name: 'body', type: 'textarea', localized: true, admin: { description: 'Paragraphs separated by a blank line. Only include claims you can stand behind.' } },
                {
                  name: 'steps',
                  type: 'array',
                  maxRows: 5,
                  admin: { description: 'Optional numbered steps, e.g. how the product is made.' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'title', type: 'text', localized: true, validate: requiredInDefaultLocale, admin: { width: '35%' } },
                        { name: 'text', type: 'text', localized: true, admin: { width: '65%' } },
                      ],
                    },
                  ],
                },
                { name: 'video', type: 'relationship', relationTo: 'videos', admin: { description: 'Vertical video post shown as a phone-style reel. Leave empty to show the image instead.' } },
                { name: 'image', type: 'upload', relationTo: 'media' },
                cta('cta', 'Button'),
              ],
            },
            {
              name: 'reels',
              label: 'Video reels',
              type: 'group',
              admin: { description: 'A row of short vertical videos. They play silently while on screen; visitors tap one to watch with sound.' },
              fields: [
                enabled(),
                { name: 'heading', type: 'text', localized: true, admin: { description: 'Wrap words in **double asterisks** to make them bold, e.g. আমাদের **ক্যাটাগরিসমূহ**.' } },
                { name: 'intro', type: 'text', localized: true },
                { name: 'videos', type: 'relationship', relationTo: 'videos', hasMany: true, admin: { description: 'In display order. Empty = all published video posts marked "Show in reels".' } },
                { name: 'limit', type: 'number', defaultValue: 8, min: 1, max: 16 },
              ],
            },
          ],
        },
        {
          label: 'Reviews & FAQ',
          fields: [
            {
              name: 'testimonials',
              type: 'group',
              fields: [enabled(), { name: 'heading', type: 'text', localized: true }],
              admin: { description: 'Shows approved reviews that customers agreed to publish. Hidden automatically when there are none.' },
            },
            {
              name: 'faq',
              type: 'group',
              fields: [enabled(), { name: 'heading', type: 'text', localized: true }],
            },
          ],
        },
        { label: 'SEO', fields: [seoFields()] },
      ],
    },
  ],
}
