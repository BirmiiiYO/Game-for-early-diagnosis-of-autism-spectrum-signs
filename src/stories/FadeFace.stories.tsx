import { ComponentMeta, ComponentStory } from '@storybook/react'

<<<<<<< HEAD
import { FadeFace } from './../games/FadeFace'
=======
import { FadeFace } from '@/games/FadeFace'
>>>>>>> 3da56d2dcedbd305b9abe84b55e0844230fe96a3

export default {
  title: 'Fade Face',
  component: FadeFace,
} as ComponentMeta<typeof FadeFace>

const FadeFaceStory: ComponentStory<typeof FadeFace> = () => (
  <FadeFace/>
)


export const game = FadeFaceStory.bind({})
game.args = {}
