import Stone from '@/components/Stone'
import Cell from '@/components/Cell'
import PlaceWallOverlay from '@/components/PlaceWallOverlay'
import { useGameStore } from '@/stores'
import useGameController from '@/hooks/useGameController'
import { useMemo } from 'react'
import type { Position } from '@/types'

export default function Board() {
  const board = useGameStore((s) => s.board)
  const territories = useGameStore((s) => s.territories)

  const {
    handleCellClick,
    handlePlaceWallOverlayDirectionClick,
    placeWallOverlayOpened,
    placeableWallDirections,
    reachablePositions,
  } = useGameController()

  const { redTerritories, blueTerritories } = useMemo(() => {
    const result: { redTerritories: Position[]; blueTerritories: Position[] } = {
      redTerritories: [],
      blueTerritories: [],
    }
    territories.forEach((el) => {
      if (el.owner === 'red') {
        result.redTerritories.push(...el.positions)
      } else if (el.owner === 'blue') {
        result.blueTerritories.push(...el.positions)
      }
    })
    return result
  }, [territories])

  const getHighlightColor = (target: Position) => {
    let highlightColor = reachablePositions.some((pos) => pos.x === target.x && pos.y === target.y)
      ? 'var(--cell-highlight-yellow)'
      : undefined
    highlightColor = redTerritories.some((pos) => pos.x === target.x && pos.y === target.y)
      ? 'var(--cell-highlight-red)'
      : highlightColor
    highlightColor = blueTerritories.some((pos) => pos.x === target.x && pos.y === target.y)
      ? 'var(--cell-highlight-blue)'
      : highlightColor
    return highlightColor
  }

  return (
    <>
      <div className="w-full max-w-[700px] mx-auto bg-white rounded-xl p-2  shadow-[0_0_6px_#5b1e78,0_0_12px_#5b1e78,0_0_24px_#5b1e78]">
        {board.map((row, index) => {
          return (
            <div key={index} className="flex w-full justify-center">
              {row.map((el) => {
                const stone = el.stone
                const highlightColor = getHighlightColor(el.position)
                return (
                  <Cell
                    cellData={el}
                    key={`${el.position.x}-${el.position.y}`}
                    onCellClick={() => handleCellClick(el.position)}
                    highlightColor={highlightColor}
                  >
                    {stone && <Stone player={stone.player} />}
                  </Cell>
                )
              })}
            </div>
          )
        })}
      </div>

      {placeWallOverlayOpened && (
        <PlaceWallOverlay
          onDirectionClick={handlePlaceWallOverlayDirectionClick}
          placeableWallDirections={placeableWallDirections}
        />
      )}
    </>
  )
}
