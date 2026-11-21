import { Empty } from '../components/Empty'
import { PromoCard } from '../components/PromoCard'
import { useCountUp } from '../lib/useCountUp'
import { computeValue, fmt } from '../lib/value'
import type { Promo } from '../types'

interface Props {
  promos: Promo[]
  owned: Set<string>
  onOpen: (id: string) => void
  onToggleSave: (id: string) => void
  onBrowse: () => void
}

export function Saved({ promos, owned, onOpen, onToggleSave, onBrowse }: Props) {
  const total = Math.round(promos.reduce((sum, p) => sum + computeValue(p).savingsBaht, 0))
  const shown = useCountUp(total)
  return (
    <>
      <header className="top">
        <h1 className="page-title">ที่บันทึก</h1>
      </header>
      {promos.length === 0 ? (
        <Empty icon="bookmark" title="ยังไม่มีโปรที่บันทึก">
          แตะไอคอนที่คั่นบนการ์ดเพื่อเก็บโปรไว้ใช้ทีหลัง
          <button className="btn btn--primary" onClick={onBrowse}>
            ไปดูโปร
          </button>
        </Empty>
      ) : (
        <>
          <div className="summary">
            <span>ถ้าใช้ครบทุกโปรที่บันทึกไว้ คุณประหยัด</span>
            <strong>฿{fmt(shown)}</strong>
            <small>จาก {promos.length} โปร</small>
          </div>
          <div className="list list--gap">
            {promos.map((p) => (
              <PromoCard
                key={p.id}
                promo={p}
                saved
                owned={owned.has(p.brand)}
                onOpen={() => onOpen(p.id)}
                onToggleSave={() => onToggleSave(p.id)}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}
