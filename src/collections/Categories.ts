import type { CollectionConfig } from 'payload'
import { isStaff, publishedOrStaff } from '../access'
import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'
import { computeTranslationStatus, translationStatusField } from '../fields/translation-status'
import { slugRedirectHook } from '../hooks/slugRedirect'
import { requiredInDefaultLocale } from '../fields/localized-required'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Category', plural: 'Categories' },
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'slug', 'status', 'featured', 'sortOrder', 'translationStatus'],
    listSearchableFields: ['name', 'slug'],
    preview: (doc, { locale }) => `/${locale || 'bn'}/category/${doc.slug}`,
  },
  defaultSort: 'sortOrder',
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: {
    beforeChange: [computeTranslationStatus(['name'])],
    afterChange: [slugRedirectHook('category')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'name', type: 'text', localized: true, validate: requiredInDefaultLocale },
            { name: 'description', type: 'textarea', localized: true, admin: { description: 'One or two sentences shown on category cards and the category page.' } },
            { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Square-ish image for category cards.' } },
            { name: 'banner', type: 'upload', relationTo: 'media', admin: { description: 'Optional wide banner on the category page.' } },
          ],
        },
        {
          label: 'Card design',
          description: 'How this category looks in the homepage category section.',
          fields: [
            {
              name: 'cutout',
              label: 'Cut-out image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Transparent PNG/WebP of the product with no background (about 1000×1000). It floats over the card. Falls back to the normal image.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'tint',
                  label: 'Card colour',
                  type: 'text',
                  admin: { width: '33%', components: { Field: '/components/admin/ColorField#ColorField' }, description: 'Soft pastel works best, e.g. #FFF1CF.' },
                  validate: (v: string | null | undefined) => (!v || /^#[0-9a-fA-F]{6}$/.test(v) ? true : 'Use a 6-digit hex colour like #FFF1CF.'),
                },
                { name: 'subtitle', type: 'text', localized: true, admin: { width: '33%', description: 'Small caps line, e.g. "FRESH MANGO". Empty = the name in the other language.' } },
                { name: 'comingSoon', type: 'checkbox', defaultValue: false, admin: { width: '33%', description: 'Show "Coming soon" instead of the product count (e.g. out of season).' } },
              ],
            },
          ],
        },
        { label: 'SEO', fields: [seoFields()] },
      ],
    },
    slugField('name'),
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Hidden', value: 'draft' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'parent', type: 'relationship', relationTo: 'categories', admin: { position: 'sidebar' }, filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true) },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Show on the homepage category row.' } },
    { name: 'sortOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar', description: 'Lower numbers appear first.' } },
    translationStatusField(),
  ],
}
