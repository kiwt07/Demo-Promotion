import { fallbackColor, getBrand } from '../data/brands'

interface Props {
  brand: string
  size?: number
}

/** โลโก้แบรนด์: ไฟล์ใน public/brands → โลโก้จากชุดไอคอน → ตัวอักษรย่อบนสีแบรนด์ */
export function BrandLogo({ brand, size = 44 }: Props) {
  const b = getBrand(brand)
  const color = b?.color ?? fallbackColor(brand)
  const label = b?.short ?? (brand.trim().charAt(0).toUpperCase() || '?')
  const fontSize = Math.max(9, Math.round(size / (label.length <= 1 ? 2.2 : label.length <= 3 ? 3 : 4.4)))

  return (
    <span
      className="logo"
      style={{ width: size, height: size, background: color, color: b?.fg ?? '#fff', fontSize, borderRadius: size * 0.28 }}
      aria-hidden="true"
    >
      {b?.file ? (
        <img src={`./brands/${b.file}`} alt="" />
      ) : b?.icon ? (
        <svg viewBox="0 0 24 24" width={size * 0.58} height={size * 0.58} fill="currentColor">
          <path d={b.icon} />
        </svg>
      ) : (
        label
      )}
    </span>
  )
}
