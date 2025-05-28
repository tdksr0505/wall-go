import type { Direction } from '@/types'
import { Button } from '@mantine/core'

type PlaceWallButtonsProps = {
  onDirectionClick: (direction: Direction) => void
  placeableWallDirections: Direction[]
}

export default function PlaceWallButtons({ onDirectionClick, placeableWallDirections }: PlaceWallButtonsProps) {
  // 按鈕對應文字
  const directionLabels: Record<Direction, string> = {
    top: '上',
    bottom: '下',
    left: '左',
    right: '右',
  }

  return (
    <>
      {(['top', 'bottom', 'left', 'right'] as Direction[]).map((dir) => (
        <Button
          key={dir}
          style={{
            position: 'fixed',
            ...(dir === 'top' && { top: 10, left: '50%', transform: 'translateX(-50%)' }),
            ...(dir === 'bottom' && { bottom: 10, left: '50%', transform: 'translateX(-50%)' }),
            ...(dir === 'left' && { top: '50%', left: 10, transform: 'translateY(-50%)' }),
            ...(dir === 'right' && { top: '50%', right: 10, transform: 'translateY(-50%)' }),
            zIndex: 9999,
          }}
          size="lg"
          onClick={() => onDirectionClick(dir)}
          disabled={!placeableWallDirections.includes(dir)}
        >
          {directionLabels[dir]}
        </Button>
      ))}
    </>
  )
}
