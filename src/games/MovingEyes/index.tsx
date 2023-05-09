import movingEyes from '../../assets/gifs/movingEyes.gif'

import { GameContainer } from './../../styles'

// https://www.youtube.com/watch?v=tbx9SwuSmTA&ab_channel=WDL%D0%9E%D0%9F%D0%A2%D0%98%D0%9A%D0%90-%D0%BE%D1%87%D0%BA%D0%B8%2C%D0%BB%D0%B8%D0%BD%D0%B7%D1%8B%2C%D0%BE%D1%84%D1%82%D0%B0%D0%BB%D1%8C%D0%BC%D0%BE%D0%BB%D0%BE%D0%B3 взять движения вырезать

import { GifBlock, MovingEyesImage } from './styles'

export const MovingEyes = () => {
  return (
    <GameContainer>
      <GifBlock>
        <MovingEyesImage src={movingEyes} alt="faceEyes" />
      </GifBlock>
    </GameContainer>
  )
}
