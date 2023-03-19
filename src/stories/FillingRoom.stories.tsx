import { ComponentMeta, ComponentStory } from '@storybook/react'
import { FillingRoom } from 'games/FillingRoom'

export default {
  title: 'Filling room',
  component: FillingRoom,
} as ComponentMeta<typeof FillingRoom>

const GeometricFigMoveStory: ComponentStory<typeof FillingRoom> = () => (
  <FillingRoom/>
)


export const game = GeometricFigMoveStory.bind({})
game.args = {}
