import { CATEGORIES } from '../data/categories'
import type { CategoryId } from '../types'
import { Icon } from './Icon'

interface Props {
  value: CategoryId | 'all'
  onChange: (v: CategoryId | 'all') => void
}

/** แถวไอคอนหมวดหมู่: เห็นครบทุกหมวดในจอเดียว */
export function CategoryRow({ value, onChange }: Props) {
  return (
    <div className="cats" role="tablist" aria-label="หมวดหมู่">
      <button role="tab" aria-selected={value === 'all'} className="cat" onClick={() => onChange('all')}>
        <span className="cat__icon">
          <Icon name="grid" size={20} />
        </span>
        ทั้งหมด
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          role="tab"
          aria-selected={value === c.id}
          aria-label={c.name}
          className="cat"
          data-cat={c.id}
          onClick={() => onChange(c.id)}
        >
          <span className="cat__icon">
            <Icon name={c.icon} size={20} />
          </span>
          {c.short}
        </button>
      ))}
    </div>
  )
}
