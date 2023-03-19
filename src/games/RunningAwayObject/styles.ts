import  styled, { keyframes }  from 'styled-components';

const moving = keyframes`
  0% {
    transform: rotate(100deg);
}
  50% {
    transform: rotate(30deg);
  }
  100% {
    transform: rotate(60deg);
  }
`;

export const Object = styled.img`
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: ${moving};
    animation-timing-function: ease-in-out;
    position: absolute;
    transform: rotate(30deg);
    width: 100px;
`