import { FC } from 'react'
import { Styled } from './RegisterCard.styled'
import { RegisterCardProps } from './RegisterCard.types'

const Card: FC<RegisterCardProps> = (props) => {
  return (
    <Styled>
      <h1>{props.title}</h1>

      {props.children}
      
    </Styled>
  )
}

export default Card
