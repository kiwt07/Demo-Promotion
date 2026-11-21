import { useState, type ChangeEvent } from 'react'
import { BRANDS, getBrand } from '../data/brands'
import { CATEGORIES } from '../data/categories'
import { POINT_PROGRAMS } from '../data/pointRates'
import { DAY } from '../lib/time'
import { computeValue, fmt, payLine } from '../lib/value'
import type { Benefit, CategoryId, Promo } from '../types'
import { BrandLogo } from './BrandLogo'
import { Icon } from './Icon'
import { Sheet } from './Sheet'

type Kind = Benefit['kind']

const KINDS: { id: Kind; label: string; unit: string }[] = [
  { id: 'percent', label: 'ส่วนลด %', unit: '%' },
  { id: 'baht', label: 'ลดเป็นบาท', unit: '฿' },
  { id: 'cashback', label: 'เงินคืน %', unit: '%' },
  { id: 'points', label: 'แต้ม', unit: 'แต้ม' },
]
const STEPS = ['โปรอะไร', 'คุ้มเท่าไร', 'รายละเอียดเพิ่ม']

const toLocalInput = (ms: number) => {
  const d = new Date(ms - new Date(ms).getTimezoneOffset() * 60_000)
  return d.toISOString().slice(0, 16)
}

/** ย่อรูปให้เล็กพอเก็บในเครื่อง */
function shrinkImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('อ่านรูปไม่ได้'))
      img.onload = () => {
        const scale = Math.min(1, 480 / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.72))
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

interface Props {
  onClose: () => void
  onSubmit: (promo: Promo) => void
}

export function AddPromoForm({ onClose, onSubmit }: Props) {
  const [step, setStep] = useState(0)
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
  const [image, setImage] = useState<string>()
  const [visibility, setVisibility] = useState<'private' | 'pending'>('private')
  const [error, setError] = useState('')

  const num = (s: string) => {
    const n = Number(s)
    return Number.isFinite(n) && n > 0 ? n : 0
  }

  const pickBrand = (name: string) => {
    setBrand(name)
    const known = getBrand(name)
    if (known) setCategory(known.category)
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
      image,
      source: 'user',
      visibility,
    }
  }

  const preview = draft()
  const v = preview ? computeValue(preview) : null

  const check = (s: number): string => {
    if (s === 0 && (!title.trim() || !brand.trim())) return 'กรอกแบรนด์และชื่อโปรก่อนไปต่อ'
    if (s === 1 && !preview) return 'กรอกมูลค่าของโปรเป็นตัวเลขที่มากกว่า 0'
    if (s === 2 && preview) {
      if (preview.expiresAt <= Date.now()) return 'วันหมดอายุต้องเป็นเวลาในอนาคต'
      if (preview.url && !/^https?:\/\//i.test(preview.url)) return 'ลิงก์ต้องขึ้นต้นด้วย http:// หรือ https://'
    }
    return ''
  }

  const next = () => {
    const err = check(step)
    setError(err)
    if (err) return
    if (step < 2) setStep(step + 1)
    else if (preview) onSubmit(preview)
  }

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setImage(await shrinkImage(file))
    } catch {
      setError('อ่านรูปนี้ไม่ได้ ลองรูปอื่น')
    }
  }

  const unit = KINDS.find((k) => k.id === kind)!.unit

  const footer = (
    <div className="actions">
      {step > 0 ? (
        <button className="btn btn--ghost" onClick={() => (setError(''), setStep(step - 1))}>
          ย้อนกลับ
        </button>
      ) : (
        <span />
      )}
      <button className="btn btn--primary" onClick={next}>
        {step < 2 ? 'ถัดไป' : 'บันทึกโปร'}
      </button>
    </div>
  )

  return (
    <Sheet title="เพิ่มโปรโมชั่น" onClose={onClose} footer={footer}>
      <ol className="stepper" aria-label={`ขั้นที่ ${step + 1} จาก 3`}>
        {STEPS.map((s, i) => (
          <li key={s} className={i === step ? 'is-on' : i < step ? 'is-done' : ''}>
            <span>{i < step ? <Icon name="check" size={12} /> : i + 1}</span>
            {s}
          </li>
        ))}
      </ol>

      <div className="form">
        {step === 0 && (
          <>
            <div className="field">
              <span id="f-brand">แบรนด์ / แอป</span>
              <div className="rail rail--brands" role="group" aria-labelledby="f-brand">
                {BRANDS.map((b) => (
                  <button
                    type="button"
                    key={b.name}
                    className="brand-chip"
                    aria-pressed={brand === b.name}
                    onClick={() => pickBrand(b.name)}
                  >
                    <BrandLogo brand={b.name} size={40} />
                    {b.name}
                  </button>
                ))}
              </div>
              <input
                id="add-brand"
                value={brand}
                onChange={(e) => pickBrand(e.target.value)}
                placeholder="หรือพิมพ์ชื่อแบรนด์เอง"
                aria-labelledby="f-brand"
                maxLength={30}
              />
            </div>
            <label className="field">
              <span>ชื่อโปร</span>
              <input id="add-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="เช่น ลด 20% เมื่อซื้อครบ ฿500" maxLength={80} />
            </label>
            <div className="field">
              <span id="f-cat">หมวดหมู่</span>
              <div className="pick" role="radiogroup" aria-labelledby="f-cat">
                {CATEGORIES.map((c) => (
                  <button type="button" key={c.id} role="radio" aria-checked={category === c.id} className="chip" data-cat={c.id} onClick={() => setCategory(c.id)}>
                    <Icon name={c.icon} size={15} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="field">
              <span id="f-kind">โปรนี้ให้อะไร</span>
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
                <input id="add-amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
              </label>
              {(kind === 'percent' || kind === 'cashback') && (
                <label className="field">
                  <span>สูงสุด (฿) ถ้ามี</span>
                  <input id="add-cap" inputMode="decimal" value={cap} onChange={(e) => setCap(e.target.value)} placeholder="ไม่จำกัด" />
                </label>
              )}
              {kind === 'points' && (
                <label className="field">
                  <span>ระบบแต้ม</span>
                  <select id="add-program" value={program} onChange={(e) => setProgram(e.target.value)}>
                    {POINT_PROGRAMS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </label>
              )}
            </div>
            <label className="field">
              <span>ยอดขั้นต่ำ (฿) ถ้ามี</span>
              <input id="add-min" inputMode="decimal" value={minSpend} onChange={(e) => setMinSpend(e.target.value)} placeholder="ไม่มีขั้นต่ำ" />
            </label>
            <div className="preview" aria-live="polite">
              {preview && v ? (
                <>
                  <span>{payLine(preview)}</span>
                  <strong>
                    ประหยัด ฿{fmt(Math.round(v.savingsBaht))} · {fmt(Math.round(v.valuePct))}%
                  </strong>
                </>
              ) : (
                <span>กรอกมูลค่าเพื่อดูว่าโปรนี้คุ้มเท่าไร</span>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="hint">ขั้นนี้ไม่บังคับ กด "บันทึกโปร" ได้เลย</p>
            <label className="field">
              <span>หมดอายุ</span>
              <input id="add-expires" type="datetime-local" value={expires} onChange={(e) => setExpires(e.target.value)} />
            </label>
            <label className="field">
              <span>ลิงก์ไปหน้าโปร</span>
              <input id="add-url" inputMode="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
            </label>
            <div className="field">
              <span>รูปประกอบ</span>
              <label className="upload">
                {image ? <img src={image} alt="รูปที่แนบ" /> : <Icon name="image" size={22} />}
                <span>{image ? 'เปลี่ยนรูป' : 'แนบรูปสินค้าหรือภาพหน้าจอโปร'}</span>
                <input id="add-image" type="file" accept="image/*" onChange={onFile} />
              </label>
            </div>
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
          </>
        )}

        {error && check(step) && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </div>
    </Sheet>
  )
}
