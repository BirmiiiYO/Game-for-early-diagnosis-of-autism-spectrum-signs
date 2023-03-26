/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GameContainer } from "./../../styles"

import faceImage from '../../assets/icon/Male-Face.png'
import { Image } from "./styles"

export const FadeFace = () => {

  return (
    <GameContainer>
      <Image src={faceImage} alt='face' />
    </GameContainer>
  )
}
