import type { Promo } from '../types'

const SAVED = 'kumkon.saved.v1'
const MINE = 'kumkon.mine.v1'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* โหมดส่วนตัวหรือพื้นที่เต็ม: ใช้งานต่อได้ แค่ไม่ถูกจำ */
  }
}

export const loadSaved = () => read<string[]>(SAVED, [])
export const storeSaved = (ids: string[]) => write(SAVED, ids)
export const loadMine = () => read<Promo[]>(MINE, [])
export const storeMine = (promos: Promo[]) => write(MINE, promos)
