import { IShapes } from '../../types/Shape';

import blueSquare from './blueSquare.png';
import redCircle from './redCircle.png';
import yellowTriangle from './yellowTriangle.png';

export const shapes: IShapes[] = [
    { id: 0, image: redCircle as string, figure: 'circle'},
    { id: 1, image: blueSquare as string, figure: 'square'},
    { id: 2, image: yellowTriangle as string, figure: 'triangle'},
  ];

  