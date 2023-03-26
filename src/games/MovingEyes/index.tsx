/* eslint-disable @typescript-eslint/no-unsafe-assignment */
<<<<<<< HEAD
import movingEyes from '../../assets/gifs/movingEyes.gif'

import { GameContainer } from './../../styles'
=======
import movingEyes from 'assets/gifs/movingEyes.gif'

import { GameContainer } from '@/styles'
>>>>>>> 3da56d2dcedbd305b9abe84b55e0844230fe96a3

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
