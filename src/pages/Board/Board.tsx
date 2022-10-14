import  { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AddList from '../../components/AddList'
import { AddListProps } from '../../components/AddList/AddList.types'
import List from '../../components/List'
import { listService } from '../../services/http/endpoints/list'
import { ListRequestPayload, updateListRequestPayload } from '../../services/http/endpoints/list/types'
import "./Board.css"
import { useListContext } from '../../contexts/ListContext/ListContext'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { list } from './Board.types'

const Board = () => {
  
    const listCtx = useListContext()
    
    let {id} = useParams()
  
    useEffect(() => {
      listService.list(Number(id)).then(({ data }) => {

        data.sort((a: any, b: any) => a.order - b.order);

        listCtx.dispatches.setList(data)
      })
    }, [])



    const addListHandler: AddListProps["addList"] = (values) => {
      const maxOrder = Math.max.apply(Math, listCtx.state.lists.map(v => v.order));
      const newOrder = maxOrder + 1
      const listRequest: ListRequestPayload = {
        title:values,
        boardId: Number(id),
        order: newOrder
      }
      listService.createList(listRequest).then(({data})=>{
        listCtx.dispatches.addList(data)
      })
    }

    const removeListHandler = (id: number ) => {

      listService.removeList(id)
      listCtx.dispatches.removeList(id)
    }


    const onDragEnd = (result: DropResult) => {
      // dropped nowhere
      if (!result.destination) {
        return;
      }
      const source = result.source;
      const destination = result.destination;
      // did not move anywhere - can bail early
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }
      // reordering column
      if (result.type === "COLUMN") {
        
        //TODO: Gelen destion ve source indexlerini değiştir
        
        const updateSourceOrderPayload: updateListRequestPayload = {
          order: listCtx.state.lists[result.destination.index].order,
          listId: listCtx.state.lists[result.source.index].id!
        }
       
        const updateDestinationOrderPayload: updateListRequestPayload = {
          order: listCtx.state.lists[result.source.index].order,
          listId: listCtx.state.lists[result.destination.index].id!
        }

        listService.updateList(updateSourceOrderPayload)
        listService.updateList(updateDestinationOrderPayload)

        listCtx.dispatches.updateDragDropList(result.source.index, result.destination.index )
        
        return;
      }

    }
    
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app">
        <div className="app-nav">
          <h1>Kanban Board</h1>
        </div>
        <div className="app-boards-container">
          <div className="app-boards">
          <Droppable
            droppableId="board"
            type="COLUMN"
            direction="horizontal"
            ignoreContainerClipping={false}
            isCombineEnabled={false}
          >
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <List
                removeList={removeListHandler}
              />
                {provided.placeholder}
              </div>
            )}
            
          </Droppable>
            <div className="app-boards-last">
              <AddList
                addList={addListHandler}/>
            </div>
          </div>
        </div>
      </div>

    </DragDropContext>
  )
}

export default Board
