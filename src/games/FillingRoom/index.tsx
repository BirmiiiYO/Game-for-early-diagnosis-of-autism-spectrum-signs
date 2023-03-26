import { useEffect,  useState } from 'react'

import { furnitures } from './../../assets/furnitures'
import { GameContainer } from './../../styles'
import { IFigureStyle } from './../../types/Shape'

import { Furniture } from './styles'


export const FillingRoom = ({speed = 1}: IFigureStyle) => {
  const [visible, setVisible] = useState<string[]>([])
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(prevState => {
        if (counter < 5) {
          return [...prevState, furnitures[counter].element]
        } else {
          return prevState
        }
      });
      setCounter(prevCounter => prevCounter + 1)
    }, speed * 1000);
    return () => clearInterval(timer);
  }, [counter, speed, visible]);
  return (
    <GameContainer>
      {furnitures.map(({element,id,image ,position}) => 
      visible.includes(element) && (<Furniture 
        position={position}
        key={id} 
        src={image} 
        alt={`image of ${element}`}
        />))}
    </GameContainer>

  )
}
