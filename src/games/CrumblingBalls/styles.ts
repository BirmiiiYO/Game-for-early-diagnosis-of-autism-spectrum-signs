import styled, { keyframes } from 'styled-components'

import { IMainBallStyle, ISmallBallStyle } from './types'

const appear = keyframes`
  0% {
    opacity: 0;
    transform: scale(0);
  }

  100% {
    opacity: 1;
    transform: scale(1.5);
  }

`

const explode = keyframes`
  0% {
    opacity: 0;

  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`

export const Ball = styled.div<ISmallBallStyle>`
  animation-duration: ${({ speed }) => speed}s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${explode};
  animation-timing-function: ease-out;
  background-color: ${({ color }) => color};
  border-radius: 50%;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  left: ${({ y }) => y}%;
  opacity: 0;
  position: absolute;
  top: ${({ x }) => x}%;
  width: 50px;
`

export const Figure = styled.div<IMainBallStyle>`
  animation-duration: ${({ speed }) => speed}s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${appear};
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background: ${({ mainColor }) => mainColor};
  border-radius: 50%;
  left: calc(50% - 100px);
  position: absolute;
  top: calc(50% - 50px);
`
