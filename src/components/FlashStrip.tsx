import { computeValue, fmt } from '../lib/value'
import type { Promo } from '../types'
import { Countdown } from './Countdown'
import { Icon } from './Icon'
import { Monogram } from './PromoCard'

export function FlashStrip({ promos, onOpen }: { promos: Promo[]; onOpen: (id: string) => void }) {
  if (promos.length === 0) return null
  return (
    <section className="flash" aria-label="โปรใกล้หมดเวลา">
      <div className="section-head">
        <h2>
          <span className="flash__bolt">
            <Icon name="bolt" size={14} filled />
          </span>
          ใกล้หมดเวลา
        </h2>
        <span className="section-head__note">{promos.length} โปร</span>
      </div>
      <div className="flash__rail">
        {promos.map((p) => {
          const v = computeValue(p)
          return (
            <button key={p.id} className="flash__item" data-cat={p.category} onClick={() => onOpen(p.id)}>
              <div className="flash__top">
                <Monogram brand={p.brand} />
                <strong>{p.brand}</strong>
              </div>
              <div className="flash__value">
                ฿{fmt(Math.round(v.savingsBaht))}
                <small>{fmt(Math.round(v.valuePct))}%</small>
              </div>
              <p className="flash__title">{p.title}</p>
              <Countdown expiresAt={p.expiresAt} />
            </button>
          )
        })}
      </div>
    </section>
  )
}
