import styled, { keyframes } from 'styled-components'

import { Figure } from '@/styles'
import { IFigureStyle } from '@/types/Shape'

const fadeTriangle = keyframes`
0% {
  opacity: 1;
}
40% {
  opacity: 0;
  top: calc(50% - 100px);
  left: calc(50% - 100px);
}
60% {
  opacity: 0;
  top: 5px;
  left: 5px;
}
100% {
  opacity: 1;
  top: 5px;
  left: 5px;
}
`

const fadeCircle = keyframes`
0% {
  opacity: 1;
}
40% {
  opacity: 0;
  top: calc(50% - 100px);
  left: calc(50% - 100px);
}
60% {
  opacity: 0;
  bottom: 5px;
  left: 5px;
}
100% {
  opacity: 1;
  bottom: 5px;
  left: 5px;
}
`

const fadeSquare = keyframes`
0% {
  opacity: 1;
}
40% {
  opacity: 0;
  top: calc(50% - 100px);
  left: calc(50% - 100px);
}
60% {
  opacity: 0;
  top: 5px;
  right: 5px;
}
100% {
  opacity: 1;
  top: 5px;
  right: 5px;
}
`

export const FadeFigure =
  styled(Figure) <
  IFigureStyle >
  `
animation-name: ${({ animationFigure }) => {
    switch (animationFigure) {
      case 'circle':
        return fadeCircle
      case 'square':
        return fadeSquare
      case 'triangle':
        return fadeTriangle
    }
  }};
`
