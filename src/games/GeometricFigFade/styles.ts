import styled, { keyframes } from "styled-components";

import { IFigure } from "./types";

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
    transform: translate(-100%, -5000%);
  }
`;

export const Figure = styled.img<IFigure>`
animation-duration: 5s;
animation-fill-mode: forwards;
animation-iteration-count: infinite;
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
animation-timing-function: ease-in-out;
background-color: #fff;
display: ${({active})=> active ? 'block' : 'none'};
height: 100px;
left: 50%;
position: absolute;
top: 50%;
transform: translate(-50%, -50%);
width: 100px;
`