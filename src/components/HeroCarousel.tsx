import { useRef, useState } from 'react'
import { fallbackColor, getBrand } from '../data/brands'
import { computeValue, fmt, payLine } from '../lib/value'
import type { Promo } from '../types'
import { BrandLogo } from './BrandLogo'
import { Countdown } from './Countdown'

/** แบนเนอร์ "ดีลเด็ดวันนี้": จุดเดียวของหน้าที่ใช้สีจัด โดยใช้สีของแบรนด์เอง */
export function HeroCarousel({ promos, onOpen }: { promos: Promo[]; onOpen: (id: string) => void }) {
  const rail = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  if (promos.length === 0) return null

  const onScroll = () => {
    const el = rail.current
    if (!el) return
    const w = el.firstElementChild?.clientWidth ?? 1
    setActive(Math.round(el.scrollLeft / (w + 12)))
  }

  return (
    <section className="hero-rail" aria-label="ดีลเด็ดวันนี้">
      <div className="rail rail--hero" ref={rail} onScroll={onScroll}>
        {promos.map((p) => {
          const v = computeValue(p)
          const color = getBrand(p.brand)?.color ?? fallbackColor(p.brand)
          return (
            <button key={p.id} className="slide" style={{ ['--slide' as string]: color }} onClick={() => onOpen(p.id)}>
              <span className="slide__eyebrow">ดีลเด็ดวันนี้</span>
              <span className="slide__brand">
                <BrandLogo brand={p.brand} size={36} />
                {p.brand}
              </span>
              <span className="slide__value">
                <small>ประหยัด</small>฿{fmt(Math.round(v.savingsBaht))}
              </span>
              <span className="slide__title">{p.title}</span>
              <span className="slide__foot">
                <span>{payLine(p)}</span>
                <Countdown expiresAt={p.expiresAt} />
              </span>
            </button>
          )
        })}
      </div>
      <div className="dots" aria-hidden="true">
        {promos.map((p, i) => (
          <span key={p.id} className={i === active ? 'is-on' : ''} />
        ))}
      </div>
    </section>
  )
}
