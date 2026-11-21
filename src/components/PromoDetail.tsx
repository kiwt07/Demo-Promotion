import { categoryName } from '../data/categories'
import { benefitLabel, computeValue, fmt, payLine } from '../lib/value'
import type { Promo } from '../types'
import { BrandLogo } from './BrandLogo'
import { Countdown } from './Countdown'
import { Icon } from './Icon'
import { StatusBadge } from './PromoCard'
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

  const how = [
    promo.code ? `คัดลอกโค้ด ${promo.code}` : 'กดปุ่ม "ไปที่โปร" ด้านล่าง',
    `เปิด ${promo.brand} แล้ว${promo.code ? 'ใส่โค้ดตอนชำระเงิน' : 'กดรับสิทธิ์'}`,
    promo.minSpend > 0 ? `จ่ายครบ ฿${fmt(promo.minSpend)} ก่อนหมดเวลา` : 'จ่ายก่อนหมดเวลา ไม่มียอดขั้นต่ำ',
  ]

  const footer = (
    <>
      <div className="actions">
        <button className={`btn btn--ghost${saved ? ' is-on' : ''}`} onClick={onToggleSave} aria-pressed={saved}>
          <Icon name="bookmark" size={18} filled={saved} />
          {saved ? 'บันทึกแล้ว' : 'บันทึก'}
        </button>
        {promo.url ? (
          <a className="btn btn--primary" href={promo.url} target="_blank" rel="noopener noreferrer">
            ไปที่โปร <Icon name="arrow" size={18} />
          </a>
        ) : (
          <button className="btn btn--primary" onClick={() => onToast('ตัวอย่าง: แอปจริงจะพาไปหน้าโปรของแบรนด์')}>
            ไปที่โปร <Icon name="arrow" size={18} />
          </button>
        )}
      </div>
      {promo.source !== 'user' && <p className="disclosure">ลิงก์นี้อาจเป็นลิงก์พาร์ตเนอร์ที่แอปได้รับค่าตอบแทน</p>}
    </>
  )

  return (
    <Sheet title="รายละเอียดโปร" onClose={onClose} footer={footer}>
      {promo.source === 'sample' && <p className="sample-note">ข้อมูลตัวอย่าง ไม่ใช่โปรโมชั่นจริงของแบรนด์</p>}
      <div className="detail__head">
        <BrandLogo brand={promo.brand} size={52} />
        <div className="card__brand">
          <strong>{promo.brand}</strong>
          <span>{categoryName(promo.category)}</span>
        </div>
        <StatusBadge promo={promo} />
      </div>
      <h2 className="detail__title">{promo.title}</h2>
      {promo.image && <img className="detail__img" src={promo.image} alt="" />}

      <div className="hero">
        <div>
          <span className="hero__label">คุณประหยัด</span>
          <div className="hero__baht">฿{fmt(Math.round(v.savingsBaht))}</div>
          <span className="hero__pay">{payLine(promo)}</span>
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
        <h3>วิธีใช้</h3>
        <ol className="how">
          {how.map((s, i) => (
            <li key={i}>
              <span>{i + 1}</span>
              {s}
            </li>
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

      <details className="math">
        <summary>ดูวิธีคิดความคุ้ม</summary>
        <ol>
          {v.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </details>

      {onDelete && (
        <button className="btn btn--danger" onClick={onDelete}>
          <Icon name="trash" size={16} /> ลบโปรนี้
        </button>
      )}
    </Sheet>
  )
}
