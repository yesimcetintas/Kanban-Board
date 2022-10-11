import service from '../../instance'
import { CardCommentRequestPayload, CardCommentResponseType } from './types'

export const createCardComment = (payload: CardCommentRequestPayload) : Promise<CardCommentResponseType> =>
  service.post('comment', payload)

  export const deleteComment = (id:number) =>
  service.delete(`comment/${id}`)
