/* eslint-disable jsx-a11y/alt-text */
import { FC } from 'react';
import FaceImage from '../../assets/icon/Male-Face.png'
import './face.css'

export const Face: FC = () => {
  return (
    <div className='fade'>
    <img src={FaceImage} alt='face'></img>
    </div>
  )
}