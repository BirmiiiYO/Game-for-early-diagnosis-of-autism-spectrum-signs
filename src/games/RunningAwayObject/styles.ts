import styled, { keyframes } from 'styled-components'

const moving = keyframes`
  0% {
    left: 0%;
}
  100% {
    left: 100%;
  }
`

<<<<<<< HEAD
export const Butterfly = styled.img`
=======
export const Batterfly = styled.img`
>>>>>>> 3da56d2dcedbd305b9abe84b55e0844230fe96a3
animation: ${moving} 10s forwards;
animation-iteration-count: 1;
position: absolute;
`
