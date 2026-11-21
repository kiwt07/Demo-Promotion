import type { CategoryId } from '../types'

export interface Category {
  id: CategoryId
  name: string
  icon: string
}

export const CATEGORIES: Category[] = [
  { id: 'shopping', name: 'ช้อปปิ้ง', icon: 'bag' },
  { id: 'bank', name: 'ธนาคาร/บัตร', icon: 'card' },
  { id: 'fuel', name: 'ปั๊มน้ำมัน', icon: 'fuel' },
  { id: 'food', name: 'อาหาร', icon: 'food' },
  { id: 'travel', name: 'ท่องเที่ยว', icon: 'plane' },
  { id: 'other', name: 'อื่น ๆ', icon: 'spark' },
]

export const categoryName = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)?.name ?? id
