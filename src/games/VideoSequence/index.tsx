/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GameContainer } from "./../../styles"

import video from '../../assets/videos/VideoSequence.mp4'
import { VideoSeq } from "./styles"

export const VideoSequence = () => {

  return (
    <GameContainer>
      <VideoSeq src={video} autoPlay />
    </GameContainer>
  )
}
