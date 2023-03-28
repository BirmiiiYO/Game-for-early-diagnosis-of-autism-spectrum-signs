import { css, FlattenSimpleInterpolation } from 'styled-components';

import { IShapes } from '../../types/Shape';

import man from '../man.png';
import cabinet from './cabinet.png';
import chair from './chair.png';
import lamp from './lamp.png';
import table from './table.png';

export type IFurniture = Omit<IShapes, 'figure'> & {
  element: string;
  position: FlattenSimpleInterpolation
}

export const furnitures: IFurniture[] = [
    { id: 0, image: chair as string, element: 'chair', position: css`
    bottom: 10px; left: 10px;`},
    { id: 1, image: table as string, element: 'table', position: css`
    left: 10px; top: 10px`},
    { id: 2, image: cabinet as string, element: 'cabinet', position: css`
    right: 10px; top: 10px` },
    { id: 3, image: lamp as string, element: 'lamp', position: css`
    bottom: 10px; right: 10px;` },
    { id: 4, image: man as string, element: 'man', position: css`
    left: 45%; top: 35%` },
  ];