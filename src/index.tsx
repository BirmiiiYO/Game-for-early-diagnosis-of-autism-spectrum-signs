import React from 'react'
import ReactDOM from 'react-dom/client'
import reactToWebComponent from 'react-to-webcomponent'
import {
  FillingRoom,
  CrumblingBalls,
  FadeFace,
  GeometricFigFade,
  GeometricFigMove,
  RunningAwayObject,
  Emotions,
  MovingEyes,
  VideoSequence,
} from './games'

customElements.define(
  'filling-room',
  reactToWebComponent(FillingRoom, React, ReactDOM),
)

customElements.define(
  'crumbling-balls',
  reactToWebComponent(CrumblingBalls, React, ReactDOM),
)

customElements.define(
  'fade-face',
  reactToWebComponent(FadeFace, React, ReactDOM),
)

customElements.define(
  'geometric-fig-fade',
  reactToWebComponent(GeometricFigFade, React, ReactDOM),
)

customElements.define(
  'geometric-fig-move',
  reactToWebComponent(GeometricFigMove, React, ReactDOM),
)

customElements.define(
  'running-away-object',
  reactToWebComponent(RunningAwayObject, React, ReactDOM),
)

customElements.define(
  'emotions-rtc',
  reactToWebComponent(Emotions, React, ReactDOM),
)

customElements.define(
  'moving-eyes',
  reactToWebComponent(MovingEyes, React, ReactDOM),
)

customElements.define(
  'video-sequence',
  reactToWebComponent(VideoSequence, React, ReactDOM),
)

