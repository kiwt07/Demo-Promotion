import { BRANDS } from '../data/brands'
import { BrandLogo } from './BrandLogo'
import { Icon } from './Icon'

interface Props {
  selected: Set<string>
  onToggle: (brand: string) => void
  label: string
}

/** ตารางโลโก้ให้แตะเลือกแบรนด์ (เลือกได้หลายอัน) */
export function BrandPicker({ selected, onToggle, label }: Props) {
  return (
    <div className="brands" role="group" aria-label={label}>
      {BRANDS.map((b) => {
        const on = selected.has(b.name)
        return (
          <button type="button" key={b.name} className="brands__item" aria-pressed={on} onClick={() => onToggle(b.name)}>
            <span className="brands__logo">
              <BrandLogo brand={b.name} size={48} />
              {on && (
                <i>
                  <Icon name="check" size={12} />
                </i>
              )}
            </span>
            <span>{b.name}</span>
          </button>
        )
      })}
    </div>
  )
}
