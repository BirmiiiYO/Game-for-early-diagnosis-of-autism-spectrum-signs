import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Emotions } from './../games/Emotions'

export default {
  title: 'Emotions',
  component: Emotions,
} as ComponentMeta<typeof Emotions>

const EmotionsStory: ComponentStory<typeof Emotions> = () => (
  <Emotions/>
)


export const game = EmotionsStory.bind({})
game.args = {}
