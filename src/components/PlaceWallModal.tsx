import { type Player } from '@/constants'
import type { Direction } from '@/types'
import { Button, Modal } from '@mantine/core'
import PlayerLabel from './PlayerLabel'

type PlaceWallModalProps = {
  opened: boolean
  onClose: () => void
  onDirectionClick: (direction: Direction) => void
  currentPlayer: Player
  placeableWallDirections: Direction[]
}

const DirectionGroups = [['top'], ['left', 'right'], ['bottom']]
export default function PlaceWallModal({
  opened,
  onClose,
  onDirectionClick,
  currentPlayer,
  placeableWallDirections,
}: PlaceWallModalProps) {
  return (
    <Modal opened={opened} onClose={onClose}>
      <div className="text-center text-xl mb-3">
        請
        <PlayerLabel player={currentPlayer} />
        放置牆壁
      </div>

      <div className="flex flex-col justify-center items-center gap-2">
        {DirectionGroups.map((group, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2">
            {group.map((dir) => (
              <Button
                key={dir}
                size="lg"
                onClick={() => onDirectionClick(dir as Direction)}
                disabled={!placeableWallDirections.includes(dir as Direction)}
              >
                {dir === 'top' && '上'}
                {dir === 'bottom' && '下'}
                {dir === 'left' && '左'}
                {dir === 'right' && '右'}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  )
}
