import service from '../../instance'
import { BoardRequestPayload, BoardResponseType } from './types'

export const createBoard = (payload: BoardRequestPayload) : Promise<BoardResponseType> =>
  service.post('board', payload)

export const list = () => service.get('board')