import { POINT_RATES } from '../data/pointRates'
import type { Promo } from '../types'

/** ยอดใช้จ่ายอ้างอิงเมื่อโปรไม่มีขั้นต่ำ */
export const DEFAULT_BASIS = 1000

export interface Value {
  /** ยอดใช้จ่ายที่ใช้คิด */
  basis: number
  /** มูลค่าที่ได้คืนเป็นเงินบาท */
  savingsBaht: number
  /** มูลค่าที่ได้คืนเทียบกับยอดใช้จ่าย (%) */
  valuePct: number
  /** ขั้นตอนการคิด สำหรับแสดงให้ผู้ใช้ดู */
  steps: string[]
}

const baht = (n: number) => `฿${fmt(n)}`
export const fmt = (n: number) =>
  n.toLocaleString('th-TH', { maximumFractionDigits: n < 100 && n % 1 !== 0 ? 1 : 0 })

export function computeValue(promo: Promo, rates: Record<string, number> = POINT_RATES): Value {
  const b = promo.benefit
  const hasMin = promo.minSpend > 0
  const basis = hasMin ? promo.minSpend : DEFAULT_BASIS
  const steps: string[] = [
    hasMin
      ? `คิดจากยอดใช้จ่ายขั้นต่ำ ${baht(basis)}`
      : `ไม่มีขั้นต่ำ จึงคิดจากยอดอ้างอิง ${baht(basis)}`,
  ]
  let savings = 0

  if (b.kind === 'percent' || b.kind === 'cashback') {
    const label = b.kind === 'percent' ? 'ส่วนลด' : 'เงินคืน'
    const raw = (basis * b.pct) / 100
    savings = raw
    steps.push(`${label} ${fmt(b.pct)}% ของ ${baht(basis)} = ${baht(raw)}`)
    if (b.cap !== undefined && raw > b.cap) {
      savings = b.cap
      steps.push(`เกินเพดานสูงสุด จึงได้ ${baht(b.cap)}`)
    }
  } else if (b.kind === 'baht') {
    savings = b.amount
    steps.push(`ลดทันที ${baht(b.amount)}`)
  } else {
    const rate = rates[b.program] ?? rates['แต้มอื่น ๆ'] ?? 0.1
    savings = b.points * rate
    steps.push(`ได้ ${fmt(b.points)} ${b.program} × ${baht(rate)} ต่อแต้ม = ${baht(savings)}`)
  }

  if (savings > basis) {
    savings = basis
    steps.push(`มูลค่าไม่เกินยอดที่จ่าย จึงคิดที่ ${baht(basis)}`)
  }
  savings = Math.max(0, savings)
  const valuePct = basis > 0 ? (savings / basis) * 100 : 0
  steps.push(`ความคุ้ม = ${baht(savings)} ÷ ${baht(basis)} = ${fmt(Math.round(valuePct * 10) / 10)}%`)
  return { basis, savingsBaht: savings, valuePct, steps }
}

/** เรียงจากคุ้มมากไปน้อย: % ก่อน แล้วตามด้วยจำนวนเงิน */
export function rankByValue(promos: Promo[]): Promo[] {
  return [...promos]
    .map((p) => ({ p, v: computeValue(p) }))
    .sort((a, b) => b.v.valuePct - a.v.valuePct || b.v.savingsBaht - a.v.savingsBaht)
    .map((x) => x.p)
}

export function benefitLabel(promo: Promo): string {
  const b = promo.benefit
  switch (b.kind) {
    case 'percent':
      return `ลด ${fmt(b.pct)}%`
    case 'cashback':
      return `เงินคืน ${fmt(b.pct)}%`
    case 'baht':
      return `ลด ฿${fmt(b.amount)}`
    case 'points':
      return `+${fmt(b.points)} ${b.program}`
  }
}
