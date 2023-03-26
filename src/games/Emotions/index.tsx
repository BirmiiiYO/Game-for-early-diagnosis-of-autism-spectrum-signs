/* eslint-disable @typescript-eslint/no-unsafe-assignment */
<<<<<<< HEAD
import { GameContainer } from "./../../styles"
=======
import { GameContainer } from "@/styles"
>>>>>>> 3da56d2dcedbd305b9abe84b55e0844230fe96a3

import emotions from '../../assets/videos/Emotions.mp4'
import { EmotionsBlock } from "./styles"

export const Emotions = () => {

  return (
    <GameContainer>
      <EmotionsBlock src={emotions} autoPlay />
    </GameContainer>
  )
}
