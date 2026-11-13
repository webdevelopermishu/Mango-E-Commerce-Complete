import { Fragment } from 'react'

/**
 * Renders admin text where **double asterisks** mark emphasised words, e.g. "আমাদের **ক্যাটাগরিসমূহ**".
 * Only bold markers are understood; everything else is plain text (no HTML injection possible).
 */
export function Emph({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  // No emphasis marked: render the whole heading at a solid weight instead of all-light.
  if (!parts.some((p) => p.startsWith('**'))) return <span className="hl-solid">{text}</span>
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <Fragment key={i}>{p}</Fragment>,
      )}
    </>
  )
}

/** Plain-text version (for metadata, alt text, aria labels). */
export const stripEmph = (text: string) => text.replace(/\*\*([^*]+)\*\*/g, '$1')
