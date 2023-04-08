import styled from 'styled-components'

import { IFigureStyle } from './../types/Shape'

export const GameContainer = styled.div`
  border: 2px solid black;
  height: 60vh;
  overflow: hidden;
  position: relative;
  width: 100%;
`

export const Figure = styled.div<IFigureStyle>`
  animation-duration: ${({ speed }) => speed}s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  display: ${({ active }) => (active ? 'block' : 'none')};
  position: absolute;
`
