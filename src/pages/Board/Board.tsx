import  { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AddList from '../../components/AddList'
import { AddListProps } from '../../components/AddList/AddList.types'
import { CardRequestUpdatePayload } from '../../services/http/endpoints/card/types'
import List from '../../components/List'
import { listService } from '../../services/http/endpoints/list'
import { ListRequestPayload, updateListRequestPayload } from '../../services/http/endpoints/list/types'
import { useListContext } from '../../contexts/ListContext/ListContext'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { boardMember } from './Board.types'
import { Settings } from 'react-feather'
import Modal from '../../components/Modal'
import { Button, Select, Tag } from 'antd'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { userListService } from '../../services/http/endpoints/userList'
import { BoardMemberRequestPayload } from '../../services/http/endpoints/boardMember/types'
import { boardMemberService } from '../../services/http/endpoints/boardMember'
import { useLoginContext } from '../../contexts/LoginContext/LoginContext'
import reorder from '../../Helper/Util'
import { cardService } from '../../services/http/endpoints/card'

import "./Board.css"

const Board = () => {

  interface UserProps {
    username: string;
    value: string;
    id: number
  }
  
    const listCtx = useListContext()
    const loginContext = useLoginContext()
    const [showModal, setShowModal] = useState(false);
    const [options, setOptions] = useState<UserProps[]>()
    const [boardMembers, setBoardMembers] = useState<boardMember[]>()

    const navigate = useNavigate()
    
    let {id} = useParams()

    console.log("listcontex", listCtx.state.lists)
  
    useEffect(() => {
      listService.list(Number(id)).then(({ data }) => {
        data.sort((a: any, b: any) => a.order - b.order);

        listCtx.dispatches.setList(data)
      })

      userListService.userList().then(({data}) => {
        const options: UserProps[] = [];
        
        data = data.filter((p:any)=>p.username !== loginContext.username)

        data.forEach((item:any)=>{
          options.push({
            id: item.id,
            value: item.username,
            username: item.username ,
          });
  
          setOptions(options)
       })
      })

      boardMemberService.list(Number(id)).then(({ data }) => {
        setBoardMembers(data)
      })
 // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAddList: AddListProps["addList"] = (values) => {
      const maxOrder = listCtx.state.lists.length === 0 ? 0: Math.max.apply(Math, listCtx.state.lists.map(v => v.order));
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

    const onDragEnd = (result: DropResult) => {
      // dropped nowhere
      if (!result.destination) {
        return;
      }
      const source = result.source;
      const destination = result.destination;

      const sourceDroppableId = source.droppableId.replace('list-', '').replace('card-', '')
      const destinationDroppableId = destination.droppableId.replace('list-', '').replace('card-', '')
      // did not move anywhere - can bail early
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }
      // reordering column
      if (result.type === "COLUMN") {
        
        const ordered = reorder(listCtx.state.lists, result.source.index, result.destination.index)
        
        ordered.forEach((item: any, index)=> {
          const newOrder = index + 1

          if(newOrder !== item.order) {
             const updateOrderPayload: updateListRequestPayload = {
              order: newOrder,
              listId: item.id
            }

            listService.updateList(updateOrderPayload).then(()=> {
              listCtx.dispatches.updateDragDropList(item.id, newOrder)
            })
          }
        })
        
        return;
      }
      const current =  listCtx.state.lists.find(p=>p.id === Number(sourceDroppableId!))!.cards

      // moving to same list
      if (source.droppableId === destination.droppableId) {
        const reordered = reorder(current, source.index, destination.index);
        reorderCards(reordered)
        return;
      }

      const currentCard = current![source.index]
      const newListId =  Number(destinationDroppableId!)
      const cardUpdatePayload: CardRequestUpdatePayload = {
        id: currentCard.id!,
        listId: newListId
      }

      cardService.updateCard(cardUpdatePayload).then(()=>{
        listCtx.dispatches.removeCard(currentCard.id!,  Number(sourceDroppableId!))
        currentCard.listId = newListId
        listCtx.dispatches.setCard(currentCard, destination.index)
        
        reorderCards(listCtx.state.lists.find(p=>p.id === newListId)!.cards)
      })
    }

     const  reorderCards = async (cards: any) => {
      cards.forEach((item: any, index:number)=> {
          const newOrder = index + 1

          if(newOrder !== item.order) {
             const updateOrderPayload: CardRequestUpdatePayload = {
              id: item.id,
              order: newOrder
            }

            cardService.updateCard(updateOrderPayload).then(()=> {
              listCtx.dispatches.updateCardOrder(item.id, item.listId, newOrder)
            })
          }
        })
    }

    const handleAddBoardMember = () => {
      setShowModal(true)
    } 

    const onCloseBoardMembers = () => {
      setShowModal(false)
    }

    const tagRender = (props: CustomTagProps) => {
      const { label, closable, onClose } = props;
      const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
      };
      return (
        <Tag
          onMouseDown={onPreventMouseDown}
          closable={closable}
          onClose={onClose}
          style={{ marginRight: 3 }}
        >
          {label}
        </Tag>
      );
    };

    const handleSelectBoardMember = (value: string) =>{
      const boardMemberRequest: BoardMemberRequestPayload = {
        username: value,
        boardId: Number(id)
      }

      boardMemberService.createBoardMember(boardMemberRequest).then(({data})=> {
        const member: boardMember = {
          id: data.id,
          user: {
            id: data.userId,
            username: value
          }
        }

        setBoardMembers([...boardMembers!, member])
      })

    }

    const handleDeselectBoardMember = (value: string) =>{
      const boardMemberId = boardMembers?.find((elm)=>elm.user.username === value)?.id
      boardMemberService.removeBoardMember(boardMemberId!).then(()=>{
        const newBoardMembers = boardMembers?.filter((elm)=>elm.user.username !== value)
        setBoardMembers(newBoardMembers)
      })
    }
    const handleLogout = () => {
      loginContext.logout()
      navigate("/")
    }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app">
        <div className="app-nav">
          <h1 className='app-title'>Kanban Board</h1>
          <div className='logout-board-member-div'>
            <span className='add-board-member' >
              <Settings onClick={handleAddBoardMember} />
            </span>
            <Button className='logout-btn-board' onClick={handleLogout}>Logout</Button>
          </div>
          
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
                  ownerId= {loginContext.id}/>
                {provided.placeholder}
              </div>
            )}
            
          </Droppable>
            <div className="app-boards-last">
              <AddList
                addList={handleAddList}/>
            </div>
          </div>
        </div>

        {showModal && (
        <Modal 
          onClose={onCloseBoardMembers} 
          >
          <div className='add-member-modal-div'>
          <Select
            className='add-member-modal-select'
            mode="multiple"
            showArrow
            tagRender={tagRender}
            defaultValue={boardMembers?.map(p=>p.user.username)}
            options={options}
            onSelect={handleSelectBoardMember}
            onDeselect= {handleDeselectBoardMember}
          />
          </div>

        </Modal>
      
    )}  
      </div>
    </DragDropContext>
  )
}


export default Board
