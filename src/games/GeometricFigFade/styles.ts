import styled, { keyframes } from "styled-components";

import { Figure } from "@/styles";
import { IFigureStyle } from "@/types/Shape";

const fadeSquare = keyframes`
0% { transform: scale(1) }
100% {transform: scale(0) }
`;

const fadeCircle = keyframes`
0% { transform: scale(1) }
100% {transform: scale(0) }
`;

const fadeTriangle = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
`;

export const FadeFigure = styled(Figure)<IFigureStyle>`
animation-name: ${({animationFigure})=> {
  switch(animationFigure) {
      case 'circle':
          return fadeCircle
      case 'square':
          return fadeSquare
      case 'triangle':
          return fadeTriangle
  }
}};
`