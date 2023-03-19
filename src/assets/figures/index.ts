/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TFigure } from '@/games/GeometricFigMove/types';

import blueCircle from './blueCircle.png';
import greenSquare from './greenSquare.png';
import redTriangle from './redTriangle.png';

interface IShapes {
  id: number;
  image: any;
  figure: TFigure

}

export const shapes: IShapes[] = [
    { id: 0, image: blueCircle, figure: 'circle' },
    { id: 1, image: greenSquare, figure: 'square'},
    { id: 2, image: redTriangle, figure: 'triangle' },
  ];