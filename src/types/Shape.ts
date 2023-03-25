export type TFigure = 'circle' | 'square' | 'triangle'

export interface IFigureStyle {
    active: boolean
    speed: number
    animationFigure: TFigure
}

export interface IShapes {
    id: number;
    image: string;
    figure: TFigure
  }