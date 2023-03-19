import styled, { keyframes } from "styled-components";

import { Figure } from "@/styles";

const moveSquare = keyframes`
  0% {
    transform: translate(-50%, -50%);
  }
  100% {
    transform: translate(-1000%, -50%);
  }
`;

const moveCircle = keyframes`
  0% {
    transform: translate(-50%, -50%);
  }
  100% {
    transform: translate(-10%, -990%);
  }
`;

const moveTriangle = keyframes`
  0% {
    transform: translate(-50%, -50%);
  }
  100% {
    transform: translate(500%, 30%);
  }
`;

export const MoveFigure = styled(Figure)`
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