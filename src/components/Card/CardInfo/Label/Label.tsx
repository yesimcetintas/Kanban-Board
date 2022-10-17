import { Select, Tag } from 'antd'
import { Tag as TagIcon } from "react-feather";
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { FC } from 'react'
import { LabelProps } from './Label.type';

const Label: FC<LabelProps> = (props) => {
    const labels = props.labels

    const selectedLabelIds = labels.map((elm)=>elm.id.toString())

    const tagRender = (props: CustomTagProps) => {
        const { label, value, closable, onClose } = props;
        const color = labels.find((elm)=>elm.id === Number(value))?.color
        const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
          event.preventDefault();
          event.stopPropagation();
        };
       
        return (
          <Tag
            color={color}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}
          >
            {label}
          </Tag>
        );
      };

  return (
    <div>
        <div className="cardinfo-box-title">
            <span className='card-info-icon'><TagIcon/></span>
            <p>Labels</p>
        </div>
        <div className="cardinfo-box-labels">
            <Select
            mode="multiple"
            showArrow
            tagRender={tagRender}
            style={{ width: '100%' }}
            options={props.options}
            defaultValue={selectedLabelIds}
            onSelect={props.onSelect}
            onDeselect={props.onDeselect}
            />
        </div>
    </div>
  )
}

export default Label
