import service from '../../instance'
import { CardChecklistItemRequestPayload, CardChecklistItemResponseType, updateIsCheckedChecklistItemRequestPayload, updateIsCheckedChecklistItemResponseType } from './types'

export const createCardChecklistItem = (payload: CardChecklistItemRequestPayload) : Promise<CardChecklistItemResponseType> =>
  service.post('checklist-item', payload)

export const updateIsCheckedChecklistItem = (payload: updateIsCheckedChecklistItemRequestPayload) : Promise<updateIsCheckedChecklistItemResponseType> =>
  service.put(`checklist-item/${payload.id}`, payload)