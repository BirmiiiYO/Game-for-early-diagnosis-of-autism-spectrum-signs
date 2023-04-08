import { useEffect, useState } from 'react'

import { GameContainer } from './../../styles'
import { ICrumblingBallsProps } from './types'

import { getRandomNumber } from './helpers'
import { Ball, Figure } from './styles'

export const CrumblingBalls = ({
  speed = 10,
  mainBallColor = 'orange',
  smallBallColor = 'green',
  mainBallSize = 100,
  smallBallSize = 50,
}: ICrumblingBallsProps) => {
  const [ball, setBall] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  useEffect(() => {
    const timer = setInterval(() => {
      setBall(() => {
        const x = getRandomNumber()
        const y = getRandomNumber()
        return { x, y }
      })
    }, (speed * 1000) / 4)
    return () => clearInterval(timer)
  }, [ball, speed])
  return (
    <GameContainer>
      <Figure size={mainBallSize} speed={speed} mainColor={mainBallColor} />
      <Ball
        speed={speed}
        x={ball.x}
        y={ball.y}
        color={smallBallColor}
        size={smallBallSize}
      />
    </GameContainer>
  )
}
