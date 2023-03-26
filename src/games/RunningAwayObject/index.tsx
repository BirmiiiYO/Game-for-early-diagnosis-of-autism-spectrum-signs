/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import batterfly from 'assets/gifs/batterfly.gif'

import { GameContainer } from './../../styles'

import { Batterfly } from './styles'

export const RunningAwayObject = () => {
  return (
    <GameContainer>
      <Batterfly src={batterfly} alt='batterfly' />
    </GameContainer>
  )
}
