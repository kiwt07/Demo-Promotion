/** มูลค่าโดยประมาณของ 1 แต้ม เป็นเงินบาท (ค่าตัวอย่างสำหรับ prototype) */
export const POINT_RATES: Record<string, number> = {
  'Shopee Coins': 1,
  'LazCoins': 0.01,
  'The 1': 0.125,
  'K Point': 0.1,
  'PointX': 0.1,
  'blueplus+': 0.1,
  'Bangchak Point': 0.1,
  'GrabRewards': 0.05,
  'แต้มอื่น ๆ': 0.1,
}

export const POINT_PROGRAMS = Object.keys(POINT_RATES)
