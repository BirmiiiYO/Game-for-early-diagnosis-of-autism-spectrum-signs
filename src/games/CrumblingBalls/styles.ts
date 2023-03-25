import  styled, { keyframes }  from 'styled-components';

const appear  = keyframes`
  0% {
    opacity: 0;
    transform: scale(0);
  }

  100% {
    opacity: 1;
    transform: scale(1.5);
  }

`;

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
`;

export const Ball = styled.div<{speed: number, x: number, y: number}>`
animation-duration: ${({speed}) => speed/2}s;
animation-fill-mode: forwards;
animation-iteration-count: infinite;
animation-name:  ${explode};
animation-timing-function: ease-out;
background-color: red;
border-radius: 50%;
height: 50px;
left: ${({y})=>y}%;
opacity: 0;
position: absolute;
top: ${({x})=>x}%;
width: 50px;
`;


export const Figure = styled.img<{speed: number}>`
    animation-duration: ${({speed})=>speed}s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: ${appear};
    height:100px;
    left: calc(50% - 100px);
    position:absolute;
    top: calc(50% - 50px);
    width:100px;
`