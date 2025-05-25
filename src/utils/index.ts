import { BoardSize } from '@/constants'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs))
}

export const isValidPosition = (x: number, y: number) => {
  return x >= 0 && x <= BoardSize - 1 && y >= 0 && y <= BoardSize - 1
}
