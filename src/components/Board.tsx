import { useRef, useState } from 'react'
import { GamePhase } from '@/constants'
import type { Direction, Position, Territory } from '@/types'
import Stone from '@/components/Stone'
import Cell from '@/components/Cell'
import { useDisclosure } from '@mantine/hooks'
import PlaceWallModal from '@/components/PlaceWallModal'
import { useGameStore } from '@/stores'
import { Button } from '@mantine/core'

const MAX_STONE_COUNT = 4
type BoardProps = {
  onGameOver: (territories: Territory[]) => void
  onRestart: () => void
}
export default function Board({ onGameOver, onRestart }: BoardProps) {
  const [highlightPositions, setHighlightPositions] = useState<Position[]>([])
  const [selectedStonePosition, setSelectedStonePosition] = useState<Position | null>(null)
  const [placeWallOpened, { open: openPlaceWallModal, close: closePlaceWallModal }] = useDisclosure(false)
  const [placeableWallDirections, setPlaceableWallDirections] = useState<Direction[]>([])
  const stoneCount = useRef(0)
  const {
    board,
    gamePhase,
    setGamePhase,
    addStone,
    switchPlayer,
    getReachablePositions,
    moveStone,
    placeWall,
    getPlaceableWallDirections,
    getAllEnclosedTerritories,
  } = useGameStore()
  const currentPlayer = useGameStore((state) => state.players[state.currentPlayerIndex])

  const handleCellClick = (position: Position) => {
    const { x, y } = position
    switch (gamePhase) {
      case GamePhase.SetupStone:
        const isSuccess = addStone({ x, y })
        if (!isSuccess) {
          alert('無法在此放置棋子')
          return
        }
        stoneCount.current += 1
        switchPlayer()
        if (stoneCount.current === MAX_STONE_COUNT) {
          setGamePhase(GamePhase.SelectStone)
        }
        break
      case GamePhase.SelectStone:
        const stone = board[y][x].stone
        if (!stone || stone.player !== currentPlayer) {
          alert('請選擇自己的棋子')
          return
        }
        setSelectedStonePosition(position)
        const reachablePosition = getReachablePositions(position)
        if (reachablePosition.length === 1) {
          alert('此棋子無法移動，請選擇其他棋子')
          return
        }
        setHighlightPositions(reachablePosition)
        setGamePhase(GamePhase.MoveStone)

        break
      case GamePhase.MoveStone:
        if (!selectedStonePosition) return
        const isValidMove = highlightPositions.some((el) => el.x === position.x && el.y === position.y)
        if (!isValidMove) {
          alert('無法移動此步')
          return
        }
        moveStone(selectedStonePosition, position)
        setSelectedStonePosition(position)
        setPlaceableWallDirections(getPlaceableWallDirections(position))
        setHighlightPositions([])
        openPlaceWallModal()
        setGamePhase(GamePhase.PlaceWall)
        break
      default:
        break
    }
  }

  const handlePlaceWallModalDirectionClick = (direction: Direction) => {
    if (!selectedStonePosition) return
    closePlaceWallModal()
    placeWall(selectedStonePosition, direction)
    const territories = getAllEnclosedTerritories()
    const isGameOver = territories.every((el) => el.owner !== null)
    if (isGameOver) {
      onGameOver(territories)
      return
    }
    console.log(`territories`, territories)
    switchPlayer()
    setSelectedStonePosition(null)
    setHighlightPositions([])
    setGamePhase(GamePhase.SelectStone)
  }
  return (
    <>
      {board.map((row, index) => {
        return (
          <div key={index} className="flex w-full justify-center">
            {row.map((el) => {
              const stone = el.stone
              const isHighlight = highlightPositions.some((pos) => pos.x === el.position.x && pos.y === el.position.y)
              return (
                <Cell
                  cellData={el}
                  key={`${el.position.x}-${el.position.y}`}
                  currentPlayer={currentPlayer}
                  onCellClick={() => handleCellClick(el.position)}
                  isHighlight={isHighlight}
                >
                  {stone && <Stone player={stone.player} />}
                  <div>{`${el.position.x},${el.position.y}`}</div>
                </Cell>
              )
            })}
          </div>
        )
      })}
      <div className="flex justify-center p-2">
        {gamePhase === GamePhase.PlaceWall && <Button onClick={openPlaceWallModal}>放置牆壁</Button>}
        {gamePhase === GamePhase.GameOver && <Button onClick={onRestart}>重新開始</Button>}
      </div>
      <PlaceWallModal
        opened={placeWallOpened}
        onClose={closePlaceWallModal}
        onDirectionClick={handlePlaceWallModalDirectionClick}
        currentPlayer={currentPlayer}
        placeableWallDirections={placeableWallDirections}
      />
    </>
  )
}
