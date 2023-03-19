import { ComponentMeta, ComponentStory } from '@storybook/react'
import { StaticFace } from 'games/StaticFace'

export default {
  title: 'Static face',
  component: StaticFace,
} as ComponentMeta<typeof StaticFace>

const StaticFaceStory: ComponentStory<typeof StaticFace> = () => (
  <StaticFace/>
)


export const game = StaticFaceStory.bind({})
game.args = {}
