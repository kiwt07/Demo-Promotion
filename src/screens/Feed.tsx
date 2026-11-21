import { Fragment, useMemo, useState } from 'react'
import { Banner } from '../components/Banner'
import { CategoryChips } from '../components/CategoryChips'
import { FlashStrip } from '../components/FlashStrip'
import { PromoCard } from '../components/PromoCard'
import { DAY, useNow } from '../lib/time'
import { computeValue, fmt, rankByValue } from '../lib/value'
import type { CategoryId, Promo } from '../types'

interface Props {
  promos: Promo[]
  saved: Set<string>
  onOpen: (id: string) => void
  onToggleSave: (id: string) => void
}

export function Feed({ promos, saved, onOpen, onToggleSave }: Props) {
  const [cat, setCat] = useState<CategoryId | 'all'>('all')
  const now = useNow()

  const organic = useMemo(() => rankByValue(promos.filter((p) => !p.sponsored)), [promos])
  const sponsored = useMemo(() => promos.filter((p) => p.sponsored), [promos])

  const flash = organic
    .filter((p) => p.expiresAt - now < DAY)
    .sort((a, b) => a.expiresAt - b.expiresAt)
  const list = cat === 'all' ? organic : organic.filter((p) => p.category === cat)
  const ads = cat === 'all' ? sponsored : sponsored.filter((p) => p.category === cat)
  const best = organic[0] ? computeValue(organic[0]) : null

  const card = (p: Promo, rank?: number) => (
    <PromoCard
      key={p.id}
      promo={p}
      rank={rank}
      saved={saved.has(p.id)}
      onOpen={() => onOpen(p.id)}
      onToggleSave={() => onToggleSave(p.id)}
    />
  )

  return (
    <>
      <header className="top">
        <div className="brandmark">
          <span className="brandmark__logo" aria-hidden="true" />
          <h1>คุ้มก่อน</h1>
        </div>
        <p className="top__sum">
          ตอนนี้มี <strong>{organic.length} โปร</strong>
          {best && (
            <>
              {' '}
              · คุ้มสูงสุด <strong>{fmt(Math.round(best.valuePct))}%</strong>
            </>
          )}
        </p>
      </header>

      {cat === 'all' && <FlashStrip promos={flash} onOpen={onOpen} />}

      <div className="section-head section-head--sticky">
        <h2>จัดอันดับความคุ้ม</h2>
      </div>
      <CategoryChips value={cat} onChange={setCat} />

      <div className="list">
        {list.length === 0 && <p className="empty">ยังไม่มีโปรในหมวดนี้ ลองเพิ่มโปรของคุณเองด้วยปุ่ม +</p>}
        {list.map((p, i) => (
          <Fragment key={p.id}>
            {card(p, cat === 'all' ? i + 1 : undefined)}
            {i === 2 && ads[0] && card(ads[0])}
            {i === 6 && <Banner />}
            {i === 10 && ads[1] && card(ads[1])}
          </Fragment>
        ))}
      </div>
      <p className="footnote">โปรทั้งหมดเป็นข้อมูลตัวอย่าง · อันดับคิดจากมูลค่าที่ได้คืนเทียบกับยอดจ่าย</p>
    </>
  )
}
