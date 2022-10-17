import  { FC, useState } from 'react'
import CustomInput from '../CustomInput'
import { CustomInputProps } from '../CustomInput/CustomInput.types';
import { AddListProps } from './AddList.types';

const List: FC<AddListProps> = (props) => {
    const [newListValue, setNewListValue]  = useState<string>('')
    const handleSubmit = () => {
        props.addList(newListValue);
        setNewListValue('')
    }
    
    const handleChange: CustomInputProps['onChange'] = (e, v) => {
      setNewListValue(v)
    }

  return (
    <div>
      <CustomInput
        text='+ Add New List'
        name="list"
        value={newListValue}
        placeholder='Enter List Title'
        displayClass="board-add-card"
        editClass="board-add-card-edit"
        onChange={handleChange}
        onSubmit={handleSubmit}/>
    </div>
  )
}

export default List
