import React, { FC } from 'react'
import { StyleSheetManager } from 'styled-components';
import CustomInput from '../CustomInput'
import { AddListProps } from './AddList.types';

const List: FC<AddListProps> = (props) => {

    const handleSubmit = (values: string) => {
        props.addList(values);
    } 

  return (
    <div>
      <CustomInput
        text='+ Add New List'
        placeholder='Enter List Title'
        displayClass="board-add-card"
        editClass="board-add-card-edit"
        onSubmit={handleSubmit}/>
    </div>
  )
}

export default List
