import { GamePhase } from '@/constants'
import { useMemo } from 'react'
import PlayerLabel from './PlayerLabel'
import { useGameStore } from '@/stores'

export default function GamePrompt() {
  const currentPlayer = useGameStore((state) => state.players[state.currentPlayerIndex])
  const gamePhase = useGameStore((state) => state.gamePhase)
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
  if (gamePhase === GamePhase.Start || gamePhase === GamePhase.GameOver) return
  return (
    <>
      <div className="text-[20px] text-white">
        <span>請</span>
        <PlayerLabel player={currentPlayer} />
        <span>{actionPrompt}</span>
      </div>
    </>
  )
}
