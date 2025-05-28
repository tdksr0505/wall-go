export const BoardSize = 7
export const MAX_STONE_COUNT = 8

export const Players = {
  Red: 'red',
  Blue: 'blue',
} as const
export type Player = (typeof Players)[keyof typeof Players]

export const GamePhase = {
  Start: 'start',
  SetupStone: 'setupStone',
  SelectStone: 'playerSelectStone',
  MoveStone: 'moveStone',
  PlaceWall: 'placeWall',
  GameOver: 'gameOver',
} as const
export type GamePhase = (typeof GamePhase)[keyof typeof GamePhase]

export const PlayerLabelConfig = {
  [Players.Blue]: '藍色',
  [Players.Red]: '紅色',
}

export const MoveDirections = [
  { x: 0, y: 1, from: 'bottom', to: 'top' },
  { x: 1, y: 0, from: 'right', to: 'left' },
  { x: 0, y: -1, from: 'top', to: 'bottom' },
  { x: -1, y: 0, from: 'left', to: 'right' },
] as const
