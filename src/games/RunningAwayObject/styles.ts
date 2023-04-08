import styled, { keyframes } from 'styled-components'

const moving = keyframes`
  0% {
    left: 0%;
}
  100% {
    left: 100%;
  }
`

export const Butterfly = styled.img`
  animation: ${moving} 10s forwards;
  animation-iteration-count: 1;
  position: absolute;
`
