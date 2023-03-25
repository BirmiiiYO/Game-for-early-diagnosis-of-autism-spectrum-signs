/* eslint-disable react/jsx-key */
import Circle from 'assets/figures/redCircle.png'
import React, { useEffect, useState } from 'react'

import { GameContainer } from '@/styles'
import { IFigureStyle } from '@/types/Shape'

import { getRandomNumber} from './helpers'
import { Ball, Figure } from './styles'

export const CrumblingBalls = ({speed = 10}: IFigureStyle) => {
  const [balls, setBalls] = useState<Array<{x: number, y:number}>>([])
console.log(balls);

  useEffect(() => {
      const timer = setInterval(() => {
        setBalls(() => {
          const newBalls = [];
          for (let i = 0; i < 5; i++) {
            const x = getRandomNumber();
            const y = getRandomNumber();
            newBalls.push({ x, y });
          }
          return [ ...newBalls];
        });
      }, speed*1000 /2);
      return () => clearInterval(timer);
    }, [balls]);
  return (
    <GameContainer><Figure speed={speed} src={Circle as string}/>
    {balls.map(({x,y}) => <Ball speed={speed} x={x} y={y}/>)}
    </GameContainer>
  )
}
