import service from '../../instance'
import { BoardMemberRequestPayload, BoardMemberResponseType } from './types'

export const createBoardMember = (payload: BoardMemberRequestPayload) : Promise<BoardMemberResponseType> =>
service.post('board-member', payload)

export const list = (boardId: number)  => service.get(`board-member?boardId=${boardId}`)

export const removeBoardMember = (id: number) => service.delete(`board-member/${id}`)