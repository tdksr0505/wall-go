import { Players, type Player } from '@/constants'

type StoneProps = {
  player: Player
}
export default function Stone({ player }: StoneProps) {
  return <div className={`w-[60%] h-[60%]  rounded-full shadow-lg ${player === Players.Blue ? 'bg-blue' : 'bg-red'}`} />
}
