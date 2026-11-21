import { Fragment, useMemo, useState } from 'react'
import { Banner } from '../components/Banner'
import { CategoryRow } from '../components/CategoryRow'
import { Empty } from '../components/Empty'
import { FlashStrip } from '../components/FlashStrip'
import { HeroCarousel } from '../components/HeroCarousel'
import { PromoCard } from '../components/PromoCard'
import { DAY, useNow } from '../lib/time'
import { useCountUp } from '../lib/useCountUp'
import { bestPerCategory, computeValue, fmt, rankBySavings, rankByValue } from '../lib/value'
import type { CategoryId, Promo } from '../types'

/** โปรใกล้หมดเวลาต้องคุ้มอย่างน้อยเท่านี้จึงขึ้นแถบเร่งด่วน */
const FLASH_MIN_PCT = 10

interface Props {
  promos: Promo[]
  saved: Set<string>
  owned: Set<string>
  onOpen: (id: string) => void
  onToggleSave: (id: string) => void
  onAdd: () => void
}

export function Feed({ promos, saved, owned, onOpen, onToggleSave, onAdd }: Props) {
  const [cat, setCat] = useState<CategoryId | 'all'>('all')
  const [sort, setSort] = useState<'baht' | 'pct'>('baht')
  const [mineOnly, setMineOnly] = useState(false)
  const now = useNow()

  const organic = useMemo(() => promos.filter((p) => !p.sponsored), [promos])
  const sponsored = useMemo(() => promos.filter((p) => p.sponsored), [promos])
  const bySavings = useMemo(() => rankBySavings(organic), [organic])
  const best = useMemo(() => bestPerCategory(organic), [organic])

  const flash = rankByValue(
    organic.filter((p) => p.expiresAt - now < DAY && computeValue(p).valuePct >= FLASH_MIN_PCT),
  ).slice(0, 8)

  const ranked = sort === 'baht' ? bySavings : rankByValue(organic)
  const list = ranked.filter((p) => (cat === 'all' || p.category === cat) && (!mineOnly || owned.has(p.brand)))
  const ads = cat === 'all' ? sponsored : sponsored.filter((p) => p.category === cat)
  const top = bySavings[0] ? Math.round(computeValue(bySavings[0]).savingsBaht) : 0
  const topShown = useCountUp(top)

  const card = (p: Promo) => (
    <PromoCard
      key={p.id}
      promo={p}
      best={best.has(p.id)}
      owned={owned.has(p.brand)}
      saved={saved.has(p.id)}
      onOpen={() => onOpen(p.id)}
      onToggleSave={() => onToggleSave(p.id)}
    />
  )

  return (
    <>
      <header className="top">
        <div className="top__row">
          <div className="brandmark">
            <span className="brandmark__logo" aria-hidden="true" />
            <h1>คุ้มก่อน</h1>
          </div>
          <span className="sample-pill">ข้อมูลตัวอย่าง</span>
        </div>
        <p className="top__sum">
          วันนี้ประหยัดได้สูงสุด <strong>฿{fmt(topShown)}</strong> จาก {organic.length} โปร
        </p>
      </header>

      <HeroCarousel promos={bySavings.slice(0, 4)} onOpen={onOpen} />
      <CategoryRow value={cat} onChange={setCat} />
      {cat === 'all' && !mineOnly && <FlashStrip promos={flash} onOpen={onOpen} />}

      <div className="section-head">
        <h2>โปรทั้งหมด</h2>
        <div className="segment segment--sm" role="radiogroup" aria-label="เรียงตาม">
          <button role="radio" aria-checked={sort === 'baht'} onClick={() => setSort('baht')}>
            ประหยัดมากสุด
          </button>
          <button role="radio" aria-checked={sort === 'pct'} onClick={() => setSort('pct')}>
            คุ้ม % สูงสุด
          </button>
        </div>
      </div>
      {owned.size > 0 && (
        <label className="toggle">
          <input id="feed-mine-only" type="checkbox" checked={mineOnly} onChange={(e) => setMineOnly(e.target.checked)} />
          <span>แสดงเฉพาะแอปและบัตรที่ฉันมี ({owned.size})</span>
        </label>
      )}

      <div className="list">
        {list.length === 0 && (
          <Empty icon="search" title="ยังไม่มีโปรที่ตรงกับตัวเลือกนี้">
            ลองเลือกหมวดอื่น หรือปิดตัวกรองแอปที่ฉันมี
          </Empty>
        )}
        {list.map((p, i) => (
          <Fragment key={p.id}>
            {card(p)}
            {i === 2 && ads[0] && card(ads[0])}
            {i === 6 && <Banner />}
            {i === 10 && ads[1] && card(ads[1])}
          </Fragment>
        ))}
      </div>

      <button className="add-row" onClick={onAdd}>
        <span>เจอโปรที่ยังไม่มีในนี้?</span>
        <strong>+ เพิ่มโปรเอง</strong>
      </button>
      <p className="footnote">โปรทั้งหมดเป็นข้อมูลตัวอย่าง ไม่ใช่ข้อเสนอจริงของแบรนด์ · โลโก้เป็นของเจ้าของแบรนด์</p>
    </>
  )
}
