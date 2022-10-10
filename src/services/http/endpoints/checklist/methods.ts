import service from '../../instance'
import { CardChecklistRequestPayload, CardChecklistResponseType } from './types'

export const createCardChecklist = (payload: CardChecklistRequestPayload) : Promise<CardChecklistResponseType> =>
  service.post('checklist', payload)
