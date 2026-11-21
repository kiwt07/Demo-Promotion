import { PromoCard } from '../components/PromoCard'
import { computeValue, fmt } from '../lib/value'
import type { Promo } from '../types'

interface Props {
  savedPromos: Promo[]
  mine: Promo[]
  saved: Set<string>
  onOpen: (id: string) => void
  onToggleSave: (id: string) => void
  onAdd: () => void
}

export function Mine({ savedPromos, mine, saved, onOpen, onToggleSave, onAdd }: Props) {
  const total = savedPromos.reduce((sum, p) => sum + computeValue(p).savingsBaht, 0)
  const list = (promos: Promo[]) =>
    promos.map((p) => (
      <PromoCard
        key={p.id}
        promo={p}
        saved={saved.has(p.id)}
        onOpen={() => onOpen(p.id)}
        onToggleSave={() => onToggleSave(p.id)}
      />
    ))

  return (
    <>
      <header className="top">
        <h1 className="page-title">ของฉัน</h1>
      </header>

      <div className="summary">
        <span>ถ้าใช้ครบทุกโปรที่บันทึกไว้ คุณจะคุ้ม</span>
        <strong>฿{fmt(Math.round(total))}</strong>
        <small>จาก {savedPromos.length} โปรที่บันทึก</small>
      </div>

      <div className="section-head">
        <h2>โปรที่บันทึกไว้</h2>
      </div>
      <div className="list">
        {savedPromos.length === 0 ? (
          <p className="empty">ยังไม่มีโปรที่บันทึก แตะไอคอนที่คั่นบนการ์ดเพื่อเก็บไว้ดูทีหลัง</p>
        ) : (
          list(savedPromos)
        )}
      </div>

      <div className="section-head">
        <h2>โปรที่ฉันเพิ่มเอง</h2>
        <button className="link" onClick={onAdd}>
          + เพิ่มโปร
        </button>
      </div>
      <div className="list">
        {mine.length === 0 ? (
          <p className="empty">เจอโปรดีที่ยังไม่มีในแอป? เพิ่มเก็บไว้ดูเองหรือส่งให้ทุกคนเห็นได้</p>
        ) : (
          list(mine)
        )}
      </div>
    </>
  )
}
