import { categoryName } from '../data/categories'
import { HOUR, useNow } from '../lib/time'
import { computeValue, fmt, payLine } from '../lib/value'
import type { Promo } from '../types'
import { BrandLogo } from './BrandLogo'
import { Countdown } from './Countdown'
import { Icon } from './Icon'

interface Props {
  promo: Promo
  saved: boolean
  /** โปรนี้คุ้มสุดในหมวดของมัน */
  best?: boolean
  /** ผู้ใช้มีแอป/บัตรของแบรนด์นี้ */
  owned?: boolean
  onOpen: () => void
  onToggleSave: () => void
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

export function PromoCard({ promo, saved, best, owned, onOpen, onToggleSave }: Props) {
  const v = computeValue(promo)
  const isNew = useNow() - promo.createdAt < 3 * HOUR && promo.source === 'sample' && !promo.sponsored
  return (
    <article className={`card${promo.sponsored ? ' card--sponsor' : ''}`}>
      <button className="card__main" onClick={onOpen} aria-label={`ดูรายละเอียด ${promo.brand} ${promo.title}`}>
        <div className="card__head">
          <BrandLogo brand={promo.brand} />
          <div className="card__brand">
            <strong>{promo.brand}</strong>
            <span>
              {categoryName(promo.category)}
              {owned && <em className="owned"> · คุณมีแอปนี้</em>}
            </span>
          </div>
        </div>
        <div className="card__body">
          <div className="card__text">
            <div className="card__tags">
              {best && <span className="badge badge--best">คุ้มสุดในหมวด</span>}
              {isNew && <span className="badge badge--new">มาใหม่</span>}
              <StatusBadge promo={promo} />
            </div>
            <h3 className="card__title">{promo.title}</h3>
          </div>
          {promo.image && <img className="card__img" src={promo.image} alt="" />}
        </div>
        <div className="save-line">
          <span className="save-line__label">ประหยัด</span>
          <span className="save-line__baht">฿{fmt(Math.round(v.savingsBaht))}</span>
          <span className="save-line__pct">{fmt(Math.round(v.valuePct))}%</span>
        </div>
        <div className="card__foot">
          <span className="card__pay">{payLine(promo)}</span>
          <Countdown expiresAt={promo.expiresAt} />
        </div>
      </button>
      <button
        key={String(saved)}
        className={`save${saved ? ' save--on' : ''}`}
        onClick={onToggleSave}
        aria-pressed={saved}
        aria-label={saved ? 'เลิกบันทึก' : 'บันทึกโปรนี้'}
      >
        <Icon name="bookmark" size={20} filled={saved} />
      </button>
    </article>
  )
}
