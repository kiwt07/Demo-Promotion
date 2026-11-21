import { useState, type FormEvent } from 'react'
import { CATEGORIES } from '../data/categories'
import { POINT_PROGRAMS } from '../data/pointRates'
import { DAY } from '../lib/time'
import { computeValue, fmt } from '../lib/value'
import type { Benefit, CategoryId, Promo } from '../types'
import { Icon } from './Icon'
import { Sheet } from './Sheet'

type Kind = Benefit['kind']

const KINDS: { id: Kind; label: string; unit: string }[] = [
  { id: 'percent', label: 'ส่วนลด %', unit: '%' },
  { id: 'baht', label: 'ลดเป็นบาท', unit: '฿' },
  { id: 'cashback', label: 'เงินคืน %', unit: '%' },
  { id: 'points', label: 'แต้ม', unit: 'แต้ม' },
]

const toLocalInput = (ms: number) => {
  const d = new Date(ms - new Date(ms).getTimezoneOffset() * 60_000)
  return d.toISOString().slice(0, 16)
}

interface Props {
  onClose: () => void
  onSubmit: (promo: Promo) => void
}

export function AddPromoForm({ onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState<CategoryId>('shopping')
  const [kind, setKind] = useState<Kind>('percent')
  const [amount, setAmount] = useState('')
  const [cap, setCap] = useState('')
  const [program, setProgram] = useState(POINT_PROGRAMS[0])
  const [minSpend, setMinSpend] = useState('')
  const [expires, setExpires] = useState(() => toLocalInput(Date.now() + 3 * DAY))
  const [url, setUrl] = useState('')
  const [visibility, setVisibility] = useState<'private' | 'pending'>('private')
  const [error, setError] = useState('')

  const num = (s: string) => {
    const n = Number(s)
    return Number.isFinite(n) && n > 0 ? n : 0
  }

  const buildBenefit = (): Benefit | null => {
    const a = num(amount)
    if (!a) return null
    const c = num(cap) || undefined
    if (kind === 'percent') return { kind, pct: Math.min(a, 100), cap: c }
    if (kind === 'cashback') return { kind, pct: Math.min(a, 100), cap: c }
    if (kind === 'baht') return { kind, amount: a }
    return { kind, points: a, program }
  }

  const draft = (): Promo | null => {
    const benefit = buildBenefit()
    const expiresAt = new Date(expires).getTime()
    if (!benefit || Number.isNaN(expiresAt)) return null
    const now = Date.now()
    return {
      id: `u${now}`,
      title: title.trim(),
      brand: brand.trim(),
      category,
      benefit,
      minSpend: num(minSpend),
      expiresAt,
      createdAt: now,
      conditions: [],
      url: url.trim() || undefined,
      source: 'user',
      visibility,
    }
  }

  const preview = draft()
  const v = preview ? computeValue(preview) : null

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !brand.trim()) return setError('กรอกชื่อโปรและแบรนด์ก่อนบันทึก')
    if (!preview) return setError('กรอกมูลค่าของโปรเป็นตัวเลขที่มากกว่า 0')
    if (preview.expiresAt <= Date.now()) return setError('วันหมดอายุต้องเป็นเวลาในอนาคต')
    if (preview.url && !/^https?:\/\//i.test(preview.url)) return setError('ลิงก์ต้องขึ้นต้นด้วย http:// หรือ https://')
    onSubmit(preview)
  }

  const unit = KINDS.find((k) => k.id === kind)!.unit

  return (
    <Sheet title="เพิ่มโปรโมชั่น" onClose={onClose}>
      <form className="form" onSubmit={submit} noValidate>
        <label className="field">
          <span>ชื่อโปร</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="เช่น ลด 20% เมื่อซื้อครบ ฿500" maxLength={80} />
        </label>
        <label className="field">
          <span>แบรนด์ / แอป</span>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="เช่น Shopee" maxLength={30} />
        </label>

        <div className="field">
          <span id="f-cat">หมวดหมู่</span>
          <div className="pick" role="radiogroup" aria-labelledby="f-cat">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.id}
                role="radio"
                aria-checked={category === c.id}
                className="chip"
                data-cat={c.id}
                onClick={() => setCategory(c.id)}
              >
                <Icon name={c.icon} size={15} />
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <span id="f-kind">ประเภทความคุ้ม</span>
          <div className="segment" role="radiogroup" aria-labelledby="f-kind">
            {KINDS.map((k) => (
              <button type="button" key={k.id} role="radio" aria-checked={kind === k.id} onClick={() => setKind(k.id)}>
                {k.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid2">
          <label className="field">
            <span>มูลค่า ({unit})</span>
            <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
          </label>
          {(kind === 'percent' || kind === 'cashback') && (
            <label className="field">
              <span>สูงสุด (฿) ถ้ามี</span>
              <input inputMode="decimal" value={cap} onChange={(e) => setCap(e.target.value)} placeholder="ไม่จำกัด" />
            </label>
          )}
          {kind === 'points' && (
            <label className="field">
              <span>ระบบแต้ม</span>
              <select value={program} onChange={(e) => setProgram(e.target.value)}>
                {POINT_PROGRAMS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
          )}
        </div>

        <div className="grid2">
          <label className="field">
            <span>ยอดขั้นต่ำ (฿)</span>
            <input inputMode="decimal" value={minSpend} onChange={(e) => setMinSpend(e.target.value)} placeholder="ไม่มีขั้นต่ำ" />
          </label>
          <label className="field">
            <span>หมดอายุ</span>
            <input type="datetime-local" value={expires} onChange={(e) => setExpires(e.target.value)} />
          </label>
        </div>

        <label className="field">
          <span>ลิงก์ (ถ้ามี)</span>
          <input inputMode="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
        </label>

        <div className="field">
          <span id="f-vis">ใครเห็นโปรนี้</span>
          <div className="vis" role="radiogroup" aria-labelledby="f-vis">
            <button type="button" role="radio" aria-checked={visibility === 'private'} onClick={() => setVisibility('private')}>
              <Icon name="lock" size={18} />
              <strong>เก็บไว้ดูเอง</strong>
              <small>เห็นเฉพาะคุณ</small>
            </button>
            <button type="button" role="radio" aria-checked={visibility === 'pending'} onClick={() => setVisibility('pending')}>
              <Icon name="globe" size={18} />
              <strong>ส่งให้ทุกคนเห็น</strong>
              <small>ทีมงานตรวจก่อนเผยแพร่</small>
            </button>
          </div>
        </div>

        <div className="preview" aria-live="polite">
          <span>ความคุ้มโดยประมาณ</span>
          {v ? (
            <strong>
              ฿{fmt(Math.round(v.savingsBaht))} · {fmt(Math.round(v.valuePct))}%
            </strong>
          ) : (
            <strong className="muted">กรอกมูลค่าเพื่อคำนวณ</strong>
          )}
        </div>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn--primary btn--block" type="submit">
          บันทึกโปร
        </button>
      </form>
    </Sheet>
  )
}
