/* eslint-disable @typescript-eslint/no-unsafe-assignment */
<<<<<<< HEAD
import { GameContainer } from "./../../styles"
=======
import { GameContainer } from "@/styles"
>>>>>>> 3da56d2dcedbd305b9abe84b55e0844230fe96a3

import video from '../../assets/videos/VideoSequence.mp4'
import { VideoSeq } from "./styles"

export const VideoSequence = () => {

  return (
    <GameContainer>
      <VideoSeq src={video} autoPlay />
    </GameContainer>
  )
}
