import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { BoardSize, GamePhase, MoveDirections, type Player, Players } from '@/constants'
import type { Cell, Direction, Position, Stone, Territory, Wall } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { isValidPosition } from '@/utils'

const INIT_STONES_CONFIG: Array<{ position: Position; stone: Stone }> = [
  { position: { x: 1, y: 1 }, stone: { id: uuidv4(), player: Players.Red } },
  { position: { x: BoardSize - 2, y: BoardSize - 2 }, stone: { id: uuidv4(), player: Players.Red } },
  { position: { x: BoardSize - 2, y: 1 }, stone: { id: uuidv4(), player: Players.Blue } },
  { position: { x: 1, y: BoardSize - 2 }, stone: { id: uuidv4(), player: Players.Blue } },
]
type GameState = {
  board: Cell[][]
  players: Player[]
  currentPlayerIndex: number
  gamePhase: GamePhase
  stoneCount: number
  territories: Territory[]
  initGame: () => void
  setGamePhase: (gamePhase: GamePhase) => void
  addStone: (position: { x: number; y: number }) => { isSuccess: boolean; stoneCount: number }
  switchPlayer: () => void
  getReachablePositions: (start: Position) => Position[]
  moveStone: (from: Position, to: Position) => void
  getPlaceableWallDirections: (position: Position) => Direction[]
  placeWall: (position: Position, direction: Direction) => void
  checkTerritories: () => void
  isGameOver: () => void
  restartGame: () => void
}

export const useGameStore = create<GameState>()(
  immer((set, get) => ({
    board: [],
    players: [],
    currentPlayerIndex: 0,
    gamePhase: GamePhase.Start,
    stoneCount: INIT_STONES_CONFIG.length,
    territories: [],
    initGame: () => {
      set((state) => {
        const board: Cell[][] = []
        for (let i = 0; i < BoardSize; i++) {
          const row: Cell[] = []
          for (let j = 0; j < BoardSize; j++) {
            const initStone = INIT_STONES_CONFIG.find((pos) => pos.position.x === j && pos.position.y === i)?.stone
            row.push({
              position: { x: j, y: i },
              stone: initStone || null,
              walls: {
                bottom: null,
                right: null,
                top: null,
                left: null,
              },
            })
          }
          board.push(row)
        }
        state.board = board
        state.players = [Players.Red, Players.Blue]
        state.currentPlayerIndex = 0
        state.stoneCount = INIT_STONES_CONFIG.length
        state.territories = []
      })
    },
    setGamePhase: (gamePhase: GamePhase) => {
      set((state) => {
        state.gamePhase = gamePhase
      })
    },
    addStone({ x, y }: Position) {
      let stoneCount = get().stoneCount
      const isStoneExist = Boolean(get().board[y][x].stone)
      if (isStoneExist) {
        return { isSuccess: false, stoneCount }
      }
      set((state) => {
        const currentPlayer = state.players[state.currentPlayerIndex]
        const newStone: Stone = { id: uuidv4(), player: currentPlayer }
        state.board[y][x].stone = newStone
        state.stoneCount = state.stoneCount + 1
        stoneCount = state.stoneCount
      })
      return { isSuccess: true, stoneCount }
    },
    switchPlayer() {
      set((state) => {
        state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length
      })
    },
    getReachablePositions(start: Position) {
      const visited = new Set<string>()
      const result: Position[] = []

      function addIfValid(position: Position, step: number) {
        const key = `${position.x},${position.y}`
        if (!isValidPosition(position.x, position.y)) return
        const currentCell = get().board[position.y][position.x]
        if (start !== position && currentCell.stone) return
        if (visited.has(key)) return

        visited.add(key)
        result.push(position)

        if (step < 2) {
          for (const dir of MoveDirections) {
            const nextX = position.x + dir.x
            const nextY = position.y + dir.y
            if (!isValidPosition(nextX, nextY)) continue
            const fromCell = get().board[position.y][position.x]
            const toCell = get().board[nextY][nextX]

            const wallFrom = fromCell.walls?.[dir.from]
            const wallTo = toCell.walls?.[dir.to]

            const blocked = wallFrom || wallTo
            if (!blocked) {
              addIfValid({ x: nextX, y: nextY }, step + 1)
            }
          }
        }
      }

      addIfValid(start, 0)

      return result
    },
    moveStone(from, to) {
      set((state) => {
        const stone = state.board[from.y][from.x].stone
        state.board[from.y][from.x].stone = null
        state.board[to.y][to.x].stone = stone
      })
    },
    getPlaceableWallDirections(position: Position) {
      const result: Direction[] = []

      for (const dir of MoveDirections) {
        const x = position.x
        const y = position.y
        const nx = x + dir.x
        const ny = y + dir.y

        // 超出邊界不能放牆
        if (!isValidPosition(nx, ny)) continue

        const currentCell = get().board[y][x]
        const neighborCell = get().board[ny][nx]

        const currentWallExists = currentCell.walls?.[dir.from]
        const neighborWallExists = neighborCell.walls?.[dir.to]

        if (!currentWallExists && !neighborWallExists) {
          result.push(dir.from) // 回傳 from 就是這個格子可以放的方向
        }
      }

      return result
    },
    placeWall(position: Position, direction: Direction) {
      const { currentPlayerIndex, players } = get()
      const currentPlayer = players[currentPlayerIndex]
      set((state) => {
        const newWall: Wall = {
          placedBy: currentPlayer,
        }
        state.board[position.y][position.x].walls[direction] = newWall
      })
      get().checkTerritories()
    },
    checkTerritories(): void {
      const board = get().board
      const height = board.length
      const width = board[0].length
      const visited = new Set<string>()
      const territories: Territory[] = []

      const exploreArea = (start: Position): Territory | null => {
        const queue = [start]
        const localVisited = new Set<string>()
        const positions: Position[] = []
        const touchingPlayers = new Set<Player>()

        while (queue.length > 0) {
          const pos = queue.pop()!
          const key = `${pos.x},${pos.y}`
          if (localVisited.has(key)) continue
          localVisited.add(key)
          positions.push(pos)

          const cell = board[pos.y][pos.x]
          if (cell.stone) touchingPlayers.add(cell.stone.player)

          for (const dir of MoveDirections) {
            const nx = pos.x + dir.x
            const ny = pos.y + dir.y
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue

            const neighbor = board[ny][nx]
            const hasWall = cell.walls?.[dir.from] || neighbor.walls?.[dir.to]
            const neighborKey = `${nx},${ny}`

            if (!hasWall && !localVisited.has(neighborKey)) {
              queue.push({ x: nx, y: ny })
            }
          }
        }

        // 加入全局 visited
        localVisited.forEach((key) => visited.add(key))

        let owner: Player | null = null

        if (touchingPlayers.size === 0) {
          return null
        }
        if (touchingPlayers.size === 1) {
          owner = [...touchingPlayers][0]
        }

        return { owner, positions }
      }

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const key = `${x},${y}`
          if (visited.has(key)) continue

          const result = exploreArea({ x, y })
          if (result) territories.push(result)
        }
      }

      set((state) => {
        state.territories = territories
      })
    },
    isGameOver: () => {
      return false
    },
    restartGame: () => {
      get().initGame()
      set((state) => {
        state.gamePhase = GamePhase.SetupStone
      })
    },
  }))
)
