import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CrumblingBalls } from 'games/CrumblingBalls'

export default {
  title: 'Crumbling balls',
  component: CrumblingBalls,
} as ComponentMeta<typeof CrumblingBalls>

const GeometricFigMoveStory: ComponentStory<typeof CrumblingBalls> = args => (
  <CrumblingBalls {...args}/>
)


export const game = GeometricFigMoveStory.bind({})
game.args = {}
