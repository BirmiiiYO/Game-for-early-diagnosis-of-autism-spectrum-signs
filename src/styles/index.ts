import styled from 'styled-components'

import { IFigureStyle } from './../types/Shape'

export const GameContainer = styled.div`
  height: 80vh;
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
background-color: ${({figure}) =>
(figure === 'triangle' ? '#fff' : '#fff' || 
figure === 'circle' ? 'red' : '#fff' || 
figure === 'square' ? 'blue' : '#fff')};
display: ${({ active }) => (active ? 'block' : 'none')};
height: ${({figure}) => figure === 'square' ? '100px' : '' || figure === 'circle' ? '100px' : '' || figure === 'triangle' ? '0px' : '0'};
left: calc(50% - 100px);
position: absolute;
border-left: ${({figure}) => figure === 'triangle' ? '50px solid transparent' : ''};
border-right: ${({figure}) => figure === 'triangle' ? '50px solid transparent' : ''};
border-bottom: ${({figure}) => figure === 'triangle' ? '100px solid yellow' : ''};;
border-radius: ${({figure}) => figure === 'square' ? '0px' : '' || figure === 'circle' ? '50px' : '' || figure === 'triangle' ? '0' : ''};
top: calc(50% - 100px);
width: ${({figure}) => figure === 'square' ? '100px' : '' || figure === 'circle' ? '100px' : '' || figure === 'triangle' ? '0px' : '0'};
`