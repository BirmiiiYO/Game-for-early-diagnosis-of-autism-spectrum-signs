import { useEffect, useState } from 'react'

import { GameContainer } from './../../styles'

import Man from '../../assets/faces/man.png'
import Girl from '../../assets/faces/girl.png'

import { Image } from './styles'

export const FadeFace = ({ speed = 5 }: { speed: number }) => {
  const [photoMan, setPhotoMan] = useState(true)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPhotoMan(prevState => !prevState)
    }, speed * 1000)

    return () => clearInterval(intervalId)
  }, [photoMan, speed])
  return (
    <GameContainer>
      <Image src={photoMan ? Man : Girl} alt="face" speed={speed} />
    </GameContainer>
  )
}
