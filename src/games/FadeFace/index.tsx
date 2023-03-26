/* eslint-disable @typescript-eslint/no-unsafe-assignment */
<<<<<<< HEAD
import { GameContainer } from "./../../styles"
=======
import { GameContainer } from "@/styles"
>>>>>>> 3da56d2dcedbd305b9abe84b55e0844230fe96a3

import faceImage from '../../assets/icon/Male-Face.png'
import { Image } from "./styles"

export const FadeFace = () => {

  return (
    <GameContainer>
      <Image src={faceImage} alt='face' />
    </GameContainer>
  )
}
