import  { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AddList from '../../components/AddList'
import { AddListProps } from '../../components/AddList/AddList.types'
import List from '../../components/List'
import { listService } from '../../services/http/endpoints/list'
import { ListRequestPayload } from '../../services/http/endpoints/list/types'

import "./Board.css"
import { useListContext } from '../../contexts/ListContext/ListContext'


const Board = () => {
  // const [lists, setLists] = useState<list[]>([])
  const listCtx = useListContext()
  
  let {id} = useParams()
  
  useEffect(() => {
    listService.list(Number(id)).then(({ data }) => {
      console.log("boardlist", data)
      listCtx.dispatches.setList(data)
    })
  }, [])

  
    const addListHandler: AddListProps["addList"] = (values) => {
      const listRequest: ListRequestPayload = {
        title:values,
        boardId: Number(id)
      }
      listService.createList(listRequest).then(({data})=>{
        listCtx.dispatches.addList(data)
      })
    }

  return (

      <div className="app">
        <div className="app-nav">
          <h1>Kanban Board</h1>
        </div>
        <div className="app-boards-container">
          <div className="app-boards">
            <List/>
            <div className="app-boards-last">
              <AddList
                addList={addListHandler}/>
            </div>
          </div>
        </div>
      </div>

  )
}

export default Board
