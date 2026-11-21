import { Icon } from './Icon'

export type Tab = 'feed' | 'explore' | 'saved' | 'me'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'feed', label: 'หน้าแรก', icon: 'home' },
  { id: 'explore', label: 'หมวดหมู่', icon: 'compass' },
  { id: 'saved', label: 'ที่บันทึก', icon: 'bookmark' },
  { id: 'me', label: 'ของฉัน', icon: 'user' },
]

export function TabBar({ tab, onTab, savedCount }: { tab: Tab; onTab: (t: Tab) => void; savedCount: number }) {
  return (
    <nav className="tabbar" aria-label="เมนูหลัก">
      {TABS.map((t) => (
        <button key={t.id} className="tabbar__item" aria-current={tab === t.id ? 'page' : undefined} onClick={() => onTab(t.id)}>
          <span className="tabbar__icon">
            <Icon name={t.icon} size={23} />
            {t.id === 'saved' && savedCount > 0 && <i>{savedCount}</i>}
          </span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
