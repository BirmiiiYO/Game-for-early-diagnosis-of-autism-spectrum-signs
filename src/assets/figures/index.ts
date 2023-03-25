

import { css } from 'styled-components';

import { IShapes } from '@/types/Shape';

import blueSquare from './blueSquare.png';
import redCircle from './redCircle.png';
import yellowTriangle from './yellowTriangle.png';

export const shapes: IShapes[] = [
    { id: 0, image: redCircle as string, figure: 'circle', position: css`
    left:5px;
    top:5px;
    ` },
    { id: 1, image: blueSquare as string, figure: 'square', position: css`
    right:5px;
    top:5px;
    ` },
    { id: 2, image: yellowTriangle as string, figure: 'triangle', position: css`
    bottom:5px;
    left:5px;
    `  },
  ];