import { useEffect, useState } from 'react'
import { GamePhase } from '@/constants'
import type { Territory } from '@/types'
import StartOverlay from '@/components/StartOverlay'
import GamePrompt from '@/components/GamePrompt'
import { useGameStore } from '@/stores'
import GameResultOverlay from '@/components/GameResultOverlay'
import Board from './components/Board'

function App() {
  const { gamePhase, setGamePhase, initGame, restartGame } = useGameStore()
  const [boardKey, setBoardKey] = useState(0)
  const [gameResult, setGameResult] = useState<Territory[]>([])
  const handleStartClick = () => {
    setGamePhase(GamePhase.SetupStone)
  }

  const handleRestartClick = () => {
    restartGame()
    setBoardKey((prev) => prev + 1)
  }

  useEffect(() => {
    initGame()
  }, [])

  return (
    <>
      <div className="w-dvw h-dvh p-2 flex flex-col gap-2">
        <div className="flex items-center gap-3 justify-center h-[50px]">
          <GamePrompt />
        </div>
        <div>
          <Board
            key={boardKey}
            onRestart={handleRestartClick}
            onGameOver={(territories) => {
              setGameResult(territories)
              setGamePhase(GamePhase.GameOver)
            }}
          />
        </div>
      </div>
      {gamePhase === GamePhase.Start && <StartOverlay onStartClick={handleStartClick} />}
      {gamePhase === GamePhase.GameOver && (
        <GameResultOverlay gameResult={gameResult} onRestartClick={handleRestartClick} />
      )}
    </>
  )
}

export default App
