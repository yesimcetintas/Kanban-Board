import React, { useState, useEffect } from 'react'
import { Button } from 'antd';
import AddBoard from '../../components/AddBoard'
import BoardList from '../../components/BoardList';
import { board } from './Dashboard.types';
import { boardService } from '../../services/http/endpoints/board'
import { AddBoardProps } from '../../components/AddBoard/AddBoard.types'
import { BoardRequestPayload } from '../../services/http/endpoints/board/types';
import { useLoginContext } from '../../contexts/LoginContext/LoginContext'

import "./Dashboard.css"

const Dashboard = () => {
  const { logout, username } = useLoginContext()
  const [boards, setBoards] = useState<board[]>([]);
  
  useEffect(() => {
    boardService.list().then(({ data }) => {
      setBoards(data)
    })
  }, [])

  const addBoardHandler : AddBoardProps['addBoard'] = (values) => {
    const boardRequest: BoardRequestPayload = {
      title: values
    }
    boardService.createBoard(boardRequest).then(({data})=>{
        const tempBoardsList = [...boards];
        tempBoardsList.push({
          id: data.id,
          title: data.title,
        });
        setBoards(tempBoardsList);
       })
  }

  const handleLogout = () => {
    logout()
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
          />
         <div style={{ display: 'flex', width: '200px' }}>
            <AddBoard
              addBoard={addBoardHandler} />
          </div>
        </div>
     </div>
    </div>
  )
}

export default Dashboard
