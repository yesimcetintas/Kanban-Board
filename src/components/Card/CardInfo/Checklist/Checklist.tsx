import React, { FC } from 'react'
import { CheckSquare } from 'react-feather'
import CustomInput from '../../../CustomInput'
import { checklistItem } from '../CardInfo.types'
import ChecklistItem from '../ChecklistItem'
import { ChecklistProps } from './Checklist.type'

const Checklist: FC<ChecklistProps> = (props) => {
  return (
    < >
      <div className="cardinfo-box-title">
        <CheckSquare />
        <p>{props.checklist.title}</p>
        </div>
        <div className="cardinfo-box-progress-bar">
        
        </div>
        {
        props.checklist.items.map((item: checklistItem, index: any)=>
            <ChecklistItem
            key={index}
            item={item}
            updateTask = {props.updateTask}
            />
        )
        }
        <CustomInput
          text={"Add an item"}
          name="checklists-item"
          value={props.value}
          onChange={props.onChange}
          placeholder='Enter Chekclist-Item Title'
          displayClass="board-add-card"
          editClass="board-add-card-edit"
          onSubmit={() => props.onSubmit(props.checklist.id)}/>
    </>
  )
}

export default Checklist
