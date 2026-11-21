import type { ReactNode } from 'react'
import { Icon } from './Icon'

export function Empty({ icon, title, children }: { icon: string; title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <span className="empty__art">
        <Icon name={icon} size={30} />
      </span>
      <strong>{title}</strong>
      {children && <p>{children}</p>}
    </div>
  )
}
