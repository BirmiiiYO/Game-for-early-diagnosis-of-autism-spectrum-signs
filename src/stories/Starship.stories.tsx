import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Starship } from './../games/Starship'

export default {
  title: 'Starship',
  component: Starship,
} as ComponentMeta<typeof Starship>

const StarshipStory: ComponentStory<typeof Starship> = () => (
  <Starship />
)

export const game = StarshipStory.bind({})
game.args = {}
