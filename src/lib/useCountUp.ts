import { useEffect, useRef, useState } from 'react'

/** ตัวเลขวิ่งขึ้นไปหาค่าเป้าหมาย (ข้ามแอนิเมชันถ้าผู้ใช้ตั้งค่าลดการเคลื่อนไหว) */
export function useCountUp(target: number, ms = 700): number {
  const [value, setValue] = useState(target)
  const from = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof requestAnimationFrame !== 'function') {
      from.current = target
      setValue(target)
      return
    }
    const start = from.current
    const t0 = performance.now()
    let raf = 0
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms)
      const eased = 1 - Math.pow(1 - k, 3)
      setValue(Math.round(start + (target - start) * eased))
      if (k < 1) raf = requestAnimationFrame(step)
      else from.current = target
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])

  return value
}
