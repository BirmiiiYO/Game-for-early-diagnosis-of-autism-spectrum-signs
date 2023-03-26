import { ComponentMeta, ComponentStory } from '@storybook/react'

<<<<<<< HEAD
import { Emotions } from './../games/Emotions'
=======
import { Emotions } from '@/games/Emotions'
>>>>>>> 3da56d2dcedbd305b9abe84b55e0844230fe96a3

export default {
  title: 'Emotions',
  component: Emotions,
} as ComponentMeta<typeof Emotions>

const EmotionsStory: ComponentStory<typeof Emotions> = () => (
  <Emotions/>
)


export const game = EmotionsStory.bind({})
game.args = {}
