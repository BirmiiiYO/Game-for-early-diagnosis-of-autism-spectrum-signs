// eslint-disable-next-line simple-import-sort/imports
<<<<<<< HEAD
import { MovingEyes } from './../games/MovingEyes'
=======
import { MovingEyes } from '@/games/MovingEyes'
>>>>>>> 3da56d2dcedbd305b9abe84b55e0844230fe96a3
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
