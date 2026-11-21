import { categoryName } from '../data/categories'
import { benefitLabel, computeValue, fmt } from '../lib/value'
import type { Promo } from '../types'
import { Countdown } from './Countdown'
import { Icon } from './Icon'

interface Props {
  promo: Promo
  rank?: number
  saved: boolean
  onOpen: () => void
  onToggleSave: () => void
}

export function Monogram({ brand }: { brand: string }) {
  return <span className="monogram">{brand.trim().charAt(0).toUpperCase() || '?'}</span>
}

export function StatusBadge({ promo }: { promo: Promo }) {
  if (promo.sponsored) return <span className="badge badge--sponsor">สนับสนุน</span>
  if (promo.source !== 'user') return null
  return promo.visibility === 'pending' ? (
    <span className="badge badge--pending">รอตรวจ</span>
  ) : (
    <span className="badge badge--private">ส่วนตัว</span>
  )
}

export function PromoCard({ promo, rank, saved, onOpen, onToggleSave }: Props) {
  const v = computeValue(promo)
  return (
    <article className={`card${promo.sponsored ? ' card--sponsor' : ''}`} data-cat={promo.category}>
      <button className="card__main" onClick={onOpen} aria-label={`ดูรายละเอียด ${promo.brand} ${promo.title}`}>
        <div className="card__head">
          <Monogram brand={promo.brand} />
          <div className="card__brand">
            <strong>{promo.brand}</strong>
            <span>{categoryName(promo.category)}</span>
          </div>
          {rank !== undefined && rank <= 3 && <span className="rank">#{rank}</span>}
          <StatusBadge promo={promo} />
        </div>
        <h3 className="card__title">{promo.title}</h3>
        <div className="card__value">
          <div className="value">
            <span className="value__label">คุ้ม</span>
            <span className="value__baht">฿{fmt(Math.round(v.savingsBaht))}</span>
            <span className="value__pct">{fmt(Math.round(v.valuePct))}%</span>
          </div>
          <div className="card__meta">
            <span>{benefitLabel(promo)}</span>
            <span>{promo.minSpend > 0 ? `ขั้นต่ำ ฿${fmt(promo.minSpend)}` : 'ไม่มีขั้นต่ำ'}</span>
          </div>
        </div>
        <div className="card__foot">
          <Countdown expiresAt={promo.expiresAt} />
        </div>
      </button>
      <button
        className={`save${saved ? ' save--on' : ''}`}
        onClick={onToggleSave}
        aria-pressed={saved}
        aria-label={saved ? 'เลิกบันทึก' : 'บันทึกโปรนี้'}
      >
        <Icon name="bookmark" size={18} filled={saved} />
      </button>
    </article>
  )
}
