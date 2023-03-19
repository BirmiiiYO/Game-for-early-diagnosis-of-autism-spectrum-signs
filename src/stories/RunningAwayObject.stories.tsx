import { ComponentMeta, ComponentStory } from '@storybook/react'
import { RunningAwayObject } from 'games/RunningAwayObject'

export default {
  title: 'Running away object',
  component: RunningAwayObject,
} as ComponentMeta<typeof RunningAwayObject>

const GeometricFigMoveStory: ComponentStory<typeof RunningAwayObject> = () => (
  <RunningAwayObject/>
)


export const game = GeometricFigMoveStory.bind({})
game.args = {}
