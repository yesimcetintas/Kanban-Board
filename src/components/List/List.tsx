import {ListProps} from "./List.types"
import React, { FC, useState } from 'react'
import { list } from "../../pages/Board/Board.types"
import { MoreHorizontal } from "react-feather"
import Card from "../Card"
import AddCard from "../AddCard"
import "./List.css"
import { AddCardProps } from "../AddCard/AddCard.types"
import { cardService } from "../../services/http/endpoints/card"
import { useListContext } from '../../contexts/ListContext/ListContext'
import { Draggable, Droppable } from "react-beautiful-dnd"
import { Button, Dropdown, Input, Menu, Space } from "antd"
import { listService } from "../../services/http/endpoints/list"
import Modal from "../Modal"


const List: FC<ListProps> =(props) => {
  const listCtx = useListContext()
  const [showModal, setShowModal] = useState(false);
  const [titleForm, setTitleForm] = useState({
    id: 0,
    title: ''
  })

  const addCardHandler: AddCardProps["addCard"] = (values) => {
    const cards = listCtx.state.lists.find(p=>p.id === values.listId)!.cards

    const maxOrder = cards?.length === 0 ? 0: 
    Math.max.apply(Math, cards!.map(v => v.order!));
    const newOrder = maxOrder + 1
    values.order = newOrder

    cardService.createCard(values).then(({data})=>{
    listCtx.dispatches.addCard(data)
    })
  }

  const removeList = (id: number) => {
    listService.removeList(id).then(()=>{
      listCtx.dispatches.removeList(id)
    })
  }

  const showModalTitle = (id: number) => {
    const currentTitle=listCtx.state.lists.find((elm)=>elm.id === id)?.title
    setTitleForm({
      id: id,
      title: currentTitle!
    })
    setShowModal(true)
  }

  const onClose = () => {
    setShowModal(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTitleForm((prev) => ({ ...prev, title: value}))
    }

    const handleSubmit = () => {
      listService.updateList({title: titleForm.title, listId: titleForm.id }).then(()=>{
        listCtx.dispatches.updateList(titleForm.title, titleForm.id)
        setShowModal(false)
      })
      
    } 

  const menu = (id: number) => (
    <Menu
      items={[
        {
          label: <div onClick={() => removeList(id)}>Remove List</div>,
          key: '0',
        },
        {
          label: <div onClick={() => showModalTitle(id)}>Rename List</div>,
          key: '1',
        }
      ]}
    />
  );
  // const [showDropdown, setShowDropdown] = useState(false);
  return (

    <div 
      className="list-body"
      >
      {
        listCtx.state.lists.sort((a: any, b: any) => a.order - b.order)
        .map((elm:list, index: number)=>
        <Draggable draggableId={`list-${elm.id!}`} key={elm.id} index={index}>
          {(provided, snapshot) => (
          <div className="list"  ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <div className="list-inner" key={elm.id} >
              <div className="list-header" >
                <p className="list-header-title">
                  {elm.title}
                  <span>{elm.cards?.length}</span>
                </p>
                <div
                  className="list-header-title-more"
                >
                  <Dropdown overlay={() => menu(elm.id!)} trigger={['hover']}>
                      <Space>
                        <MoreHorizontal />
                      </Space>
                  </Dropdown>
                </div>
              </div>
              {/* Droppable */}
              <Droppable
                  droppableId={`list-${elm.id!}`}
                  type="CARD"
                  ignoreContainerClipping={false}
                  isDropDisabled={false}
                  isCombineEnabled={false}
                >
                  
                {(dropProvided, dropSnapshot) => (
                <div>
                  <div className="list-cards custom-scroll"  {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
                    { 
                      elm.cards?.sort((a: any, b: any) => a.order - b.order)
                      .map((item, index)=>
                      // Draggable
                      <Draggable
                        key={item.id}
                        draggableId={`card-${item.id!}`}
                        index={index}
                        // shouldRespectForceTouch={false}
                      >
                        {(dragProvided, dragSnapshot) => (
                        <Card
                          card={item}
                          key={item.id}
                          provided={dragProvided}/>
                        )}
                      </Draggable>
                        
                      )
                    }
                    {dropProvided.placeholder}
                    <AddCard
                      addCard={addCardHandler} 
                      listId={elm.id}/>
                  </div>
                </div>
                )}
              </Droppable>
            </div>
          </div>
         
          )}
        </Draggable>
       
        )
      }
      {showModal && (
        <Modal 
          onClose={onClose} 
          >
          <div>
            <Input 
              placeholder="Enter Title" 
              onChange={handleChange}
              value={titleForm.title}
              className="update-input"
              />
            <Button type="primary" onClick={handleSubmit} className="update-button">Update</Button>
          </div>

        </Modal>
      
    )}

    </div>
      
  )
}

export default List
