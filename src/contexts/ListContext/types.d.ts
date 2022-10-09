import { list } from '../../pages/Board/Board.types'

export type StateType = {
    lists: list[]
  }
  
  export type ContextType = {
    state: StateType
    dispatches :  any
  }