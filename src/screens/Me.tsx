import { BrandPicker } from '../components/BrandPicker'
import { Empty } from '../components/Empty'
import { PromoCard } from '../components/PromoCard'
import type { Promo } from '../types'

interface Props {
  mine: Promo[]
  saved: Set<string>
  owned: Set<string>
  onToggleOwned: (brand: string) => void
  onOpen: (id: string) => void
  onToggleSave: (id: string) => void
  onAdd: () => void
  onReplayIntro: () => void
}

export function Me({ mine, saved, owned, onToggleOwned, onOpen, onToggleSave, onAdd, onReplayIntro }: Props) {
  return (
    <>
      <header className="top">
        <h1 className="page-title">ของฉัน</h1>
      </header>

      <div className="section-head">
        <h2>โปรที่ฉันเพิ่มเอง</h2>
        <button className="btn btn--primary btn--sm" onClick={onAdd}>
          + เพิ่มโปร
        </button>
      </div>
      <div className="list">
        {mine.length === 0 ? (
          <Empty icon="plus" title="ยังไม่มีโปรที่คุณเพิ่ม">
            เจอโปรดีที่ยังไม่มีในแอป? เพิ่มเก็บไว้ดูเอง หรือส่งให้ทุกคนเห็นได้
          </Empty>
        ) : (
          mine.map((p) => (
            <PromoCard key={p.id} promo={p} saved={saved.has(p.id)} onOpen={() => onOpen(p.id)} onToggleSave={() => onToggleSave(p.id)} />
          ))
        )}
      </div>

      <div className="section-head">
        <h2>แอปและบัตรที่ฉันมี</h2>
        <span className="section-head__note">เลือกแล้ว {owned.size}</span>
      </div>
      <p className="hint">ใช้บอกว่าโปรไหนคุณใช้ได้เลย และกรองหน้าแรกให้เหลือเฉพาะของคุณ</p>
      <BrandPicker selected={owned} onToggle={onToggleOwned} label="แอปและบัตรที่ฉันมี" />

      <button className="link link--center" onClick={onReplayIntro}>
        ดูคำแนะนำการใช้งานอีกครั้ง
      </button>
    </>
  )
}
