import { categoryName } from '../data/categories'
import { benefitLabel, computeValue, fmt } from '../lib/value'
import type { Promo } from '../types'
import { Countdown } from './Countdown'
import { Icon } from './Icon'
import { Monogram, StatusBadge } from './PromoCard'
import { Sheet } from './Sheet'

interface Props {
  promo: Promo
  saved: boolean
  onClose: () => void
  onToggleSave: () => void
  onDelete?: () => void
  onToast: (msg: string) => void
}

export function PromoDetail({ promo, saved, onClose, onToggleSave, onDelete, onToast }: Props) {
  const v = computeValue(promo)

  const copyCode = async () => {
    if (!promo.code) return
    try {
      await navigator.clipboard.writeText(promo.code)
      onToast('คัดลอกโค้ดแล้ว')
    } catch {
      onToast(`โค้ด: ${promo.code}`)
    }
  }

  const go = () => {
    if (promo.url) window.open(promo.url, '_blank', 'noopener,noreferrer')
    else onToast('ตัวอย่าง: แอปจริงจะพาไปหน้าโปรผ่านลิงก์พาร์ตเนอร์')
  }

  return (
    <Sheet title="รายละเอียดโปร" onClose={onClose} cat={promo.category}>
      <div className="detail__head">
        <Monogram brand={promo.brand} />
        <div className="card__brand">
          <strong>{promo.brand}</strong>
          <span>{categoryName(promo.category)}</span>
        </div>
        <StatusBadge promo={promo} />
      </div>
      <h2 className="detail__title">{promo.title}</h2>

      <div className="hero">
        <div>
          <span className="hero__label">มูลค่าที่ได้คืน</span>
          <div className="hero__baht">฿{fmt(Math.round(v.savingsBaht))}</div>
        </div>
        <div className="hero__pct">
          <strong>{fmt(Math.round(v.valuePct))}%</strong>
          <span>ของยอดจ่าย</span>
        </div>
      </div>

      <div className="detail__row">
        <Countdown expiresAt={promo.expiresAt} large />
        <span className="muted">{benefitLabel(promo)}</span>
      </div>

      {promo.code && (
        <button className="code" onClick={copyCode}>
          <span>
            <small>โค้ดส่วนลด</small>
            <strong>{promo.code}</strong>
          </span>
          <span className="code__copy">
            <Icon name="copy" size={16} /> คัดลอก
          </span>
        </button>
      )}

      <section className="block">
        <h3>วิธีคิดความคุ้ม</h3>
        <ol className="steps">
          {v.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>

      {promo.conditions.length > 0 && (
        <section className="block">
          <h3>เงื่อนไข</h3>
          <ul className="conds">
            {promo.conditions.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      {promo.source === 'sample' && <p className="note">ข้อมูลตัวอย่างสำหรับ prototype ไม่ใช่โปรโมชั่นจริง</p>}

      <div className="actions">
        <button className={`btn btn--ghost${saved ? ' is-on' : ''}`} onClick={onToggleSave} aria-pressed={saved}>
          <Icon name="bookmark" size={18} filled={saved} />
          {saved ? 'บันทึกแล้ว' : 'บันทึก'}
        </button>
        <button className="btn btn--primary" onClick={go}>
          ไปที่โปร <Icon name="arrow" size={18} />
        </button>
      </div>
      {promo.source !== 'user' && <p className="disclosure">ลิงก์นี้อาจเป็นลิงก์พาร์ตเนอร์ที่แอปได้รับค่าตอบแทน</p>}
      {onDelete && (
        <button className="btn btn--danger" onClick={onDelete}>
          <Icon name="trash" size={16} /> ลบโปรนี้
        </button>
      )}
    </Sheet>
  )
}
