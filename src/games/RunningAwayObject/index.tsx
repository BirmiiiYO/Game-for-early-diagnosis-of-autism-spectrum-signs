import butterfly from '../../assets/gifs/butterfly.gif'

import { GameContainer } from './../../styles'

import { Butterfly } from './styles'

export const RunningAwayObject = ({ speed = 5 }: { speed?: number }) => {
  return (
    <GameContainer>
      <Butterfly src={butterfly} alt="butterfly" speed={speed}/>
    </GameContainer>
  )
}
