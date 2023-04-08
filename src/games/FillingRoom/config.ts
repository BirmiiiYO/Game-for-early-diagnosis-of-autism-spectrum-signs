import { css, FlattenSimpleInterpolation } from 'styled-components'

import { IShapes } from '../../types/Shape'

import man from '../../assets/furnitures/man.png'
import cabinet from '../../assets/furnitures/cabinet.png'
import chair from '../../assets/furnitures/chair.png'
import lamp from '../../assets/furnitures/lamp.png'
import table from '../../assets/furnitures/table.png'

export type IFurniture = Omit<IShapes, 'figure'> & {
  element: string
  styles: FlattenSimpleInterpolation
}

export const furnitures: IFurniture[] = [
  {
    id: 0,
    image: chair as string,
    element: 'chair',
    styles: css`
      max-width: 100%;
      max-height: 250px;
      bottom: 10px;
      left: 10px;
    `,
  },
  {
    id: 1,
    image: table as string,
    element: 'table',
    styles: css`
      max-width: 100%;
      max-height: 250px;
      left: 10px;
      top: 10px;
    `,
  },
  {
    id: 2,
    image: cabinet as string,
    element: 'cabinet',
    styles: css`
      max-width: 100%;
      max-height: 300px;
      right: 10px;
      top: 10px;
    `,
  },
  {
    id: 3,
    image: lamp as string,
    element: 'lamp',
    styles: css`
      max-width: 100%;
      max-height: 150px;
      bottom: 10px;
      right: 10px;
    `,
  },
  {
    id: 4,
    image: man as string,
    element: 'man',
    styles: css`
      max-width: 100%;
      max-height: 400px;
      left: 45%;
      top: 35%;
    `,
  },
]
