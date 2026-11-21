import { CATEGORIES } from '../data/categories'
import type { CategoryId } from '../types'
import { Icon } from './Icon'

interface Props {
  value: CategoryId | 'all'
  onChange: (v: CategoryId | 'all') => void
}

export function CategoryChips({ value, onChange }: Props) {
  return (
    <div className="chips" role="tablist" aria-label="หมวดหมู่">
      <button role="tab" aria-selected={value === 'all'} className="chip" onClick={() => onChange('all')}>
        ทั้งหมด
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          role="tab"
          aria-selected={value === c.id}
          className="chip"
          data-cat={c.id}
          onClick={() => onChange(c.id)}
        >
          <Icon name={c.icon} size={15} />
          {c.name}
        </button>
      ))}
    </div>
  )
}
