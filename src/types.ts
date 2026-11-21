export type CategoryId = 'shopping' | 'bank' | 'fuel' | 'food' | 'travel' | 'other'

export type Benefit =
  | { kind: 'percent'; pct: number; cap?: number }
  | { kind: 'baht'; amount: number }
  | { kind: 'cashback'; pct: number; cap?: number }
  | { kind: 'points'; points: number; program: string }

export interface Promo {
  id: string
  title: string
  brand: string
  category: CategoryId
  benefit: Benefit
  /** ยอดใช้จ่ายขั้นต่ำ (บาท), 0 = ไม่มีขั้นต่ำ */
  minSpend: number
  expiresAt: number
  createdAt: number
  conditions: string[]
  code?: string
  url?: string
  /** รูปที่ผู้ใช้แนบ (data URL ย่อขนาดแล้ว) */
  image?: string
  sponsored?: boolean
  source: 'sample' | 'user'
  /** เฉพาะโปรที่ผู้ใช้เพิ่มเอง */
  visibility?: 'private' | 'pending'
}
