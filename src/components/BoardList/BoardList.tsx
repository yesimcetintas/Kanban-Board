import React, { FC, useState } from 'react'
import { BoardListProps } from './BoardList.types'
import { Button, Dropdown, Input, Menu, Space } from 'antd';
import { Clipboard, MoreHorizontal } from 'react-feather'
import { board } from '../../pages/Dashboard/Dashboard.types';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal';

import "./BoardList.css"

const BoardList: FC<BoardListProps> = (props) => {

  const [showModal, setShowModal] = useState(false);
  const [titleForm, setTitleForm] = useState({
    id: 0,
    title: ''
  })

  const navigate = useNavigate()

  const handleNavigateClick = (value: number | undefined) => {
    navigate(`/board/${value}`)
  }

  const handleRemoveBoard= (id: number)=>{
    props.onRemove(id)
  }

  const showModalTitle = (id: number) => {
    const currentTitle=props.boards.find((elm)=>elm.id === id)?.title
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
  
    const handleUpdateSubmit = () => {
      props.onRename (titleForm.id, titleForm.title)
      setShowModal(false)
    }
    
    const handleBoardClick = (e: any, id: number) => {
      const targetId = e.target.id
      if(targetId !== 'renameTitle' && targetId !== 'removeBoard') {
        handleNavigateClick(id)
      }
    }

  const menu = (id: number) => (
    <Menu
      items={[
        {
          label: <div id="removeBoard" onClick={() => handleRemoveBoard(id)}>Remove Board</div>,
          key: '0',
        },
        {
          label: <div id="renameTitle" onClick={() => showModalTitle(id)}>Rename Board</div>,
          key: '1',
        }
      ]}
    />
  );

  return (
    <div className='boardList'>
      {
        props.boards.map((elm: board, index ) =>
        <div key={index} className="board-container">
          <Button
            data-id="board-btn"
            key={elm.id} 
            className='board-btn' 
            block={true} 
            onClick={(e: any)=> handleBoardClick(e, elm.id!) }>
              <div className='board-top'>
                <div className='board-top-labels'></div>

                <div className="board-header-title-more">
                  <Dropdown overlay={() => menu(elm.id!)} trigger={['hover']}>
                      <Space>
                        <MoreHorizontal />
                      </Space>
                  </Dropdown>
                </div>
              </div>
              <div>
              <Clipboard  size={15} />
              </div>
              <span className='title'>{elm.title}</span>
          </Button>
          </div>
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
            <Button type="primary" onClick={handleUpdateSubmit} className="update-button">Update</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default BoardList
