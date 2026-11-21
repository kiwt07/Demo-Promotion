import { createContext, useContext, useEffect, useState } from 'react'

export const MIN = 60_000
export const HOUR = 60 * MIN
export const DAY = 24 * HOUR

export const NowContext = createContext<number>(Date.now())
export const useNow = () => useContext(NowContext)

/** นาฬิกากลางของแอป เดินทุกวินาที */
export function useTicker(): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export interface Remaining {
  text: string
  /** เหลือน้อยกว่า 1 ชั่วโมง */
  urgent: boolean
  /** เหลือน้อยกว่า 24 ชั่วโมง */
  soon: boolean
  expired: boolean
}

const pad = (n: number) => String(n).padStart(2, '0')

export function remaining(expiresAt: number, now: number): Remaining {
  const ms = expiresAt - now
  if (ms <= 0) return { text: 'หมดเวลาแล้ว', urgent: false, soon: false, expired: true }
  if (ms >= DAY) {
    const d = Math.floor(ms / DAY)
    return { text: `เหลือ ${d} วัน`, urgent: false, soon: false, expired: false }
  }
  const s = Math.floor(ms / 1000)
  const text = `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
  return { text, urgent: ms < HOUR, soon: true, expired: false }
}
