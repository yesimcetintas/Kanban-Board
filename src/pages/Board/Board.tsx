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
import { boardMember } from './Board.types'
import { Settings } from 'react-feather'
import Modal from '../../components/Modal'
import { Select, Tag } from 'antd'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { userListService } from '../../services/http/endpoints/userList'
import { BoardMemberRequestPayload } from '../../services/http/endpoints/boardMember/types'
import { boardMemberService } from '../../services/http/endpoints/boardMember'
import { useLoginContext } from '../../contexts/LoginContext/LoginContext'

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
    
    let {id} = useParams()
  
    useEffect(() => {
      listService.list(Number(id)).then(({ data }) => {
        data.sort((a: any, b: any) => a.order - b.order);

        listCtx.dispatches.setList(data)
      })

      userListService.userList().then(({data}) => {
        const options: UserProps[] = [];
        
        data = data.filter((p:any)=>p.username !== loginContext.username)

        data.map((item:any)=>{
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

    }, [])


    const addListHandler: AddListProps["addList"] = (values) => {
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

    const handleAddBoardMember = () => {
      setShowModal(true)
    } 

    const onClose = () => {
      setShowModal(false)
    }

    const tagRender = (props: CustomTagProps) => {
      const { label, value, closable, onClose } = props;
      const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
      };
      return (
        <Tag
          // color={value}
          onMouseDown={onPreventMouseDown}
          closable={closable}
          onClose={onClose}
          style={{ marginRight: 3 }}
        >
          {label}
        </Tag>
      );
    };

    const handleSelect = (value: string) =>{
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

    const handleDeselect = (value: string) =>{
      const boardMemberId = boardMembers?.find((elm)=>elm.user.username === value)?.id
      boardMemberService.removeBoardMember(boardMemberId!).then(()=>{
        const newBoardMembers = boardMembers?.filter((elm)=>elm.user.username !== value)
        setBoardMembers(newBoardMembers)
      })
    }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app">
        <div className="app-nav">
          <h1 className='app-title'>Kanban Board</h1>
          <span className='add-board-member' >
            <Settings onClick={handleAddBoardMember} />
          </span>
          
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

        {showModal && (
        <Modal 
          onClose={onClose} 
          >
          <div className='add-member-modal-div'>
          <Select
            className='add-member-modal-select'
            mode="multiple"
            showArrow
            tagRender={tagRender}
            defaultValue={boardMembers?.map(p=>p.user.username)}
            options={options}
            onSelect={handleSelect}
            onDeselect= {handleDeselect}
          />
          </div>

        </Modal>
      
    )}  
      </div>
    </DragDropContext>
  )
}


export default Board
