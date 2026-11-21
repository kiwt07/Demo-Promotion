import { useCallback, useEffect, useMemo, useState } from 'react'
import { AddPromoForm } from './components/AddPromoForm'
import { Onboarding } from './components/Onboarding'
import { PromoDetail } from './components/PromoDetail'
import { TabBar, type Tab } from './components/TabBar'
import { buildSamplePromos } from './data/promos'
import {
  loadMine,
  loadOnboarded,
  loadOwned,
  loadSaved,
  storeMine,
  storeOnboarded,
  storeOwned,
  storeSaved,
} from './lib/storage'
import { NowContext, useTicker } from './lib/time'
import { Explore } from './screens/Explore'
import { Feed } from './screens/Feed'
import { Me } from './screens/Me'
import { Saved } from './screens/Saved'
import type { Promo } from './types'

export default function App() {
  const now = useTicker()
  const [tab, setTab] = useState<Tab>('feed')
  const [adding, setAdding] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [savedIds, setSavedIds] = useState<string[]>(loadSaved)
  const [mine, setMine] = useState<Promo[]>(loadMine)
  const [ownedList, setOwnedList] = useState<string[]>(loadOwned)
  const [intro, setIntro] = useState(() => !loadOnboarded())
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
  const owned = useMemo(() => new Set(ownedList), [ownedList])

  useEffect(() => {
    storeSaved(savedIds)
  }, [savedIds])
  useEffect(() => {
    storeMine(mine)
  }, [mine])
  useEffect(() => {
    storeOwned(ownedList)
  }, [ownedList])
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

  const toggleOwned = (brand: string) =>
    setOwnedList((list) => (list.includes(brand) ? list.filter((b) => b !== brand) : [...list, brand]))

  const addPromo = (p: Promo) => {
    setMine((m) => [p, ...m])
    setAdding(false)
    setTab('me')
    setToast(p.visibility === 'pending' ? 'ส่งโปรเข้าคิวตรวจแล้ว' : 'เพิ่มโปรส่วนตัวแล้ว')
  }

  const deletePromo = (id: string) => {
    setMine((m) => m.filter((p) => p.id !== id))
    setSavedIds((ids) => ids.filter((x) => x !== id))
    setOpenId(null)
    setToast('ลบโปรแล้ว')
  }

  const finishIntro = () => {
    storeOnboarded(true)
    setIntro(false)
  }

  const closeDetail = useCallback(() => setOpenId(null), [])
  const closeAdd = useCallback(() => setAdding(false), [])
  const open = all.find((p) => p.id === openId)
  const common = { saved, owned, onOpen: setOpenId, onToggleSave: toggleSave }

  return (
    <NowContext.Provider value={now}>
      <div className="app">
        <main className="screen">
          {tab === 'feed' && <Feed promos={live} onAdd={() => setAdding(true)} {...common} />}
          {tab === 'explore' && <Explore promos={live} {...common} />}
          {tab === 'saved' && (
            <Saved
              promos={live.filter((p) => saved.has(p.id))}
              owned={owned}
              onOpen={setOpenId}
              onToggleSave={toggleSave}
              onBrowse={() => setTab('feed')}
            />
          )}
          {tab === 'me' && (
            <Me
              mine={mine}
              onToggleOwned={toggleOwned}
              onAdd={() => setAdding(true)}
              onReplayIntro={() => setIntro(true)}
              {...common}
            />
          )}
        </main>
        <TabBar tab={tab} onTab={setTab} savedCount={savedIds.length} />
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
        {intro && <Onboarding owned={owned} onToggleOwned={toggleOwned} onDone={finishIntro} />}
        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}
      </div>
    </NowContext.Provider>
  )
}
