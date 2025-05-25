import { PlayerLabelConfig, Players, type Player } from '@/constants'
import { cn } from '@/utils'

type PlayerLabelProps = {
  player: Player
  className?: string
}
export default function PlayerLabel({ player, className }: PlayerLabelProps) {
  return (
    <span
      className={cn(`${player === Players.Blue ? 'text-blue' : 'text-red'}`, className)}
    >{` ${PlayerLabelConfig[player]}玩家 `}</span>
  )
}
