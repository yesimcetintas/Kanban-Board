import React, { FC } from 'react'
import { BoardListProps } from './BoardList.types'
import { Button } from 'antd';
import { Clipboard } from 'react-feather'
import { board } from '../../pages/Dashboard/Dashboard.types';
import { useNavigate } from 'react-router-dom';

import "./BoardList.css"

const BoardList: FC<BoardListProps> = (props) => {

  const navigate = useNavigate()

  const handleClick = (value: number | undefined) => {
    
    navigate(`/board/${value}`)
  }

  return (
    <div className='boardList'>
      {
        props.boards.map((elm: board ) =>
         <Button
          key={elm.id} 
          className='board-btn' 
          block={true} 
          icon={<Clipboard size={15} />}
          onClick={()=>handleClick(elm.id)}>
           <span className='title'>{elm.title}</span>
          </Button>
        )
      }
    </div>
  )
}

export default BoardList
