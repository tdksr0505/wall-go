import { Players, type Player } from '@/constants'
import { type Cell } from '@/types'
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
export default function Cell({ children, cellData, currentPlayer, className, onCellClick, isHighlight }: CellProps) {
  return (
    <div
      className={cn(
        'relative flex-1 aspect-square max-w-[100px] flex items-center justify-center cursor-pointer',
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
      style={{
        borderBottom: `1px solid #aaa`,
        borderRight: `1px solid #aaa`,
        borderTop: cellData.position.y === 0 ? `1px solid #aaa` : '',
        borderLeft: cellData.position.x === 0 ? `1px solid #aaa` : '',
      }}
      onClick={onCellClick}
    >
      {children}
      {cellData.walls.top && (
        <div
          className="absolute top-[-2px] left-0 w-full h-[3px] bg-blue"
          style={{ background: getWallColor(cellData.walls.top.placedBy) }}
        />
      )}
      {cellData.walls.bottom && (
        <div
          className="absolute bottom-[-2px] left-0 w-full h-[3px] bg-blue"
          style={{ background: getWallColor(cellData.walls.bottom.placedBy) }}
        />
      )}
      {cellData.walls.left && (
        <div
          className="absolute top-0 left-[-2px] w-[3px] h-full bg-blue"
          style={{ background: getWallColor(cellData.walls.left.placedBy) }}
        />
      )}
      {cellData.walls.right && (
        <div
          className="absolute top-0 right-[-2px] w-[3px] h-full bg-blue"
          style={{ background: getWallColor(cellData.walls.right.placedBy) }}
        />
      )}
    </div>
  )
}
