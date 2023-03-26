import styled from 'styled-components'

import { IFigureStyle } from './../types/Shape'

export const GameContainer = styled.div`
  border: 2px solid black;
  height: 60vh;
  overflow: hidden;
  position: relative;
  width: 100%;
`

export const Figure =
  styled.img <
  IFigureStyle >
  `
animation-duration: ${({ speed }) => speed}s;
animation-fill-mode: forwards;
animation-iteration-count: infinite;
background-color: #fff;
display: ${({ active }) => (active ? 'block' : 'none')};
height: 100px;
left: calc(50% - 100px);
position: absolute;
top: calc(50% - 100px);
width: 100px;
`
