import { useEffect, useState } from 'react'

import { shapes } from './../../assets/figures'
import { GameContainer } from './../../styles'

import { MoveFigure } from './styles'
import { IGeometricFigMoveProps } from './types'

export const GeometricFigMove = ({ speed = 5 }: IGeometricFigMoveProps) => {
  const [activeId, setActiveId] = useState(0)

  useEffect(() => {
    const shapeInterval = setInterval(() => {
      activeId + 1 === shapes.length
        ? setActiveId(0)
        : setActiveId(activeId + 1)
    }, (speed * 1000) / 2)
    return () => clearInterval(shapeInterval)
  }, [activeId, speed])

  return (
    <GameContainer>
      {/* {shapes.map(({ id, image, figure }) => (
        <MoveFigure
          key={id}
          src={image}
          speed={speed}
          active={activeId === id}
          animationFigure={figure}
        />
      ))} */}test
    </GameContainer>
  )
}