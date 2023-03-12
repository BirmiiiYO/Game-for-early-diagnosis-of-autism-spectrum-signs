import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { GeometricFigMove } from 'games/GeometricFigMove'

export default {
  title: 'GeometricFigMove',
  component: GeometricFigMove,
} as ComponentMeta<typeof GeometricFigMove>

const GeometricFigMoveStory: ComponentStory<typeof GeometricFigMove> = () => (
  <GeometricFigMove/>
)


export const game = GeometricFigMoveStory.bind({})
game.args = {}
