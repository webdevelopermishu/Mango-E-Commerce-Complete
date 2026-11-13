'use client'
import { Check, Loader2, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { checkAddToCartAction } from '@/app/(frontend)/actions'
import { useCart } from '../providers/CartProvider'
import { useI18n } from '../providers/I18nProvider'

type State = 'idle' | 'adding' | 'added' | 'error'

export interface AddToCartProps {
  product: { id: number; slug: string; name: string; imageUrl: string | null }
  variant: { id: string; label: string; price: number; stock: number } | null
  quantity?: number
  size?: 'md' | 'lg'
  buyNow?: boolean
  className?: string
}

/**
 * Signature add-to-cart: checks stock on the server, shows adding → added, prevents double submits,
 * announces the result to screen readers, and opens the mini cart.
 */
export function AddToCartButton({ product, variant, quantity = 1, size = 'md', buyNow = false, className = '' }: AddToCartProps) {
  const { dict, locale } = useI18n()
  const { add, lines, setDrawerOpen } = useCart()
  const router = useRouter()
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')
  const busy = useRef(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => void (resetTimer.current && clearTimeout(resetTimer.current)), [])

  const outOfStock = !variant || variant.stock <= 0
  const inCart = variant ? (lines.find((l) => l.productId === product.id && l.variantId === variant.id)?.quantity ?? 0) : 0

  async function onClick() {
    if (busy.current || outOfStock || !variant) return
    busy.current = true
    setState('adding')
    setMessage('')
    try {
      const res = await checkAddToCartAction({ productId: product.id, variantId: variant.id, quantity: inCart + quantity, locale })
      if (!res.ok) {
        setState('error')
        setMessage(
          res.reason === 'out_of_stock'
            ? dict.product.outOfStock
            : res.reason === 'insufficient_stock'
              ? dict.cart.issues.insufficient_stock.replace('{available}', res.available.toLocaleString(locale === 'bn' ? 'bn-BD' : 'en'))
              : dict.product.addError,
        )
      } else {
        add({
          productId: product.id,
          variantId: variant.id,
          quantity,
          snapshot: { name: product.name, variantLabel: variant.label, slug: product.slug, imageUrl: product.imageUrl, unitPrice: variant.price },
        })
        setState('added')
        setMessage(dict.product.added)
        if (buyNow) router.push(`/${locale}/checkout`)
        else setDrawerOpen(true)
      }
    } catch {
      setState('error')
      setMessage(dict.product.addError)
    } finally {
      busy.current = false
      resetTimer.current = setTimeout(() => setState((s) => (s === 'adding' ? s : 'idle')), 2200)
    }
  }

  // Card buttons are narrow on phones: tighter padding, one line, smaller icon.
  const h = size === 'lg' ? 'h-14 text-base' : 'h-11 min-h-11 gap-1.5 !px-2.5 text-[0.9rem] whitespace-nowrap sm:!px-4'
  const base = `group relative inline-flex w-full select-none items-center justify-center gap-2 rounded-full px-4 font-semibold
    transition-[transform,box-shadow,filter] duration-200 active:scale-[0.97] disabled:active:scale-100 ${h}`
  // Glossy gradient pills (see .btn / .btn-leaf / .btn-mango in globals.css).
  const tone = outOfStock
    ? 'cursor-not-allowed border border-line bg-paper text-ink-soft'
    : buyNow
      ? 'btn btn-mango'
      : state === 'added'
        ? 'btn btn-leaf saturate-150'
        : 'btn btn-leaf'

  let content: React.ReactNode
  if (outOfStock) content = <span>{dict.product.outOfStock}</span>
  else if (state === 'adding')
    content = (
      <>
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        <span>{dict.product.adding}</span>
      </>
    )
  else if (state === 'added' && !buyNow)
    content = (
      <>
        <Check className="h-5 w-5" aria-hidden />
        <span>{dict.product.added}</span>
      </>
    )
  else
    content = (
      <>
        {!buyNow && <ShoppingBag className={`${size === 'lg' ? 'h-5 w-5' : 'h-4 w-4 max-[360px]:hidden'} shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:rotate-[-8deg]`} aria-hidden />}
        <span>{buyNow ? dict.product.buyNow : dict.product.addToCart}</span>
      </>
    )

  return (
    <div className={className}>
      <button
        type="button"
        onClick={onClick}
        disabled={outOfStock}
        aria-disabled={state === 'adding' || outOfStock}
        aria-busy={state === 'adding'}
        data-testid={buyNow ? 'buy-now' : 'add-to-cart'}
        data-state={outOfStock ? 'out-of-stock' : state}
        className={`${base} ${tone}`}
      >
        {content}
      </button>
      <p role={state === 'error' ? 'alert' : 'status'} aria-live="polite" className={state === 'error' ? 'mt-1.5 text-sm text-danger' : 'sr-only'}>
        {message}
      </p>
    </div>
  )
}
