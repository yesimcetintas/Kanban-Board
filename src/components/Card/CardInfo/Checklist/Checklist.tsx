import { FC } from 'react'
import { CheckSquare } from 'react-feather'
import CustomInput from '../../../CustomInput'
import { checklistItem } from '../CardInfo.types'
import ChecklistItem from '../ChecklistItem'
import { ChecklistProps } from './Checklist.type'

const Checklist: FC<ChecklistProps> = (props) => {
  const calculatePercent = () => {
    if (!props.checklist.items.length) return 0;
    const completed = props.checklist.items.filter(
      (item) => item.isChecked,
    )?.length;
    return (completed / props.checklist.items.length) * 100;
  };
  const calculatedPercent = calculatePercent();
  
  return (
    < >
      <div className="cardinfo-box-title">
        <span className='card-info-icon'><CheckSquare /></span>
        <p>{props.checklist.title}</p>
        </div>
        <div className="cardinfo-box-progress-bar">
          <div 
            className="cardinfo-box-progress"
            style={{
              width: `${calculatedPercent}%`,
              backgroundColor: calculatedPercent === 100 ? "limegreen" : "",
            }}
            >

          </div>
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
