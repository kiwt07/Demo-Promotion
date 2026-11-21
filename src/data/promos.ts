import { DAY, HOUR, MIN } from '../lib/time'
import type { Benefit, CategoryId, Promo } from '../types'

type Seed = [
  brand: string,
  title: string,
  category: CategoryId,
  benefit: Benefit,
  minSpend: number,
  /** หมดอายุในอีกกี่มิลลิวินาทีนับจากเปิดแอป */
  endsIn: number,
  conditions: string[],
  extra?: Partial<Promo>,
]

const SEEDS: Seed[] = [
  ['Shopee', 'โค้ดลด 15% ช่วง Flash 3 ชั่วโมง', 'shopping', { kind: 'percent', pct: 15, cap: 150 }, 800, 38 * MIN, ['ใช้ได้ 1 ครั้งต่อบัญชี', 'เฉพาะร้านที่ร่วมรายการ'], { code: 'FLASH15' }],
  ['Lazada', 'ลดทันที ฿120 เมื่อช้อปครบ ฿600', 'shopping', { kind: 'baht', amount: 120 }, 600, 2 * HOUR + 14 * MIN, ['เก็บโค้ดก่อนชำระเงิน', 'จำนวนจำกัด'], { code: 'LAZ120' }],
  ['Shopee', 'รับ 200 Coins เมื่อซื้อครบ ฿1,500', 'shopping', { kind: 'points', points: 200, program: 'Shopee Coins' }, 1500, 3 * DAY, ['Coins เข้าภายใน 7 วันหลังรับสินค้า']],
  ['Central Online', 'รับ The 1 x5 ทุกการใช้จ่าย', 'shopping', { kind: 'points', points: 800, program: 'The 1' }, 4000, 5 * DAY, ['ปกติได้ 1 แต้มทุก ฿25', 'เฉพาะช่องทางออนไลน์']],
  ['TikTok Shop', 'ส่วนลด 10% ไม่มีขั้นต่ำ', 'shopping', { kind: 'percent', pct: 10, cap: 80 }, 0, 9 * HOUR, ['เฉพาะผู้ใช้ใหม่']],
  ['KBank', 'เงินคืน 12% หมวดร้านอาหาร', 'bank', { kind: 'cashback', pct: 12, cap: 300 }, 2000, 6 * DAY, ['ลงทะเบียนผ่านแอปก่อนใช้จ่าย', 'เงินคืนเข้าภายใน 60 วัน']],
  ['SCB', 'รับ PointX 2,000 แต้ม เมื่อใช้จ่ายครบ ฿10,000', 'bank', { kind: 'points', points: 2000, program: 'PointX' }, 10000, 12 * DAY, ['สะสมยอดได้ตลอดเดือน']],
  ['Krungsri', 'แบ่งจ่าย 0% + เงินคืน ฿500', 'bank', { kind: 'baht', amount: 500 }, 15000, 20 * DAY, ['เฉพาะหมวดเครื่องใช้ไฟฟ้า', 'แบ่งจ่ายขั้นต่ำ 6 เดือน']],
  ['KTC', 'เงินคืน 5% ทุกยอดออนไลน์วันศุกร์', 'bank', { kind: 'cashback', pct: 5, cap: 200 }, 1000, 20 * HOUR, ['เฉพาะวันศุกร์', 'ลงทะเบียนทาง SMS']],
  ['UOB', 'เครดิตเงินคืน 8% ที่ซูเปอร์มาร์เก็ต', 'bank', { kind: 'cashback', pct: 8, cap: 160 }, 1500, 9 * DAY, ['จำกัด 1 ครั้งต่อเดือน']],
  ['PTT Station', 'เติมครบ ฿800 รับ 120 blueplus+', 'fuel', { kind: 'points', points: 120, program: 'blueplus+' }, 800, 52 * MIN, ['แสดงบัตรสมาชิกก่อนชำระ']],
  ['Bangchak', 'ส่วนลด ฿40 เมื่อเติมครบ ฿1,000', 'fuel', { kind: 'baht', amount: 40 }, 1000, 4 * DAY, ['เฉพาะสมาชิกบางจาก']],
  ['Shell', 'เงินคืน 4% เมื่อจ่ายผ่านแอป', 'fuel', { kind: 'cashback', pct: 4, cap: 60 }, 500, 15 * HOUR, ['เฉพาะน้ำมัน V-Power']],
  ['PT', 'รับแต้ม x3 ทุกวันพุธ', 'fuel', { kind: 'points', points: 300, program: 'แต้มอื่น ๆ' }, 1000, 2 * DAY, ['เฉพาะวันพุธ']],
  ['GrabFood', 'ลด 50% สูงสุด ฿100', 'food', { kind: 'percent', pct: 50, cap: 100 }, 250, 1 * HOUR + 47 * MIN, ['เฉพาะร้านที่มีป้ายโปร', 'ใช้ได้ 1 ครั้ง'], { code: 'GRAB50' }],
  ['LINE MAN', 'ส่วนลด ฿60 ขั้นต่ำ ฿200', 'food', { kind: 'baht', amount: 60 }, 200, 5 * HOUR, ['เฉพาะมื้อเย็น 17:00–21:00'], { code: 'DINNER60' }],
  ['Starbucks', 'ซื้อ 1 แถม 1 เครื่องดื่มไซซ์ Tall', 'food', { kind: 'percent', pct: 50 }, 300, 3 * DAY, ['เฉพาะสมาชิก', 'ทุกวันจันทร์']],
  ['MK', 'ลด 20% ทั้งบิล เมื่อจ่ายด้วยบัตรร่วมรายการ', 'food', { kind: 'percent', pct: 20, cap: 400 }, 1200, 10 * DAY, ['ไม่รวมเครื่องดื่มแอลกอฮอล์']],
  ['Agoda', 'ลด 12% โรงแรมในประเทศ', 'travel', { kind: 'percent', pct: 12, cap: 600 }, 3000, 7 * DAY, ['เข้าพักภายใน 3 เดือน'], { code: 'STAY12' }],
  ['AirAsia', 'ลด ฿300 ตั๋วไป-กลับ', 'travel', { kind: 'baht', amount: 300 }, 2500, 11 * HOUR, ['เฉพาะเส้นทางในประเทศ']],
  ['Klook', 'เงินคืน 10% กิจกรรมและบัตรเข้าชม', 'travel', { kind: 'cashback', pct: 10, cap: 250 }, 1500, 14 * DAY, ['เงินคืนเป็นเครดิตในแอป']],
  ['Watsons', 'ลด 100 เมื่อครบ 599', 'other', { kind: 'baht', amount: 100 }, 599, 2 * DAY, ['เฉพาะสมาชิก']],
  ['Major', 'ตั๋วหนัง ฿99 ทุกวันพุธ', 'other', { kind: 'percent', pct: 55 }, 220, 26 * HOUR, ['เฉพาะที่นั่งปกติ']],
  ['True', 'เติมเงิน ฿300 รับเพิ่ม ฿30', 'other', { kind: 'cashback', pct: 10, cap: 30 }, 300, 8 * DAY, ['เฉพาะเติมผ่านแอป']],
  ['บัตรพาร์ตเนอร์ (ตัวอย่าง)', 'สมัครบัตรใหม่ รับเงินคืน ฿1,000', 'bank', { kind: 'baht', amount: 1000 }, 5000, 25 * DAY, ['ใช้จ่ายครบภายใน 30 วันแรก', 'เฉพาะผู้สมัครใหม่'], { sponsored: true }],
  ['แอปส่งของสด (ตัวอย่าง)', 'ลูกค้าใหม่ลด 30% ออเดอร์แรก', 'food', { kind: 'percent', pct: 30, cap: 150 }, 400, 18 * DAY, ['เฉพาะออเดอร์แรก'], { sponsored: true, code: 'NEW30' }],
]

/** สร้างชุดโปรตัวอย่าง โดยเวลาหมดอายุนับจากตอนเปิดแอป เพื่อให้ตัวนับถอยหลังเดินจริงเสมอ */
export function buildSamplePromos(now: number): Promo[] {
  return SEEDS.map(([brand, title, category, benefit, minSpend, endsIn, conditions, extra], i) => ({
    id: `s${i + 1}`,
    brand,
    title,
    category,
    benefit,
    minSpend,
    expiresAt: now + endsIn,
    createdAt: now - i * HOUR,
    conditions,
    source: 'sample' as const,
    ...extra,
  }))
}
