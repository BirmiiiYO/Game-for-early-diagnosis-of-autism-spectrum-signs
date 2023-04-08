/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import butterfly from '../../assets/gifs/butterfly.gif'

import { GameContainer } from './../../styles'

import { Butterfly } from './styles'

export const RunningAwayObject = () => {
  return (
    <GameContainer>
      <Butterfly src={butterfly} alt="butterfly" />
    </GameContainer>
  )
}
