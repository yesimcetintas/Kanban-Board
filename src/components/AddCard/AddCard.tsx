import React, { FC, useState } from 'react'
import CustomInput from '../CustomInput'
import { CustomInputProps } from '../CustomInput/CustomInput.types';
import { AddCardFormValuesProps, AddCardProps } from './AddCard.types';

const AddCard: FC<AddCardProps> = (props) => {
    const [formValues, setFormValues] = useState<AddCardFormValuesProps>({
        title: '',
        listId: props.listId,
        order: 0
        })

    const handleChange: CustomInputProps['onChange'] = (e, v) => {
        const name = e.target.name
        setFormValues((prev) => ({ ...prev, [name]: v }))
        }

    const handleSubmit = () => {
        props.addCard(formValues);
        } 
  return (
    <div>
        <CustomInput
            text='+ Add New Card'
            name='title'
            onChange={handleChange}
            value={formValues.title}
            placeholder='Enter Card Title'
            displayClass="board-add-card"
            editClass="board-add-card-edit"
            onSubmit={handleSubmit}/>
    </div>
  )
}

export default AddCard
