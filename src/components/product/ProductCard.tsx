import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries/en'
import { interpolate } from '@/lib/i18n/format'
import type { ProductCardData } from '@/server/queries'
import { ProductCardActions } from './ProductCardActions'

/** Pastel tints for the image well; chosen from the slug so a product always keeps the same colour. */
const TINTS = ['#FFF0C2', '#FDE4CF', '#EAF2D3', '#FBE7D8', '#F3EDD5', '#FFE7B8', '#E6F0E0', '#FCE9C8']
const tintFor = (slug: string) => TINTS[[...slug].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7) % TINTS.length]!

export function ProductCard({ product, locale, dict, priority = false }: { product: ProductCardData; locale: Locale; dict: Dictionary; priority?: boolean }) {
  const href = `/${locale}/product/${product.slug}`
  const anyStock = product.variants.some((v) => v.stock > 0)
  const best = Math.max(0, ...product.variants.map((v) => v.discountPercent))
  // Honest badge: if not every pack size carries the same discount, say "up to".
  const uniform = product.variants.every((v) => v.discountPercent === best)
  return (
    <article className="group lift relative flex h-full flex-col rounded-[26px] border border-white/80 bg-white/70 p-2 shadow-[var(--shadow-soft)] backdrop-blur-sm" data-testid="product-card">
      <Link
        href={href}
        className="gloss relative block aspect-square overflow-hidden rounded-[20px]"
        style={{ ['--tint' as string]: tintFor(product.slug) }}
        aria-label={interpolate(dict.product.viewProduct, { name: product.name })}
      >
        <span className="absolute inset-[12%] rounded-full bg-white/60 blur-2xl" aria-hidden />
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.alt || product.name}
            fill
            sizes="(min-width:1280px) 300px, (min-width:768px) 30vw, 48vw"
            priority={priority}
            className={`object-cover mix-blend-multiply transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:-translate-y-1.5 group-hover:scale-[1.06] group-hover:rotate-[-1.5deg] ${anyStock ? '' : 'opacity-60 grayscale-[35%]'}`}
          />
        ) : null}
        <div className="absolute left-2.5 top-2.5 z-10 flex flex-col items-start gap-1.5">
          {!anyStock && <span className="rounded-full bg-ink/85 px-2.5 py-0.5 text-xs font-medium text-cream">{dict.product.outOfStock}</span>}
          {anyStock && best > 0 && (
            <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-ink shadow-[0_4px_10px_-4px_rgba(245,154,35,0.9)]" style={{ background: 'var(--grad-mango)' }}>
              {interpolate(uniform ? dict.product.off : dict.product.offUpTo, { percent: locale === 'bn' ? best.toLocaleString('bn-BD') : best })}
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-3.5">
        <h3 className="font-sans text-[1.05rem] font-semibold leading-snug text-ink">
          <Link href={href} className="transition-colors hover:text-primary">
            {product.name}
          </Link>
        </h3>
        {product.shortDescription && <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{product.shortDescription}</p>}
        <ProductCardActions product={{ id: product.id, slug: product.slug, name: product.name, imageUrl: product.image?.url ?? null }} variants={product.variants} />
      </div>
    </article>
  )
}

export function ProductGrid({ products, locale, dict, priorityCount = 0 }: { products: ProductCardData[]; locale: Locale; dict: Dictionary; priorityCount?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-5 sm:gap-y-7 md:grid-cols-3 xl:grid-cols-4">
      {products.map((p, i) => (
        <li key={p.id} data-reveal style={{ ['--i' as string]: i % 4 }}>
          <ProductCard product={p} locale={locale} dict={dict} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  )
}
