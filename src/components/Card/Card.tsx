import React, { FC, useState } from 'react'
import { useListContext } from '../../contexts/ListContext/ListContext';
import { cardService } from '../../services/http/endpoints/card';
import { CardRequestUpdatePayload } from '../../services/http/endpoints/card/types';
import { card } from '../List/List.types';
import { AlignLeft, CheckSquare, Clock, MoreHorizontal } from "react-feather";
import "./Card.css"
import { CardProps } from './Card.types'
import CardInfo from './CardInfo';
import { formatDate } from '../../Helper/Util';
import { Dropdown, Menu, Space } from 'antd';

const Card: FC<CardProps> = (props) => {
  const listCtx = useListContext()
  const [showModal, setShowModal] = useState(false);

  const updateCard= (card:card) => {

    card.title = card.title ?? undefined
    card.description = card.description ?? undefined
    card.duedate = card.duedate ?? undefined
    card.order = card.order ?? undefined

    cardService.updateCard(card).then(()=>{
       listCtx.dispatches.updateCard(card)
    })
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const removeCard = (id: number) => {
    cardService.removeCard(id).then(()=>{
      listCtx.dispatches.removeCard(id, props.card.listId)
    })
  }

  const menu = (id: number) => (
    <Menu
      items={[
        {
          label: <div onClick={() => removeCard(id)}>Remove Card</div>,
          key: '0',
        }
      ]}
    />
  );

  const calculateCheckItems = () => {
    let totalCheckItemsCount = 0
    let checkedItemsCount = 0
    props.card.checklists.map(checkList=> {
      totalCheckItemsCount += checkList.items.length
      checkedItemsCount += checkList.items.filter(p=>p.isChecked).length
    })
    return `${checkedItemsCount}/${totalCheckItemsCount}`
  }


  return (
    <>
    {showModal && (
      <CardInfo
        onClose={closeModal}
        card={props.card}
        updateCard={updateCard}
      />
    )}
      <div 
        className='card'
        onClick={() => setShowModal(true) }
        ref={props.provided.innerRef}
        {...props.provided.draggableProps}
        {...props.provided.dragHandleProps}
        >
        <div className='card-top'>
            <div className='card-top-labels'>
              {
                props.card.labels.map((item,index) => (
                  <label key={index} style={{ backgroundColor: item.color, color: "#fff" }}>
                    {item.title}
                </label>
                ))}
            </div>
            <div className='card-top-more'  >
              <Dropdown overlay={() => menu(props.card.id!)} trigger={['hover']}>
                <Space>
                  <MoreHorizontal  />
                </Space>
              </Dropdown>
            </div>
        </div>
        <div className='card-title'>{props.card?.title}</div>
        <div>
          <p title={props.card?.description}>
            <AlignLeft />
          </p>
        </div>
        <div className='card-footer'>
          {props.card?.duedate && (
            <p className="card-footer-item">
              <Clock className="card-footer-icon" />
              {formatDate(props.card?.duedate)}
            </p>
          )}
          {props.card.checklists.length >0 && (
            <p className="card-footer-item">
              <CheckSquare className='card-footer-icon'/>
              {calculateCheckItems()}
            </p>
          )
          }
        </div>
      </div>
    {/* </div> */}

    </>
    
  )
}

export default Card
