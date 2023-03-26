// eslint-disable-next-line simple-import-sort/imports
import { MovingEyes } from './../games/MovingEyes'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Moving Eyes',
  component: MovingEyes,
} as ComponentMeta<typeof MovingEyes>

const MovingEyesStory: ComponentStory<typeof MovingEyes> = () => (
  <MovingEyes/>
)


export const game = MovingEyesStory.bind({})
game.args = {}
