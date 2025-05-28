import { Button, type ButtonProps } from '@mantine/core'

interface GradientButtonProps extends ButtonProps {
  onClick?: () => void
  children: React.ReactNode
}

export default function GradientButton({ children, onClick, ...props }: GradientButtonProps) {
  return (
    <Button variant="gradient" gradient={{ from: '#ff7a7a', to: 'violet', deg: 139 }} onClick={onClick} {...props}>
      {children}
    </Button>
  )
}
