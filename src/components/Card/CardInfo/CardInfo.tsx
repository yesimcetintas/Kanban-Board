import React, { FC, useEffect, useRef, useState } from 'react'
import { Select, Tag } from 'antd';
import { Calendar, CheckSquare, List, Tag as TagIcon, Trash, Type } from "react-feather";
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import CustomInput from '../../CustomInput'
import Modal from '../../Modal'
import { CardInfoProps, label } from './CardInfo.types'

import "./CardInfo.css"
import { DatePicker, DatePickerProps } from 'antd'
import { card } from '../../List/List.types'
import moment from 'moment';
import { labelService } from '../../../services/http/endpoints/label'
import { cardService } from '../../../services/http/endpoints/card';
import { cardLabelService } from '../../../services/http/endpoints/cardLabel';
import { CardLabelRequestPayload } from '../../../services/http/endpoints/cardLabel/types';
import { useListContext } from '../../../contexts/ListContext/ListContext';

const CardInfo: FC<CardInfoProps> = (props) => {
  const [cardValues, setCardValues] = useState<card>(
    props.card
  )
  const listCtx = useListContext()

  interface ItemProps {
    label: string;
    value: string;
    color: string;
  }
  
  const [options, setOptions] = useState<ItemProps[]>()

  const { updateCard } = props
  const dateValue = props.card?.duedate !== null ? moment(props.card?.duedate) : undefined
  const mounted = useRef(0);

  useEffect(() => {
    if (hasBeenInit()) {
      updateCard(cardValues);
    } else {
      setHasBeenInit();
    }
  }, [cardValues]);

  useEffect(() => {
    labelService.label().then(({ data }) => {
      const options: ItemProps[] = [];
      data.map((item: label) =>{
        options.push({
          label: item.title,
          value: item.id.toString(),
          color: item.color
        });

        setOptions(options)
     })
    })
  }, [])

  const hasBeenInit = () => {
    return mounted.current >= 2;
  }

  const setHasBeenInit = () => {
    mounted.current += 1;
  }

  const updateTitle = (value: string) => {
    setCardValues({ ...cardValues || undefined, title: value });
  } 

  const updateDescription = (value: string) => {
    setCardValues({ ...cardValues, description: value });
  } 

  const onChangeDate: DatePickerProps['onChange'] = (dateString) => {
    setCardValues({ ...cardValues, duedate: dateString?.format('YYYY-MM-DD') });
  };
  const handleSelect = (value: string) => {
    const cardLabelRequest: CardLabelRequestPayload = {
      cardId: cardValues.id!,
      labelId: Number(value)
    }
    
    cardLabelService.createCardLabel(cardLabelRequest).then(({ data }) => {
      const selectedLabel= options?.find((elm)=>Number(elm.value) === data.labelId)
      
      let label: label= {
        id: Number(selectedLabel?.value),
        title: selectedLabel?.label!,
        color: selectedLabel?.color!,
        CardLabel: {...data}
      }
      listCtx.dispatches.insertLabel(label,cardValues.listId)
    })
    
  };

  const selectedLabelIds = cardValues.labels.map((elm)=>elm.id.toString())

  const handleDeselect = (value: string) => {
   const cardLabelId = cardValues.labels.find(p=>p.id === Number(value))?.CardLabel.id
    cardLabelService.deleteCardLabel(cardLabelId!).then(()=>{
      listCtx.dispatches.deleteLabel()
    })
  };

  const tagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    const color = cardValues.labels.find((elm)=>elm.id == Number(value))?.color
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
      <Modal onClose={props.onClose}>
        <div className='cardinfo'>

          <div className="cardinfo-box">
            <div className="cardinfo-box-title">
              <Type />
              <p>Title</p>
            </div>
            <CustomInput
              text={props.card?.title}
              name="title"
              value={props.card?.title}
              placeholder='Enter Card Title'
              displayClass="board-add-card"
              editClass="board-add-card-edit"
              onSubmit={updateTitle}/>
          </div>

          <div className="cardinfo-box">
            <div className="cardinfo-box-title">
              <List />
              <p>Description</p>
              </div>
              <CustomInput
              text={props.card?.description === null ? "Add a description" : props.card?.description}
              name="description"
              value={props.card?.description}
              placeholder='Enter Description Title'
              displayClass="board-add-card"
              editClass="board-add-card-edit"
              onSubmit={updateDescription}/>
          </div>

          <div className="cardinfo-box">
            <div className="cardinfo-box-title">
              <Calendar />
              <p>Date</p>
            </div>
              <DatePicker 
                className='date-container'
                value={dateValue}
                onChange={onChangeDate}/>
          </div>

          <div className="cardinfo-box">
            <div className="cardinfo-box-title">
              <TagIcon/>
              <p>Labels</p>
            </div>
            <div className="cardinfo-box-labels">
            <Select
              mode="multiple"
              showArrow
              tagRender={tagRender}
              style={{ width: '100%' }}
              options={options}
              defaultValue={selectedLabelIds}
              onSelect={handleSelect}
              onDeselect={handleDeselect}
            />
            </div>
          </div>
        </div>
      </Modal>
      
    </div>
  )
}

export default CardInfo
