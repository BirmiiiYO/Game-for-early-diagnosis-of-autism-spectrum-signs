import { ComponentMeta, ComponentStory } from '@storybook/react'
import { GeometricFigFade } from 'games/GeometricFigFade'

export default {
  title: 'Geometric figures fade',
  component: GeometricFigFade,
} as ComponentMeta<typeof GeometricFigFade>

const GeometricFigMoveStory: ComponentStory<typeof GeometricFigFade> = () => (
  <GeometricFigFade/>
)


export const game = GeometricFigMoveStory.bind({})
game.args = {}
