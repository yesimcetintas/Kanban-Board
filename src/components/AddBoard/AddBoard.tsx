import { FC } from 'react'
import CustomInput from '../CustomInput'
import { AddBoardProps } from './AddBoard.types'

import "./AddBoard.css"

const AddBoard: FC<AddBoardProps> = (props) => {
  const handleSubmit = (values: string) => {
   props.addBoard(values);
  } 
  return (
    <div className='customInput'>
        <CustomInput
            text='+ Add New Board'
            placeholder='Enter Board Title'
            displayClass="board-add-card"
            editClass="board-add-card-edit"
            onSubmit={handleSubmit}
        />
    </div>
  )
}

export default AddBoard
