import React, { FC, useEffect, useState } from 'react'

import { shapes } from '@/assets/figures'
import { GameContainer } from '@/styles'

import { Figure } from './styles'

export const GeometricFigFade: FC = () => {
  const [activeId, setActiveId] = useState(0)

  useEffect(() => {
    const shapeInterval = setInterval(() => {
      activeId + 1  === shapes.length ? setActiveId(0) : setActiveId(activeId + 1)
    }, 1000);
    return () => clearInterval(shapeInterval);
  }, [activeId]);

  return (
    <GameContainer>
      {shapes.map(({id,image,figure})=> 
      <Figure key={id} src={image} 
      active={activeId === id} animationFigure={figure}/>)}
    </GameContainer>
  )
}
