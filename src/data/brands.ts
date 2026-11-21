import { siAirasia, siGrab, siShell, siStarbucks, siTiktok } from 'simple-icons'
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
  /** ชื่อไฟล์โลโก้ใน src/assets/brands/ (ไม่รวมนามสกุล) */
  slug: string
  /** รูปโลโก้ทางการ: หาให้อัตโนมัติจาก src/assets/brands/<slug>.svg หรือ .png */
  image?: string
  /** ไฟล์โลโก้ใน public/brands/ เช่น 'kbank.svg' (ใช้แทน icon ถ้ามี) */
  file?: string
  /** ตัวอักษรย่อเมื่อไม่มีโลโก้ */
  short?: string
}

/** ไฟล์โลโก้ทั้งหมดใน src/assets/brands/ — วางไฟล์เพิ่มแล้วโลโก้จะขึ้นเองตาม slug */
const LOGO_FILES = import.meta.glob<string>('../assets/brands/*.{svg,png}', { eager: true, import: 'default', query: '?url' })
const logoFor = (slug: string) =>
  LOGO_FILES[`../assets/brands/${slug}.svg`] ?? LOGO_FILES[`../assets/brands/${slug}.png`]

const b = (name: string, category: CategoryId, color: string, slug: string, extra: Partial<Brand> = {}): Brand => ({
  name,
  category,
  color,
  slug,
  fg: '#ffffff',
  image: logoFor(slug),
  ...extra,
})

/**
 * แบรนด์ที่แอปรู้จัก
 * - image: โลโก้ทางการสีเต็มจากไฟล์ใน src/assets/brands/ (Wikimedia Commons และ thai-banks-logo)
 * - icon: โลโก้จากชุด Simple Icons
 * - outline: โลโก้ลายเส้นจากชุด Arcticons บนสีแบรนด์
 * - แบรนด์ที่ไม่มีทั้งสามอย่างแสดงตัวอักษรย่อ จนกว่าจะวางไฟล์โลโก้ใน public/brands/ แล้วใส่ชื่อไฟล์ใน `file`
 */
export const BRANDS: Brand[] = [
  b('Shopee', 'shopping', '#ee4d2d', 'shopee'),
  b('Lazada', 'shopping', '#0f146d', 'lazada', { outline: OUTLINES.lazada, short: 'Laz' }),
  b('TikTok Shop', 'shopping', '#000000', 'tiktok', { icon: siTiktok.path }),
  b('Central Online', 'shopping', '#d6001c', 'central', { outline: OUTLINES.central, short: 'C' }),
  b('KBank', 'bank', '#00a950', 'kbank', { short: 'K' }),
  b('SCB', 'bank', '#4e2a84', 'scb', { short: 'SCB' }),
  b('Krungsri', 'bank', '#ffd400', 'krungsri', { fg: '#5a4a00', short: 'กรุงศรี' }),
  b('KTC', 'bank', '#e30613', 'ktc', { outline: OUTLINES.ktc, short: 'KTC' }),
  b('UOB', 'bank', '#0b3b8c', 'uob', { short: 'UOB' }),
  b('PTT Station', 'fuel', '#1e4b9a', 'ptt', { outline: OUTLINES.ptt, short: 'PTT' }),
  b('Bangchak', 'fuel', '#009b3a', 'bangchak', { outline: OUTLINES.bangchak, short: 'บางจาก' }),
  b('Shell', 'fuel', `#${siShell.hex}`, 'shell', { fg: '#dd1d21', icon: siShell.path }),
  b('PT', 'fuel', '#00a651', 'pt', { short: 'PT' }),
  b('GrabFood', 'food', `#${siGrab.hex}`, 'grab', { icon: siGrab.path }),
  b('LINE MAN', 'food', '#1fb46a', 'lineman'),
  b('Starbucks', 'food', `#${siStarbucks.hex}`, 'starbucks', { icon: siStarbucks.path }),
  b('MK', 'food', '#e2001a', 'mk', { short: 'MK' }),
  b('Agoda', 'travel', '#2f6fde', 'agoda', { outline: OUTLINES.agoda, short: 'agoda' }),
  b('AirAsia', 'travel', `#${siAirasia.hex}`, 'airasia', { icon: siAirasia.path }),
  b('Klook', 'travel', '#ff5b00', 'klook'),
  b('Watsons', 'other', '#00a0a8', 'watsons', { outline: OUTLINES.watsons, short: 'W' }),
  b('Major', 'other', '#b8860b', 'major', { outline: OUTLINES.major, short: 'M' }),
  b('True', 'other', '#e4002b', 'true', { outline: OUTLINES.trueApp, short: 'true' }),
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
