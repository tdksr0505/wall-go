import { GamePhase } from '@/constants'
import { useMemo } from 'react'
import PlayerLabel from './PlayerLabel'
import { useGameStore } from '@/stores'
import { getTerritoryCounts } from '@/utils'
import { Button } from '@mantine/core'

export default function GamePrompt({ onRestartClick }: { onRestartClick: () => void }) {
  const currentPlayer = useGameStore((state) => state.players[state.currentPlayerIndex])
  const gamePhase = useGameStore((state) => state.gamePhase)
  const territories = useGameStore((state) => state.territories)
  const actionPrompt = useMemo(() => {
    switch (gamePhase) {
      case GamePhase.SetupStone:
        return '放置棋子'
      case GamePhase.SelectStone:
        return '選擇棋子'
      case GamePhase.MoveStone:
        return '移動棋子'
      case GamePhase.PlaceWall:
        return '放置牆壁'
    }
  }, [gamePhase])

  const territoryCounts = getTerritoryCounts(territories)
  if (gamePhase === GamePhase.Start) return
  return (
    <div className="flex justify-center items-center gap-10">
      <div className="flex justify-center items-center gap-1 bg-white rounded-lg p-2 w-[60px]">
        <div className="w-[20px] h-[20px] rounded-full bg-red"></div>
        <div>{territoryCounts.red}</div>
      </div>
      {gamePhase !== GamePhase.GameOver && (
        <div className="text-[20px] text-white">
          <span>請</span>
          <PlayerLabel player={currentPlayer} />
          <span>{actionPrompt}</span>
        </div>
      )}
      {gamePhase === GamePhase.GameOver && <Button onClick={onRestartClick}>重新開始</Button>}
      <div className="flex justify-center items-center gap-1 bg-white rounded-lg p-2 w-[60px]">
        <div className="w-[20px] h-[20px] rounded-full bg-blue"></div>
        <div>{territoryCounts.blue}</div>
      </div>
    </div>
  )
}
