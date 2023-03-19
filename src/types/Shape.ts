export type TFigure = 'circle' | 'square' | 'triangle'

export interface IFigureStyle {
    active: boolean;
    animationFigure: TFigure
}

export interface IShapes {
    id: number;
    image: string;
    figure: TFigure
  
  }