import { useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import { PromoCard } from '../components/PromoCard'
import { CATEGORIES } from '../data/categories'
import { rankByValue } from '../lib/value'
import type { CategoryId, Promo } from '../types'

type Sort = 'value' | 'ending' | 'new'
const SORTS: { id: Sort; label: string }[] = [
  { id: 'value', label: 'คุ้มสุด' },
  { id: 'ending', label: 'ใกล้หมด' },
  { id: 'new', label: 'ใหม่สุด' },
]

interface Props {
  promos: Promo[]
  saved: Set<string>
  onOpen: (id: string) => void
  onToggleSave: (id: string) => void
}

export function Explore({ promos, saved, onOpen, onToggleSave }: Props) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<CategoryId | null>(null)
  const [sort, setSort] = useState<Sort>('value')

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const hit = promos.filter(
      (p) =>
        (!cat || p.category === cat) &&
        (!needle || `${p.brand} ${p.title}`.toLowerCase().includes(needle)),
    )
    if (sort === 'ending') return [...hit].sort((a, b) => a.expiresAt - b.expiresAt)
    if (sort === 'new') return [...hit].sort((a, b) => b.createdAt - a.createdAt)
    return rankByValue(hit)
  }, [promos, q, cat, sort])

  const browsing = !q.trim() && !cat

  return (
    <>
      <header className="top">
        <h1 className="page-title">สำรวจ</h1>
        <label className="search">
          <Icon name="search" size={18} />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาแบรนด์หรือโปร"
            aria-label="ค้นหาแบรนด์หรือโปร"
          />
        </label>
      </header>

      <div className="tiles">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className="tile"
            data-cat={c.id}
            aria-pressed={cat === c.id}
            onClick={() => setCat(cat === c.id ? null : c.id)}
          >
            <span className="tile__icon">
              <Icon name={c.icon} size={22} />
            </span>
            <strong>{c.name}</strong>
            <small>{promos.filter((p) => p.category === c.id).length} โปร</small>
          </button>
        ))}
      </div>

      <div className="section-head">
        <h2>{browsing ? 'โปรทั้งหมด' : `พบ ${results.length} โปร`}</h2>
        <div className="segment segment--sm" role="radiogroup" aria-label="เรียงตาม">
          {SORTS.map((s) => (
            <button key={s.id} role="radio" aria-checked={sort === s.id} onClick={() => setSort(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="list">
        {results.length === 0 && <p className="empty">ไม่พบโปรที่ตรงกับคำค้น ลองคำอื่นหรือเลือกหมวดอื่น</p>}
        {results.map((p) => (
          <PromoCard
            key={p.id}
            promo={p}
            saved={saved.has(p.id)}
            onOpen={() => onOpen(p.id)}
            onToggleSave={() => onToggleSave(p.id)}
          />
        ))}
      </div>
    </>
  )
}
