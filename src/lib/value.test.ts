import { describe, expect, it } from 'vitest'
import type { Benefit, Promo } from '../types'
import { computeValue, rankByValue } from './value'

const promo = (benefit: Benefit, minSpend = 0, id = 'x'): Promo => ({
  id,
  title: 't',
  brand: 'b',
  category: 'other',
  benefit,
  minSpend,
  expiresAt: 0,
  createdAt: 0,
  conditions: [],
  source: 'sample',
})

describe('computeValue', () => {
  it('percent discount without cap', () => {
    const v = computeValue(promo({ kind: 'percent', pct: 10 }, 500))
    expect(v.savingsBaht).toBe(50)
    expect(v.valuePct).toBe(10)
  })

  it('percent discount respects cap', () => {
    const v = computeValue(promo({ kind: 'percent', pct: 20, cap: 100 }, 2000))
    expect(v.savingsBaht).toBe(100)
    expect(v.valuePct).toBe(5)
  })

  it('cashback respects cap', () => {
    const v = computeValue(promo({ kind: 'cashback', pct: 15, cap: 60 }, 800))
    expect(v.savingsBaht).toBe(60)
    expect(v.valuePct).toBeCloseTo(7.5)
  })

  it('fixed baht discount', () => {
    const v = computeValue(promo({ kind: 'baht', amount: 80 }, 400))
    expect(v.savingsBaht).toBe(80)
    expect(v.valuePct).toBe(20)
  })

  it('points are converted with the rate table', () => {
    const v = computeValue(promo({ kind: 'points', points: 400, program: 'P' }, 1000), { P: 0.125 })
    expect(v.savingsBaht).toBe(50)
    expect(v.valuePct).toBe(5)
  })

  it('unknown point program falls back to default rate', () => {
    const v = computeValue(promo({ kind: 'points', points: 100, program: 'none' }, 100), { 'แต้มอื่น ๆ': 0.2 })
    expect(v.savingsBaht).toBe(20)
  })

  it('uses reference basis when there is no minimum spend', () => {
    const v = computeValue(promo({ kind: 'percent', pct: 5 }))
    expect(v.basis).toBe(1000)
    expect(v.savingsBaht).toBe(50)
  })

  it('never values a promo above the amount spent', () => {
    const v = computeValue(promo({ kind: 'baht', amount: 300 }, 200))
    expect(v.savingsBaht).toBe(200)
    expect(v.valuePct).toBe(100)
  })
})

describe('rankByValue', () => {
  it('orders by percent, then by baht', () => {
    const a = promo({ kind: 'percent', pct: 10 }, 500, 'a') // 10%, ฿50
    const b = promo({ kind: 'baht', amount: 200 }, 1000, 'b') // 20%
    const c = promo({ kind: 'percent', pct: 10 }, 2000, 'c') // 10%, ฿200
    expect(rankByValue([a, b, c]).map((p) => p.id)).toEqual(['b', 'c', 'a'])
  })
})
