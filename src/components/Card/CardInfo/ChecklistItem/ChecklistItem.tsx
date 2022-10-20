import { message, Popconfirm } from 'antd'
import  { FC } from 'react'
import { Trash } from 'react-feather'
import { ChecklistItemProps } from './ChecklistItem.type'

const ChecklistItem: FC<ChecklistItemProps> = (props) => {
  const checklistItemDeleteConfirm = (e: React.MouseEvent<HTMLElement> | undefined) => {
    props.removeTaskItem(props.item.checklistId, props.item.id)
    message.success('Deleted.');
  };
  
  const checklistItemDeleteCancel = (e: React.MouseEvent<HTMLElement> | undefined) => {
    message.error('Delete operation is cancelled.');
  };
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
        <Popconfirm
          title="Are you sure want to delete?"
          onConfirm={checklistItemDeleteConfirm}
          onCancel={checklistItemDeleteCancel}
          okText="Yes"
          cancelText="No">
          <Trash />
        </Popconfirm>
        
    </div>
  )
}

export default ChecklistItem
