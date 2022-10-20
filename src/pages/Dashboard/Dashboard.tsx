import { useState, useEffect } from 'react'
import { Button, notification } from 'antd';
import AddBoard from '../../components/AddBoard'
import BoardList from '../../components/BoardList';
import { board } from './Dashboard.types';
import { boardService } from '../../services/http/endpoints/board'
import { AddBoardProps } from '../../components/AddBoard/AddBoard.types'
import { BoardRequestPayload } from '../../services/http/endpoints/board/types';
import { useLoginContext } from '../../contexts/LoginContext/LoginContext'

import "./Dashboard.css"

const Dashboard = () => {
  const { logout, id } = useLoginContext()
  const [boards, setBoards] = useState<board[]>([]);

  useEffect(() => {
    boardService.list().then(({ data }) => {
      setBoards(data)
    })
  }, [])

  const handleAddBoard : AddBoardProps['addBoard'] = (values) => {
    const boardRequest: BoardRequestPayload = {
      title: values
    }
    boardService.createBoard(boardRequest).then(({data})=>{
        
        const tempBoardsList = [...boards];
        tempBoardsList.push({
          id: data.id,
          title: data.title,
          ownerId: data.ownerId
        });
        setBoards(tempBoardsList);
       })
  }

  const handleLogout = () => {
    logout()
    
  }

  type NotificationType = 'success' | 'info' | 'warning' | 'error';

  const openNotificationWithIcon = (type: NotificationType, messageText: string, descriptionText: string) => {
    notification[type]({
      message: messageText,
      description: descriptionText,
    });
  };

  const handleUpdateTitle = (boardId: number, title: string) => {
    const ownerId = boards.find((elm)=>elm.id === boardId)?.ownerId
    if(ownerId !== Number(id)){
      openNotificationWithIcon('warning', "Warning", "You are not authorized to update title of the board.")
      return
    }
    boardService.updateBoard({title: title, boardId: boardId }).then(()=>{
    const tempBoards = [...boards]
    const updateBoardIndex=tempBoards.findIndex((elm)=>elm.id === boardId)
    tempBoards[updateBoardIndex].title=title
    setBoards (tempBoards)
    })
  }

  const handleRemoveBoard = (boardId: number) => {
    const ownerId = boards.find((elm)=>elm.id === boardId)?.ownerId
    if(ownerId !== Number(id)){
      openNotificationWithIcon('warning', "Warning", "You are not authorized to delete this board.")
      return
    }
    boardService.removeBoard(boardId).then(()=>{
      const tempBoards = [...boards]
      const newBoardList = tempBoards.filter((elm)=>elm.id !== boardId)
      setBoards(newBoardList)
    })
  }

  return (
    <div className='dashboard'>
      <div className="app-nav-dashboard">
          <h1 style={{ color: '#504f4f' }}>Kanban Board</h1>
        <Button className='logout-btn' onClick={handleLogout}>Logout</Button>
      </div>
      <div>
       
      </div>
      <div className="dashboard-container">
        <div className="dashboard-inner-container">
          <BoardList
            boards={boards}
            onRename={handleUpdateTitle}
            onRemove={handleRemoveBoard}
          />
         <div style={{ display: 'flex', width: '200px' }}>
            <AddBoard
              addBoard={handleAddBoard} />
          </div>
        </div>
     </div>
     
    </div>
  )
}

export default Dashboard
