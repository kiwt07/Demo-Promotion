import { useState } from 'react'
import { BrandLogo } from './BrandLogo'
import { BrandPicker } from './BrandPicker'

interface Props {
  owned: Set<string>
  onToggleOwned: (brand: string) => void
  onDone: () => void
}

export function Onboarding({ owned, onToggleOwned, onDone }: Props) {
  const [step, setStep] = useState(0)
  return (
    <div className="onb" role="dialog" aria-modal="true" aria-label="แนะนำการใช้งาน">
      <div className="onb__inner">
        <div className="onb__top">
          <div className="onb__dots" aria-hidden="true">
            <span className={step === 0 ? 'is-on' : ''} />
            <span className={step === 1 ? 'is-on' : ''} />
          </div>
          <button className="link" onClick={onDone}>
            ข้าม
          </button>
        </div>

        {step === 0 ? (
          <div className="onb__body">
            <h1>ดูโปรไหนคุ้มที่สุด เป็นเงินบาท</h1>
            <p>เราแปลงส่วนลด เงินคืน และแต้มของทุกแอปให้เป็นเงินบาท แล้วเรียงให้ว่าอันไหนคุ้มกว่า</p>
            <div className="onb__demo" aria-hidden="true">
              <div className="onb__demo-head">
                <BrandLogo brand="Lazada" size={40} />
                <strong>ลดทันที ฿120 เมื่อช้อปครบ ฿600</strong>
              </div>
              <div className="save-line">
                <span className="save-line__label">ประหยัด</span>
                <span className="save-line__baht">฿120</span>
                <span className="save-line__pct">20%</span>
              </div>
              <ul>
                <li>
                  <b className="k-save">฿120</b> เงินที่คุณได้คืน
                </li>
                <li>
                  <b className="k-pct">20%</b> ได้คืนเทียบกับยอดที่ต้องจ่าย
                </li>
                <li>
                  <b className="k-time">00:38:00</b> เวลาที่เหลือก่อนโปรหมด
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="onb__body">
            <h1>คุณใช้แอปหรือบัตรไหนอยู่</h1>
            <p>แตะเลือกเพื่อให้เราบอกว่าโปรไหนใช้ได้เลย ข้ามได้และแก้ทีหลังได้ที่หน้า "ของฉัน"</p>
            <BrandPicker selected={owned} onToggle={onToggleOwned} label="แอปและบัตรที่คุณมี" />
          </div>
        )}

        <div className="onb__foot">
          {step === 0 ? (
            <button className="btn btn--primary btn--block" onClick={() => setStep(1)}>
              ถัดไป
            </button>
          ) : (
            <button className="btn btn--primary btn--block" onClick={onDone}>
              {owned.size > 0 ? `เริ่มใช้งาน (เลือกแล้ว ${owned.size})` : 'เริ่มใช้งาน'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
