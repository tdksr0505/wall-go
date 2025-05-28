import { GamePhase, MAX_STONE_COUNT } from '@/constants'
import type { Direction, Position } from '@/types'
import { useGameStore } from '@/stores'
import { useEffect, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'

export default function useGameController() {
  const {
    board,
    gamePhase,
    stoneCount,
    territories,
    setGamePhase,
    addStone,
    switchPlayer,
    getReachablePositions,
    moveStone,
    getPlaceableWallDirections,
    placeWall,
  } = useGameStore()
  const currentPlayer = useGameStore((state) => state.players[state.currentPlayerIndex])

  const [highlightPositions, setHighlightPositions] = useState<Position[]>([])
  const [selectedStonePosition, setSelectedStonePosition] = useState<Position | null>(null)
  const [placeWallOverlayOpened, { open: openPlaceWallOverlay, close: closePlaceWallOverlay }] = useDisclosure(false)
  const [placeableWallDirections, setPlaceableWallDirections] = useState<Direction[]>([])

  const handleSetupStone = (position: Position) => {
    const { x, y } = position
    const isSuccess = addStone({ x, y })
    if (!isSuccess) {
      alert('無法在此放置棋子')
      return
    }
    switchPlayer()
  }

  const handleSelectStone = (position: Position) => {
    const { x, y } = position
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
  }

  const handleMoveStone = (position: Position) => {
    if (!selectedStonePosition) return
    const isSameStone = selectedStonePosition.x === position.x && selectedStonePosition.y === position.y
    const isOwnStone = board[position.y][position.x].stone?.player === currentPlayer
    if (isOwnStone && !isSameStone) {
      handleSelectStone(position)
      return
    }
    const isValidMove = highlightPositions.some((el) => el.x === position.x && el.y === position.y)
    if (!isValidMove) {
      alert('無法移動此步')
      return
    }
    moveStone(selectedStonePosition, position)
    setSelectedStonePosition(position)
    setPlaceableWallDirections(getPlaceableWallDirections(position))
    setHighlightPositions([])
    openPlaceWallOverlay()
    setGamePhase(GamePhase.PlaceWall)
  }

  const handlePlaceWallOverlayDirectionClick = (direction: Direction) => {
    if (!selectedStonePosition) return
    closePlaceWallOverlay()
    placeWall(selectedStonePosition, direction)
    switchPlayer()
    setSelectedStonePosition(null)
    setHighlightPositions([])
    setGamePhase(GamePhase.SelectStone)
  }

  const handleCellClick = (position: Position) => {
    switch (gamePhase) {
      case GamePhase.SetupStone:
        handleSetupStone(position)
        break
      case GamePhase.SelectStone:
        handleSelectStone(position)
        break
      case GamePhase.MoveStone:
        handleMoveStone(position)
        break
      default:
        break
    }
  }

  useEffect(() => {
    // check is setup stones finish
    if (gamePhase !== GamePhase.SetupStone) return
    if (stoneCount >= MAX_STONE_COUNT) setGamePhase(GamePhase.SelectStone)
  }, [stoneCount])

  useEffect(() => {
    if (territories.length === 0) return
    const isGameOver = territories.every((el) => el.owner !== null)
    if (isGameOver) {
      setGamePhase(GamePhase.GameOver)
    }
  }, [territories])

  return {
    handleCellClick,
    handlePlaceWallOverlayDirectionClick,
    placeWallOverlayOpened,
    placeableWallDirections,
    highlightPositions,
  }
}
