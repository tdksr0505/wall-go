import { Overlay } from '@mantine/core'
import GradientButton from './GradientButton'

type StartOverlayProps = {
  onStartClick: () => void
}
export default function StartOverlay({ onStartClick }: StartOverlayProps) {
  return (
    <>
      <Overlay color="#000" backgroundOpacity={0.85}>
        <div className="w-full h-full flex justify-center items-center">
          <GradientButton onClick={onStartClick} size="xl">
            開始遊戲
          </GradientButton>
        </div>
      </Overlay>
    </>
  )
}
