import service from '../../instance'
import { ListRequestPayload, ListResponseType } from './types'

export const createList = (payload: ListRequestPayload) : Promise<ListResponseType> =>
  service.post('list', payload)

export const list = (boardId: number) => service.get(`list?boardId=${boardId}`)