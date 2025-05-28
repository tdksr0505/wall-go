import type { Direction } from '@/types'
import type { JSX } from 'react'
import { FaChevronUp, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import GradientButton from './GradientButton'

type PlaceWallButtonsProps = {
  onDirectionClick: (direction: Direction) => void
  placeableWallDirections: Direction[]
}

const ICON_SIZE = 30
export default function PlaceWallButtons({ onDirectionClick, placeableWallDirections }: PlaceWallButtonsProps) {
  // 按鈕對應文字
  const directionIconConfig: Record<Direction, JSX.Element> = {
    top: <FaChevronUp size={ICON_SIZE} />,
    bottom: <FaChevronDown size={ICON_SIZE} />,
    left: <FaChevronLeft size={ICON_SIZE} />,
    right: <FaChevronRight size={ICON_SIZE} />,
  }

  return (
    <>
      {(['top', 'bottom', 'left', 'right'] as Direction[]).map((dir) => (
        <GradientButton
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
          {directionIconConfig[dir]}
        </GradientButton>
      ))}
    </>
  )
}
