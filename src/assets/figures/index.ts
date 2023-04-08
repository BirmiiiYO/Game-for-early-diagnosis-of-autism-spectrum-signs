import { css } from 'styled-components'
import { IShapes } from '../../types/Shape'

import blueSquare from './blueSquare.png'
import redCircle from './redCircle.png'
import yellowTriangle from './yellowTriangle.png'

export const shapes: IShapes[] = [
  {
    id: 0,
    figure: css`
      width: 100px;
      height: 100px;
      background: #83a7c9;
      border-radius: 50%;
    `,
    figure: 'circle',
  },
  { id: 1, image: blueSquare as string, figure: 'square' },
  { id: 2, image: yellowTriangle as string, figure: 'triangle' },
]
