import { Icon } from './Icon'

export type Tab = 'feed' | 'explore' | 'mine'

interface Props {
  tab: Tab
  onTab: (t: Tab) => void
  onAdd: () => void
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'feed', label: 'ฟีดคุ้ม', icon: 'home' },
  { id: 'explore', label: 'สำรวจ', icon: 'compass' },
  { id: 'mine', label: 'ของฉัน', icon: 'bookmark' },
]

export function TabBar({ tab, onTab, onAdd }: Props) {
  const item = (t: (typeof TABS)[number]) => (
    <button
      key={t.id}
      className="tabbar__item"
      aria-current={tab === t.id ? 'page' : undefined}
      onClick={() => onTab(t.id)}
    >
      <Icon name={t.icon} size={22} filled={tab === t.id && t.id === 'mine'} />
      <span>{t.label}</span>
    </button>
  )
  return (
    <nav className="tabbar" aria-label="เมนูหลัก">
      {item(TABS[0])}
      {item(TABS[1])}
      <button className="tabbar__add" onClick={onAdd} aria-label="เพิ่มโปรโมชั่น">
        <Icon name="plus" size={24} />
      </button>
      {item(TABS[2])}
    </nav>
  )
}
