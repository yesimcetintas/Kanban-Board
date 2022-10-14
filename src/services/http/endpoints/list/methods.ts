import service from '../../instance'
import { ListRequestPayload, ListResponseType, updateListRequestPayload } from './types'

export const createList = (payload: ListRequestPayload) : Promise<ListResponseType> =>
  service.post('list', payload)

export const list = (boardId: number)  => service.get(`list?boardId=${boardId}`)

export const updateList = (payload: updateListRequestPayload) =>
  service.put(`list/${payload.listId}`, payload)

export const removeList = (listId: number) => service.delete(`list/${listId}`)
