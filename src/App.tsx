import { useCallback, useEffect, useMemo, useState } from 'react'
import { AddPromoForm } from './components/AddPromoForm'
import { PromoDetail } from './components/PromoDetail'
import { TabBar, type Tab } from './components/TabBar'
import { buildSamplePromos } from './data/promos'
import { loadMine, loadSaved, storeMine, storeSaved } from './lib/storage'
import { NowContext, useTicker } from './lib/time'
import { Explore } from './screens/Explore'
import { Feed } from './screens/Feed'
import { Mine } from './screens/Mine'
import type { Promo } from './types'

export default function App() {
  const now = useTicker()
  const [tab, setTab] = useState<Tab>('feed')
  const [adding, setAdding] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [savedIds, setSavedIds] = useState<string[]>(loadSaved)
  const [mine, setMine] = useState<Promo[]>(loadMine)
  const [toast, setToast] = useState('')

  const samples = useMemo(() => buildSamplePromos(Date.now()), [])
  // ตัดโปรที่หมดเวลาออก โดยคำนวณใหม่เฉพาะเมื่อมีโปรหมดเวลาจริง ไม่ใช่ทุกวินาที
  const all = useMemo(() => [...mine, ...samples], [mine, samples])
  const liveKey = all.filter((p) => p.expiresAt > now).length
  const live = useMemo(
    () => all.filter((p) => p.expiresAt > Date.now()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [all, liveKey],
  )
  const saved = useMemo(() => new Set(savedIds), [savedIds])

  useEffect(() => {
    storeSaved(savedIds)
  }, [savedIds])
  useEffect(() => {
    storeMine(mine)
  }, [mine])
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(id)
  }, [toast])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [tab])

  const toggleSave = (id: string) => {
    const on = savedIds.includes(id)
    setSavedIds(on ? savedIds.filter((x) => x !== id) : [id, ...savedIds])
    setToast(on ? 'นำออกจากที่บันทึกแล้ว' : 'บันทึกโปรแล้ว')
  }

  const addPromo = (p: Promo) => {
    setMine((m) => [p, ...m])
    setAdding(false)
    setTab('mine')
    setToast(p.visibility === 'pending' ? 'ส่งโปรเข้าคิวตรวจแล้ว' : 'เพิ่มโปรส่วนตัวแล้ว')
  }

  const deletePromo = (id: string) => {
    setMine((m) => m.filter((p) => p.id !== id))
    setSavedIds((ids) => ids.filter((x) => x !== id))
    setOpenId(null)
    setToast('ลบโปรแล้ว')
  }

  const closeDetail = useCallback(() => setOpenId(null), [])
  const closeAdd = useCallback(() => setAdding(false), [])
  const open = all.find((p) => p.id === openId)
  const screenProps = { saved, onOpen: setOpenId, onToggleSave: toggleSave }

  return (
    <NowContext.Provider value={now}>
      <div className="app">
        <main className="screen">
          {tab === 'feed' && <Feed promos={live} {...screenProps} />}
          {tab === 'explore' && <Explore promos={live} {...screenProps} />}
          {tab === 'mine' && (
            <Mine
              savedPromos={live.filter((p) => saved.has(p.id))}
              mine={mine}
              onAdd={() => setAdding(true)}
              {...screenProps}
            />
          )}
        </main>
        <TabBar tab={tab} onTab={setTab} onAdd={() => setAdding(true)} />
        {open && (
          <PromoDetail
            promo={open}
            saved={saved.has(open.id)}
            onClose={closeDetail}
            onToggleSave={() => toggleSave(open.id)}
            onDelete={open.source === 'user' ? () => deletePromo(open.id) : undefined}
            onToast={setToast}
          />
        )}
        {adding && <AddPromoForm onClose={closeAdd} onSubmit={addPromo} />}
        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}
      </div>
    </NowContext.Provider>
  )
}
