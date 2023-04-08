export interface ICrumblingBallsProps {
  speed: number
  mainBallColor?: string
  smallBallColor?: string
  mainBallSize?: number
  smallBallSize?: number
}

export interface ISmallBallStyle {
  speed: number
  color: string
  x: number
  y: number
  size: number
}

export type IMainBallStyle = Pick<ISmallBallStyle, 'speed' | 'size'> & {
  mainColor: string
}
