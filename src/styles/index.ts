import styled from "styled-components";

import { IFigureStyle } from "@/types/Shape";

export const GameContainer = styled.div`
    border: 1px solid black;
    height:60vh;
    overflow: hidden;
    position: relative;
    width:100%;
`

export const Figure = styled.img<IFigureStyle>`
animation-duration: 1s;
animation-fill-mode: forwards;
animation-iteration-count: infinite;
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