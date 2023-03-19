

import { IShapes } from '@/types/Shape';

import blueCircle from './blueCircle.png';
import greenSquare from './greenSquare.png';
import redTriangle from './redTriangle.png';

export const shapes: IShapes[] = [
    { id: 0, image: blueCircle as string, figure: 'circle' },
    { id: 1, image: greenSquare as string, figure: 'square'},
    { id: 2, image: redTriangle as string, figure: 'triangle' },
  ];