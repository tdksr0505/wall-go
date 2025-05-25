import { Button, Overlay } from '@mantine/core'
import type { Territory } from '@/types'
import { useState } from 'react'

type StartOverlayProps = {
  onRestartClick: () => void
  gameResult: Territory[]
}
export default function GameResultOverlay({ onRestartClick, gameResult }: StartOverlayProps) {
  const [opened, setOpened] = useState(true)
  const territoryCounts = gameResult.reduce(
    (acc, area) => {
      if (area.owner === 'blue') {
        acc.blue += area.positions.length
      } else if (area.owner === 'red') {
        acc.red += area.positions.length
      }
      return acc
    },
    { blue: 0, red: 0 }
  )
  if (!opened) return
  return (
    <>
      <Overlay color="#000" backgroundOpacity={0.85}>
        <div className="w-full h-full flex justify-center items-center">
          <div className="bg-white rounded-2xl p-6 w-[300px] max-w-full flex-col flex gap-4">
            <div className="text-[40px] text-center boder-bottom font-bold">GAME OVER</div>
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
              <Button onClick={() => setOpened(false)}>關閉</Button>
              <Button onClick={onRestartClick}>重新開始</Button>
            </div>
          </div>
        </div>
      </Overlay>
    </>
  )
}
