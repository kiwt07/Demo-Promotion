import { siAirasia, siGrab, siKlook, siShell, siShopee, siStarbucks, siTiktok } from 'simple-icons'
import kbankLogo from '../assets/brands/kbank.png'
import krungsriLogo from '../assets/brands/krungsri.png'
import scbLogo from '../assets/brands/scb.png'
import uobLogo from '../assets/brands/uob.png'
import type { CategoryId } from '../types'
import { OUTLINES } from './logoOutlines'

export interface Brand {
  name: string
  category: CategoryId
  /** สีพื้นของโลโก้ (สีแบรนด์โดยประมาณ) */
  color: string
  /** สีของสัญลักษณ์/ตัวอักษรบนพื้น */
  fg: string
  /** path ของโลโก้จากชุด Simple Icons (viewBox 24) */
  icon?: string
  /** โลโก้ลายเส้นจากชุด Arcticons (เนื้อ SVG, viewBox 48) */
  outline?: string
  /** รูปโลโก้สีเต็มที่มากับแอป */
  image?: string
  /** ไฟล์โลโก้ใน public/brands/ เช่น 'kbank.svg' (ใช้แทน icon ถ้ามี) */
  file?: string
  /** ตัวอักษรย่อเมื่อไม่มีโลโก้ */
  short?: string
}

const b = (name: string, category: CategoryId, color: string, extra: Partial<Brand> = {}): Brand => ({
  name,
  category,
  color,
  fg: '#ffffff',
  ...extra,
})

/**
 * แบรนด์ที่แอปรู้จัก
 * - image: โลโก้สีเต็มของธนาคาร (จากแพ็กเกจ thai-banks-logo)
 * - icon: โลโก้จากชุด Simple Icons
 * - outline: โลโก้ลายเส้นจากชุด Arcticons บนสีแบรนด์
 * - แบรนด์ที่ไม่มีทั้งสามอย่างแสดงตัวอักษรย่อ จนกว่าจะวางไฟล์โลโก้ใน public/brands/ แล้วใส่ชื่อไฟล์ใน `file`
 */
export const BRANDS: Brand[] = [
  b('Shopee', 'shopping', `#${siShopee.hex}`, { icon: siShopee.path }),
  b('Lazada', 'shopping', '#0f146d', { outline: OUTLINES.lazada, short: 'Laz' }),
  b('TikTok Shop', 'shopping', '#000000', { icon: siTiktok.path }),
  b('Central Online', 'shopping', '#d6001c', { outline: OUTLINES.central, short: 'C' }),
  b('KBank', 'bank', '#00a950', { image: kbankLogo, short: 'K' }),
  b('SCB', 'bank', '#4e2a84', { image: scbLogo, short: 'SCB' }),
  b('Krungsri', 'bank', '#ffd400', { fg: '#5a4a00', image: krungsriLogo, short: 'กรุงศรี' }),
  b('KTC', 'bank', '#e30613', { outline: OUTLINES.ktc, short: 'KTC' }),
  b('UOB', 'bank', '#0b3b8c', { image: uobLogo, short: 'UOB' }),
  b('PTT Station', 'fuel', '#1e4b9a', { outline: OUTLINES.ptt, short: 'PTT' }),
  b('Bangchak', 'fuel', '#009b3a', { outline: OUTLINES.bangchak, short: 'บางจาก' }),
  b('Shell', 'fuel', `#${siShell.hex}`, { fg: '#dd1d21', icon: siShell.path }),
  b('PT', 'fuel', '#00a651', { short: 'PT' }),
  b('GrabFood', 'food', `#${siGrab.hex}`, { icon: siGrab.path }),
  b('LINE MAN', 'food', '#00b14f', { outline: OUTLINES.lineMan }),
  b('Starbucks', 'food', `#${siStarbucks.hex}`, { icon: siStarbucks.path }),
  b('MK', 'food', '#e2001a', { short: 'MK' }),
  b('Agoda', 'travel', '#2f6fde', { outline: OUTLINES.agoda, short: 'agoda' }),
  b('AirAsia', 'travel', `#${siAirasia.hex}`, { icon: siAirasia.path }),
  b('Klook', 'travel', `#${siKlook.hex}`, { icon: siKlook.path }),
  b('Watsons', 'other', '#00a0a8', { outline: OUTLINES.watsons, short: 'W' }),
  b('Major', 'other', '#b8860b', { outline: OUTLINES.major, short: 'M' }),
  b('True', 'other', '#e4002b', { outline: OUTLINES.trueApp, short: 'true' }),
]

const BY_NAME = new Map(BRANDS.map((x) => [x.name.toLowerCase(), x]))
const FALLBACK = ['#5b3df5', '#0f9d62', '#e02d86', '#2f6bff', '#f2622e', '#c98a00']

export function getBrand(name: string): Brand | undefined {
  return BY_NAME.get(name.trim().toLowerCase())
}

/** สีสำรองสำหรับแบรนด์ที่แอปไม่รู้จัก: คงที่ตามชื่อ */
export function fallbackColor(name: string): string {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return FALLBACK[h % FALLBACK.length]
}
