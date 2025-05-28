import { BoardSize } from '@/constants'
import type { Territory } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs))
}

export const isValidPosition = (x: number, y: number) => {
  return x >= 0 && x <= BoardSize - 1 && y >= 0 && y <= BoardSize - 1
}

export const getTerritoryCounts = (territories: Territory[]): { blue: number; red: number } => {
  return territories.reduce(
    (acc, area) => {
      if (area.owner === 'blue') {
        acc.blue += area.positions.length
      } else if (area.owner === 'red') {
        acc.red += area.positions.length
      }
      return acc
    },
    { blue: 0, red: 0 }
  )
}
