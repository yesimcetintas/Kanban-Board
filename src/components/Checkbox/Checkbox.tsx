import React, { useState, FC } from 'react'
import { CheckboxProps } from './Checkbox.types'
import "./Checkbox.css"

const Checkbox: FC<CheckboxProps> = (props) => {
  const [value, setValue] = useState<boolean>(
    props.defaultValue || props.value || false
  )

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const v = e.target.checked
    setValue(v)
    props.onChange?.(e, v)
  }

  return (
    <div className='checkbox' onClick={() => setValue((prev) => !prev)}>
      <input className='checkbox-input' onChange={handleChange} type="checkbox" checked={value} />
      <div>
        <div className="checkbox-container">
          {value ? (
            <span className="material-symbols-outlined check-icon">check</span>
          ) : null}
        </div>
      </div>
      {props.label ? <span className="checkbox-label">{props.label}</span> : null}
    </div>
  )
}

export default Checkbox
