import  { FC } from 'react'
import { Trash } from 'react-feather'
import { ChecklistItemProps } from './ChecklistItem.type'

const ChecklistItem: FC<ChecklistItemProps> = (props) => {
  return (
    <div className="cardinfo-box-task-checkbox">
      <input
        type="checkbox"
        defaultChecked={props.item.isChecked}
        onChange={(event) =>
        props.updateTask(props.item.id, event.target.checked, props.item.checklistId)
        }
        />
        <p className={props.item.isChecked ? "completed" : ""}>{props.item.title}</p>
        <Trash onClick={()=> props.removeTaskItem(props.item.checklistId, props.item.id)}/>
    </div>
  )
}

export default ChecklistItem
