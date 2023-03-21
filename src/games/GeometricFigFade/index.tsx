import React, {  useEffect, useState } from 'react'

import { shapes } from '@/assets/figures'
import { GameContainer } from '@/styles'

import { FadeFigure } from './styles'

export const GeometricFigFade = () => {
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
      <FadeFigure key={id} src={image} 
      active={activeId === id} animationFigure={figure}/>)}
    </GameContainer>
  )
}
