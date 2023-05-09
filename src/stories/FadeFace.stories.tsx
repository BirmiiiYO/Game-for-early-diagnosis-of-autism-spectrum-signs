import { ComponentMeta, ComponentStory } from '@storybook/react'

import { FadeFace } from './../games/FadeFace'

export default {
  title: 'Fade Face',
  component: FadeFace,
} as ComponentMeta<typeof FadeFace>

const FadeFaceStory: ComponentStory<typeof FadeFace> = () => <FadeFace speed={10} />

export const game = FadeFaceStory.bind({})
game.args = {}
