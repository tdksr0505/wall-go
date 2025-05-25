import { Button, Overlay } from '@mantine/core'

type StartOverlayProps = {
  onStartClick: () => void
}
export default function StartOverlay({ onStartClick }: StartOverlayProps) {
  return (
    <>
      <Overlay color="#000" backgroundOpacity={0.85}>
        <div className="w-full h-full flex justify-center items-center">
          <Button size="lg" onClick={onStartClick}>
            開始遊戲
          </Button>
        </div>
      </Overlay>
    </>
  )
}
