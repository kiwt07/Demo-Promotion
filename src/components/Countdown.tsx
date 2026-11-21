import { remaining, useNow } from '../lib/time'
import { Icon } from './Icon'

export function Countdown({ expiresAt, large = false }: { expiresAt: number; large?: boolean }) {
  const r = remaining(expiresAt, useNow())
  const state = r.expired ? 'expired' : r.urgent ? 'urgent' : r.soon ? 'soon' : 'calm'
  return (
    <span className={`countdown countdown--${state}${large ? ' countdown--lg' : ''}`}>
      <Icon name={r.soon ? 'bolt' : 'clock'} size={large ? 16 : 13} filled={r.soon} />
      {r.soon && <span className="countdown__label">หมดใน</span>}
      <span className="countdown__time">{r.text}</span>
    </span>
  )
}
