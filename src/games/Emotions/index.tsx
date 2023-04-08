import { GameContainer } from './../../styles'

import emotions from '../../assets/videos/Emotions.mp4'
import { EmotionsBlock } from './styles'

export const Emotions = () => {
  return (
    <GameContainer>
      <EmotionsBlock src={emotions} autoPlay loop />
    </GameContainer>
  )
}
