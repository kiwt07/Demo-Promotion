import { DAY, useNow } from '../lib/time'
import { computeValue, fmt } from '../lib/value'
import type { Promo } from '../types'
import { BrandLogo } from './BrandLogo'
import { Countdown } from './Countdown'
import { Icon } from './Icon'

export function FlashStrip({ promos, onOpen }: { promos: Promo[]; onOpen: (id: string) => void }) {
  const now = useNow()
  if (promos.length === 0) return null
  return (
    <section className="flash" aria-label="โปรใกล้หมดเวลา">
      <div className="section-head">
        <h2>
          <span className="flash__bolt">
            <Icon name="bolt" size={14} filled />
          </span>
          รีบใช้ก่อนหมดเวลา
        </h2>
      </div>
      <div className="rail">
        {promos.map((p) => {
          const v = computeValue(p)
          const left = Math.max(0, Math.min(1, (p.expiresAt - now) / DAY))
          return (
            <button key={p.id} className="flash__item" onClick={() => onOpen(p.id)}>
              <div className="flash__top">
                <BrandLogo brand={p.brand} size={32} />
                <strong>{p.brand}</strong>
              </div>
              <div className="flash__value">
                <small>ประหยัด</small>฿{fmt(Math.round(v.savingsBaht))}
              </div>
              <p className="flash__title">{p.title}</p>
              <span className="flash__bar" aria-hidden="true">
                <span style={{ width: `${left * 100}%` }} />
              </span>
              <Countdown expiresAt={p.expiresAt} />
            </button>
          )
        })}
      </div>
    </section>
  )
}
