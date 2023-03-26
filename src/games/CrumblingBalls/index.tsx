/* eslint-disable react/jsx-key */
import Circle from './../../assets/figures/redCircle.png'
import React, { useEffect, useState } from 'react'

import { GameContainer } from './../../styles'
import { IFigureStyle } from './../../types/Shape';


import { getRandomNumber} from './helpers'
import { Ball, Figure } from './styles'

export const CrumblingBalls = ({speed = 10}: IFigureStyle) => {
  const [ball, setBall] = useState<{x: number, y:number}>({x: 0, y: 0})
  useEffect(() => {
      const timer = setInterval(() => {
        setBall(() => {
            const x = getRandomNumber();
            const y = getRandomNumber();
          return {x,y};
        });
      }, speed * 1000 /4);
      return () => clearInterval(timer);
    }, [ball, speed]);
  return (
    <GameContainer><Figure speed={speed} src={Circle as string}/>
    <Ball speed={speed} x={ball.x} y={ball.y}/>
    </GameContainer>
  )
}
