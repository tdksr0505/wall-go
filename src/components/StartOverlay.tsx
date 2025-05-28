import { Button, Overlay } from '@mantine/core'

type StartOverlayProps = {
  onStartClick: () => void
}
export default function StartOverlay({ onStartClick }: StartOverlayProps) {
  return (
    <>
      <Overlay color="#000" backgroundOpacity={0.85}>
        <div className="w-full h-full flex justify-center items-center">
          <Button
            variant="gradient"
            onClick={onStartClick}
            size="xl"
            gradient={{ from: 'gray', to: 'violet', deg: 139 }}
          >
            開始遊戲
          </Button>
        </div>
      </Overlay>
    </>
  )
}
