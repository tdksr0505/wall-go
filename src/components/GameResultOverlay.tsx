import { Overlay } from '@mantine/core'
import { useState } from 'react'
import { useGameStore } from '@/stores'
import { getTerritoryCounts } from '@/utils'
import GradientButton from './GradientButton'

type StartOverlayProps = {
  onRestartClick: () => void
}
export default function GameResultOverlay({ onRestartClick }: StartOverlayProps) {
  const territories = useGameStore((s) => s.territories)

  const [opened, setOpened] = useState(true)
  const territoryCounts = getTerritoryCounts(territories)

  const getTitleConfig = () => {
    if (territoryCounts.blue === territoryCounts.red) return { text: 'DRAW!', color: undefined }
    if (territoryCounts.blue > territoryCounts.red) return { text: 'BLUE WIN!', color: 'var(--blue)' }
    return { text: 'RED WIN!', color: 'var(--red)' }
  }
  const titleConfig = getTitleConfig()
  if (!opened) return
  return (
    <>
      <Overlay color="#000" backgroundOpacity={0.85}>
        <div className="w-full h-full flex justify-center items-center">
          <div className="bg-white rounded-2xl p-6 w-[300px] max-w-full flex-col flex gap-4">
            <div className="text-[40px] text-center boder-bottom font-bold" style={{ color: titleConfig.color }}>
              {titleConfig.text}
            </div>
            <div className="text-[20px] border rounded-2xl border-[#aaa] p-3">
              <div className="border-b border-[#aaa] pb-2 mb-2 flex justify-between items-center">
                <div className=" w-[30px] h-[30px] rounded-md bg-red" />
                <div>{territoryCounts.red}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className=" w-[30px] h-[30px] rounded-md bg-blue" />
                <div>{territoryCounts.blue}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <GradientButton onClick={() => setOpened(false)}>關閉</GradientButton>
              <GradientButton onClick={onRestartClick}>重新開始</GradientButton>
            </div>
          </div>
        </div>
      </Overlay>
    </>
  )
}
