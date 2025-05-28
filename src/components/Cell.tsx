import { Players, type Player } from '@/constants'
import { type Cell, type Direction } from '@/types'
import { cn } from '@/utils'

type CellProps = {
  cellData: Cell
  children: React.ReactNode
  currentPlayer: Player
  onCellClick: () => void
  isHighlight?: boolean
  className?: string
}

const getWallColor = (player: Player) => {
  return player === Players.Blue ? 'var(--blue)' : 'var(--red)'
}
const wallDirections: Array<{ key: Direction; className: string }> = [
  { key: 'top', className: 'rounded-full top-[-4px] left-[5px] w-[calc(100%_-_10px)] h-[5px]' },
  { key: 'bottom', className: 'rounded-full bottom-[-4px] left-[5px] w-[calc(100%_-_10px)] h-[5px]' },
  { key: 'left', className: 'rounded-full top-[5px] left-[-4px] w-[5px] h-[calc(100%_-_10px)]' },
  { key: 'right', className: 'rounded-full top-[5px] right-[-4px] w-[5px] h-[calc(100%_-_10px)]' },
]
export default function Cell({ children, cellData, currentPlayer, className, onCellClick, isHighlight }: CellProps) {
  return (
    <div
      className={cn(
        'relative w-full h-full flex items-center justify-center cursor-pointer rounded-md border border-[#c2c1c1]',
        {
          'bg-blue-100': isHighlight && currentPlayer === Players.Blue,
          'bg-red-100': isHighlight && currentPlayer === Players.Red,
        },
        {
          'hover:bg-blue-100': currentPlayer === Players.Blue,
          'hover:bg-red-100': currentPlayer === Players.Red,
        },
        className
      )}
      onClick={onCellClick}
    >
      {children}
      {wallDirections.map(({ key, className }) => {
        const wall = cellData.walls[key]
        if (!wall) return null

        return (
          <div key={key} className={`z-1 absolute ${className}`} style={{ background: getWallColor(wall.placedBy) }} />
        )
      })}
    </div>
  )
}
