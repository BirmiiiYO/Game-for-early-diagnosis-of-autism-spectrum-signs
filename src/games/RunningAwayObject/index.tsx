import styled, { keyframes } from 'styled-components'


import butterfly from '../../assets/gifs/butterfly.gif'

import { GameContainer } from './../../styles'

const moving = keyframes`
  0% {
    left: 0%;
}
  100% {
    left: 100%;
  }
`

export const Butterfly = styled.img< { speed: number }>`
  animation: ${moving} ${({speed}) => speed}s forwards;
  animation-iteration-count: 1;
  position: absolute;
`

export const RunningAwayObject = ({ speed = 5 }: { speed?: number }) => {
  return (
    <GameContainer>
      <Butterfly src={butterfly} alt="butterfly" speed={speed}/>
    </GameContainer>
  )
}
