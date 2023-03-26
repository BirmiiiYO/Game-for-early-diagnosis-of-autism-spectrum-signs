import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from "react-to-webcomponent";
import { FillingRoom,CrumblingBalls,FadeFace,GeometricFigFade,GeometricFigMove,RunningAwayObject,StaticFace } from './games';

customElements.define("filling-room", reactToWebComponent(FillingRoom, React as any,  ReactDOM as any));

customElements.define("crumbling-balls", reactToWebComponent(CrumblingBalls, React as any,  ReactDOM as any));

customElements.define("fade-face", reactToWebComponent(FadeFace, React as any,  ReactDOM as any));

customElements.define("geometric-fig-fade", reactToWebComponent(GeometricFigFade, React as any,  ReactDOM as any));

customElements.define("geometric-fig-move", reactToWebComponent(GeometricFigMove, React as any,  ReactDOM as any));

customElements.define("running-away-object", reactToWebComponent(RunningAwayObject, React as any,  ReactDOM as any));

customElements.define("static-face", reactToWebComponent(StaticFace, React as any,  ReactDOM as any));

