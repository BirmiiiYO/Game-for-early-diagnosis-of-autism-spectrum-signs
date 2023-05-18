export type TFigure = 'circle' | 'square' | 'triangle'

export interface IFigureStyle {
  active: boolean
  speed: number
  figure: string
  animationFigure: TFigure
}

export interface IShapes {
  id: number
  figure: TFigure
}
