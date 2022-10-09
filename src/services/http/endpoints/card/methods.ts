import service from '../../instance'
import { CardRequestPayload, CardRequestUpdatePayload, CardResponseType } from './types'

export const createCard = (payload: CardRequestPayload) : Promise<CardResponseType> =>
  service.post('card', payload)

export const card = (listId: number) => service.get(`card?listId=${listId}`)

export const updateCard = (payload: CardRequestUpdatePayload) : Promise<CardResponseType> =>
  service.put(`card/${payload.id}`, payload)