import Stone from '@/components/Stone'
import Cell from '@/components/Cell'
import PlaceWallOverlay from '@/components/PlaceWallOverlay'
import { useGameStore } from '@/stores'
import useGameController from '@/hooks/useGameController'

export default function Board() {
  const board = useGameStore((s) => s.board)
  const currentPlayer = useGameStore((s) => s.players[s.currentPlayerIndex])

  const {
    handleCellClick,
    handlePlaceWallOverlayDirectionClick,
    placeWallOverlayOpened,
    placeableWallDirections,
    highlightPositions,
  } = useGameController()

  return (
    <>
      <div className="w-full max-w-[700px] mx-auto bg-white rounded-2xl  shadow-[0_0_6px_#5b1e78,0_0_12px_#5b1e78,0_0_24px_#5b1e78]">
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
