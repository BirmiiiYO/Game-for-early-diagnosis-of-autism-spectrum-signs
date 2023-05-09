import styled, { keyframes } from 'styled-components'

const fadeFace = keyframes`
0% {
  opacity: 1;
}
100% {
  opacity: 0;
}
}
`

export const Image = styled.img<{ speed: number }>`
  animation: ${fadeFace} infinite ${({ speed }) => speed}s;
  animation-direction: alternate;
  position: absolute;
  bottom: 0;
  left: 25%;
  max-width: 600px;
`
