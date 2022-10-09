import {card, ListProps} from "./List.types"
import React, { FC, useState } from 'react'
import { list } from "../../pages/Board/Board.types"
import { MoreHorizontal } from "react-feather"
import CustomInput from "../CustomInput"
import Card from "../Card"
import AddCard from "../AddCard"
import "./List.css"
import { AddCardProps } from "../AddCard/AddCard.types"
import { CardRequestPayload } from "../../services/http/endpoints/card/types"
import { cardService } from "../../services/http/endpoints/card"
import { useListContext } from '../../contexts/ListContext/ListContext'


const List: FC<ListProps> =(props) => {
  const listCtx = useListContext()
  
  const addCardHandler: AddCardProps["addCard"] = (values) => {
    cardService.createCard(values).then(({data})=>{
    listCtx.dispatches.addCard(data)
    })
  }

  return (
    <div className="list-body">
      {
        listCtx.state.lists.map((elm:list)=>
        <div className="list" key={elm.id}>
          <div className="list-inner" >
            <div className="list-header">
              <p className="list-header-title">
                {elm.title}
                <span>{elm.cards?.length}</span>
              </p>
              <div
                className="list-header-title-more">
                  <MoreHorizontal/>
              </div>
            </div>
            <div>
              <div className="list-cards custom-scroll">
                { 
                  elm.cards?.map((item)=>
                    <Card
                      key={item.id}
                      card={item}/>
                  )
                }
                <AddCard
                  addCard={addCardHandler} 
                  listId={elm.id}/>
              </div>
            </div>
          </div>
        </div>
        )
      }
    </div>
      
  )
}

export default List
