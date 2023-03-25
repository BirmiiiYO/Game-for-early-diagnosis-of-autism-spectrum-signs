import styled, { keyframes } from "styled-components";

import { Figure } from "@/styles";

import { IGeometricFigMoveProps } from "./types";

const moveSquare = keyframes`
0% {
  transform: translate(0,0);
}
100% {
  transform: translate(-90vw, -60vh);
}
`;

const moveCircle = keyframes`
  0% {
    transform: translate(0,0);
  }
  100% {
    transform: translate(90vw, -60vh);
  }
`;

const moveTriangle = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(90vw, 60vh);
  }
`;

export const MoveFigure = styled(Figure)<IGeometricFigMoveProps>`
animation-name: ${({animationFigure})=> {
  switch(animationFigure) {
      case 'circle':
          return moveCircle
      case 'square':
          return moveSquare
      case 'triangle':
          return moveTriangle
  }  
}};
`