export type TFigure = 'circle' | 'square' | 'triangle'

export interface IFigure {
    active: boolean;
    animationFigure: TFigure
}