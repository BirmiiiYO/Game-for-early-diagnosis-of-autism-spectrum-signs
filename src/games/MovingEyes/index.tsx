/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import movingEyes from '../../assets/gifs/movingEyes.gif'

import { GameContainer } from './../../styles'

import { GifBlock, MovingEyesImage } from './styles'

export const MovingEyes = () => {
  return (
    <GameContainer>
      <GifBlock>
   <MovingEyesImage src={movingEyes} alt='faceEyes' />
    </GifBlock>
    </GameContainer>
  )
}
