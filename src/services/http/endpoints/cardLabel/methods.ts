import service from '../../instance'
import { CardLabelRequestPayload, CardLabelResponseType } from './types'


export const createCardLabel = (payload: CardLabelRequestPayload) : Promise<CardLabelResponseType> =>
  service.post('card-label', payload)

  export const deleteCardLabel = (id:number) =>
  service.delete(`card-label/${id}`)

