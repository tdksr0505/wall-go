import type { Player } from '@/constants'

export type Position = { x: number; y: number }

export type Direction = 'top' | 'right' | 'bottom' | 'left'

export type Stone = {
  id: string
  player: Player
}

export type Wall = {
  placedBy: Player
}

export type Cell = {
  position: Position
  stone: Stone | null
  walls: Record<Direction, Wall | null>
}

export type Territory = {
  owner: Player | null
  positions: Position[]
}
