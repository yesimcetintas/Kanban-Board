import service from '../../instance'
import { BoardRequestPayload, BoardResponseType, updateBoardRequestPayload } from './types'

export const createBoard = (payload: BoardRequestPayload) : Promise<BoardResponseType> =>
  service.post('board', payload)

export const list = () => service.get('board')

export const updateBoard = (payload: updateBoardRequestPayload) =>
  service.put(`board/${payload.boardId}`, payload)
  

export const removeBoard = (boardId: number) => 
  service.delete(`board/${boardId}`)


