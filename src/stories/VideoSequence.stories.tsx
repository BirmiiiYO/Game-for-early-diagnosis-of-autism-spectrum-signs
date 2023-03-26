import { ComponentMeta, ComponentStory } from '@storybook/react'

import { VideoSequence } from './../games/VideoSequence'

export default {
  title: 'Video Sequence',
  component: VideoSequence,
} as ComponentMeta<typeof VideoSequence>

const VideoSequenceStory: ComponentStory<typeof VideoSequence> = () => (
  <VideoSequence/>
)


export const game = VideoSequenceStory.bind({})
game.args = {}
