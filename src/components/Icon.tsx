const PATHS: Record<string, string> = {
  home: 'M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5 5-2Z',
  plus: 'M12 5v14M5 12h14',
  bookmark: 'M6.5 4h11v16l-5.5-4-5.5 4V4Z',
  bag: 'M5 8h14l-1 12H6L5 8Zm4 0V6.5a3 3 0 0 1 6 0V8',
  card: 'M3 6.5h18v11H3v-11Zm0 4h18M6.5 14.5h4',
  fuel: 'M5 20V5h8v15M4 20h10M7.5 8h3M13 11h2.5v6a1.5 1.5 0 0 0 3 0V9l-2.5-2.5',
  food: 'M7 3v7a2 2 0 0 0 2 2v9M5 3v5M9 3v5M16 21v-8m0 0c-2 0-2.5-2.5-2.5-5S15 3 16 3v10Z',
  plane: 'm3 13 18-8-6 16-3.5-6.5L3 13Zm8.5 1.5L21 5',
  spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm6.5 12 .7 2 .2.1 2 .7-2 .7-.9 2.2-.7-2.2-2-.7 2-.7.7-2.1Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13.5V12l3 2',
  bolt: 'M13.5 3 5 13.5h6L10.5 21 19 10.5h-6L13.5 3Z',
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Zm4.7-1.8L20 20',
  close: 'M6 6l12 12M18 6 6 18',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  copy: 'M9 9h10v11H9V9Zm-4 6V4h10',
  lock: 'M6 11h12v9H6v-9Zm2.5 0V8a3.5 3.5 0 0 1 7 0v3',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.6 3.5 5.6 3.5 9s-1 6.4-3.5 9c-2.5-2.6-3.5-5.6-3.5-9s1-6.4 3.5-9Z',
  trash: 'M5 7h14M9.5 7V4.5h5V7M7 7l1 13h8l1-13',
}

interface Props {
  name: string
  size?: number
  filled?: boolean
}

export function Icon({ name, size = 20, filled = false }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name] ?? ''} />
    </svg>
  )
}
