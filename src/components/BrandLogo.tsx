import { fallbackColor, getBrand } from '../data/brands'

interface Props {
  brand: string
  size?: number
}

/** โลโก้แบรนด์: ไฟล์ใน public/brands → รูปโลโก้ → โลโก้จากชุดไอคอน → ลายเส้น → ตัวอักษรย่อบนสีแบรนด์ */
export function BrandLogo({ brand, size = 44 }: Props) {
  const b = getBrand(brand)
  const src = b?.file ? `./brands/${b.file}` : b?.image
  const color = src ? '#fff' : (b?.color ?? fallbackColor(brand))
  const label = b?.short ?? (brand.trim().charAt(0).toUpperCase() || '?')
  const fontSize = Math.max(9, Math.round(size / (label.length <= 1 ? 2.2 : label.length <= 3 ? 3 : 4.4)))

  return (
    <span
      className="logo"
      style={{ width: size, height: size, background: color, color: b?.fg ?? '#fff', fontSize, borderRadius: size * 0.28 }}
      aria-hidden="true"
    >
      {src ? (
        <img src={src} alt="" />
      ) : b?.icon ? (
        <svg viewBox="0 0 24 24" width={size * 0.58} height={size * 0.58} fill="currentColor">
          <path d={b.icon} />
        </svg>
      ) : b?.outline ? (
        <svg viewBox="0 0 48 48" width={size * 0.8} height={size * 0.8} dangerouslySetInnerHTML={{ __html: b.outline }} />
      ) : (
        label
      )}
    </span>
  )
}
