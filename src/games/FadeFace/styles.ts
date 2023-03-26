import styled, { keyframes } from "styled-components";

const fadeFace = keyframes`
0% {
  opacity: 1;
}
100% {
  opacity: 0;
}
}
`;

export const Image = styled.img`
animation: ${fadeFace} infinite 4s;
animation-direction: alternate;
height: 200px;
margin-left: 40%;
margin-top: 5%;
width: 200px;
`