import { ComponentMeta, ComponentStory } from '@storybook/react'
import { StaticFace } from 'games/StaticFace'

<<<<<<< HEAD
import { VideoSequence } from './../games/VideoSequence'
=======
import { VideoSequence } from '@/games/VideoSequence'
>>>>>>> 3da56d2dcedbd305b9abe84b55e0844230fe96a3

export default {
  title: 'Video Sequence',
  component: VideoSequence,
} as ComponentMeta<typeof StaticFace>

const VideoSequenceStory: ComponentStory<typeof VideoSequence> = () => (
  <VideoSequence/>
)


export const game = VideoSequenceStory.bind({})
game.args = {}
