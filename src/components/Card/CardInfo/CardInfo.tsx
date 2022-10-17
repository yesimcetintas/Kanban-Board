import { FC, useEffect, useRef, useState } from 'react'
import { Calendar, List, Type } from "react-feather";
import CustomInput from '../../CustomInput'
import Modal from '../../Modal'
import { CardInfoProps, checklist, checklistItem, label } from './CardInfo.types'
import { DatePicker, DatePickerProps } from 'antd'
import { card } from '../../List/List.types'
import moment from 'moment';
import { labelService } from '../../../services/http/endpoints/label'
import { cardLabelService } from '../../../services/http/endpoints/cardLabel';
import { CardLabelRequestPayload } from '../../../services/http/endpoints/cardLabel/types';
import { useListContext } from '../../../contexts/ListContext/ListContext';
import { CardChecklistRequestPayload } from '../../../services/http/endpoints/checklist/types';
import { cardChecklistService } from '../../../services/http/endpoints/checklist';
import { CardChecklistItemRequestPayload, updateIsCheckedChecklistItemRequestPayload } from '../../../services/http/endpoints/checklistItem/types';
import { cardChecklistItemService } from '../../../services/http/endpoints/checklistItem';
import { CustomInputProps } from '../../CustomInput/CustomInput.types';
import Checklist from './Checklist';
import Label from './Label';
import Comments from "./Comment"

import "./CardInfo.css"

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
  const [checkListItemTitle, setCheckListItemTitle] = useState<string>()

  const { updateCard } = props
  const dateValue = props.card?.duedate !== null && props.card?.duedate !== undefined ? moment(props.card?.duedate) : undefined
  const mounted = useRef(0);
  useEffect(() => {
    if (hasBeenInit()) {
      updateCard(cardValues);
    } else {
      setHasBeenInit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardValues]);

  useEffect(() => {
    labelService.label().then(({ data }) => {
      const options: ItemProps[] = [];
      data.forEach((item: label) =>{
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
    return mounted.current >= 1;
  }

  const setHasBeenInit = () => {
    mounted.current += 1;
  }

  const handleUpdateTitle = (value: string) => {
    setCardValues({ ...cardValues, title: value });
  } 

  const handleUpdateDescription = (value: string) => {
    setCardValues({ ...cardValues, description: value });
  } 

  const onChangeDate: DatePickerProps['onChange'] = (dateString) => {
    setCardValues({ ...cardValues, duedate: dateString?.format('YYYY-MM-DD') });
  };
  const handleLabelSelect = (value: string) => {
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

  const handleLabelDeselect = (value: string) => {
   const cardLabelId = cardValues.labels.find(p=>p.id === Number(value))?.CardLabel.id
    cardLabelService.deleteCardLabel(cardLabelId!).then(()=>{
      listCtx.dispatches.deleteLabel( Number(value), cardValues.id, cardValues.listId)
    })
  };

  const handleAddChecklist = (value: string) => {
    const cardChecklistRequest: CardChecklistRequestPayload = {
      cardId: cardValues.id!,
      title: value
    }
    
    cardChecklistService.createCardChecklist(cardChecklistRequest).then(({ data }) => {
      listCtx.dispatches.addChecklist(data, cardValues.listId)
    })
  }

  const handleAddChecklistItem = (checkListId: number) => {
    const cardChecklistItemRequest: CardChecklistItemRequestPayload = {
      checklistId: checkListId,
      title: checkListItemTitle!,
      isChecked: false
    }
    
    cardChecklistItemService.createCardChecklistItem(cardChecklistItemRequest).then(({ data }) => {
      listCtx.dispatches.addChecklistItem(data, cardValues.listId, cardValues.id)
    })
  }

  const handleCheckListItemTitleChange: CustomInputProps['onChange'] = (e, v) => {
    setCheckListItemTitle(v)
  }

  const handleUpdateTask = (id: number, value: boolean, checklistId: number) => {
    const itemArr = cardValues.checklists.find((elm: checklist)=> elm.id === checklistId);
    
    const itemId= itemArr!.items.find((item: checklistItem) => item.id === id )!.id
    
    if (itemId < 0) return;

    const updateIsCheckedChecklistItemRequest: updateIsCheckedChecklistItemRequestPayload = {
      isChecked: value,
      id: itemId
  }
    cardChecklistItemService.updateIsCheckedChecklistItem(updateIsCheckedChecklistItemRequest).then(({data})=>
      listCtx.dispatches.updateTask(data, cardValues.listId, cardValues.id)
    )
    
  };

  return (
    <div>
      <Modal onClose={props.onClose}>
        <div className='cardinfo'>
          <div className="cardinfo-box">
            <div className="cardinfo-box-title">
              <span className='card-info-icon'><Type /></span>
              <p>Title</p>
            </div>
            <CustomInput
              text={cardValues.title!}
              name="title"
              dontCleanTextAfterSubmit={true}
              value={cardValues.title!}
              placeholder='Enter Card Title'
              displayClass="board-add-card"
              editClass="board-add-card-edit"
              onSubmit={handleUpdateTitle}/>
          </div>

          <div className="cardinfo-box">
            <div className="cardinfo-box-title">
              <span className='card-info-icon'><List /></span>
              <p>Description</p>
              </div>
              <CustomInput
                text={cardValues.description === null || cardValues.description === undefined ? "Add a description" : props.card?.description}
                name="description"
                dontCleanTextAfterSubmit={true}
                value={cardValues.description!}
                placeholder='Enter Description Title'
                displayClass="board-add-card"
                editClass="board-add-card-edit"
                onSubmit={handleUpdateDescription}/>
          </div>

          <div className="cardinfo-box">
            <div className="cardinfo-box-title">
              <span className="card-info-icon"><Calendar /></span>
              <p>Date</p>
            </div>
              <DatePicker 
                className='date-container'
                value={dateValue}
                onChange={onChangeDate}/>
          </div>

          <div className="cardinfo-box">
            <Label
              labels={cardValues.labels}
              options={options}
              onSelect={handleLabelSelect}
              onDeselect={handleLabelDeselect}
            />
          </div>
          <div className="cardinfo-box">
            <div className="cardinfo-box-task-list">
              {
                cardValues.checklists.map((elm:checklist, index)=>
                  <Checklist
                    key={index}
                    checklist={elm}
                    updateTask = {handleUpdateTask}
                    value={checkListItemTitle}
                    onChange={handleCheckListItemTitleChange}
                    onSubmit={() => handleAddChecklistItem(elm.id)}/>
                )
              }
            </div>
            <CustomInput
              text={"Add a checklist"}
              name="checklists"
              placeholder='Enter Checklist Title'
              displayClass="board-add-card"
              editClass="board-add-card-edit"
              onSubmit={handleAddChecklist}/>
          </div>
          <Comments
            comments={cardValues.comments}
            cardId={cardValues.id}
            listId= {cardValues.listId}/>
        </div>
      </Modal>
      
    </div>
  )
}

export default CardInfo
