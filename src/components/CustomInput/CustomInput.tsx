import { CustomInputProps } from './CustomInput.types'
import { Button } from 'antd';
import { X } from "react-feather";
import { FC, useState } from 'react'

import "./CustomInput.css"

const CustomInput: FC<CustomInputProps> = (props) => {

  const [isCustomInput, setIsCustomInput] = useState(
    props.isCustomInput || false
  );
  const [inputText, setInputText] = useState(
    props.defaultValue || props.value || '');
  
  const submission = (e: any) => {
    e.preventDefault();
    if (inputText && props.onSubmit) {
      props.onSubmit(inputText);
      setInputText("");
    }
    setIsCustomInput(false);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const v = e.target.value
    setInputText(v)
    props.onChange?.(e, v)
  }

  return (
    <div className='custom-input-body'>
        { isCustomInput ? (
            <form
                className={`custom-input-edit ${props.editClass ? props.editClass : ""}`}
                >
                <input
                    type="text"
                    name={props.name}
                    value={inputText}
                    placeholder={props.placeholder || props.text}
                    onChange={handleChange}
                    autoFocus
                />
                <div className="custom-input-edit-footer">
                    <Button type='primary'  onClick={submission}>{props.buttonText || "Add"}</Button>
                    
                    <X onClick={()=>setIsCustomInput(false)} className="closeIcon"/>
                </div>
          </form>
        ): (
            <p 
            className={`custom-input-display ${props.displayClass ? props.displayClass : ""}`}
                onClick={() => setIsCustomInput(true)}>{props.text}</p>
        )

        }
      
    </div>
  )
}

export default CustomInput
