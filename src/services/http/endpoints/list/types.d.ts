import { board } from "../../../../pages/Dashboard/Dashboard.types"

export type ListRequestPayload = {
    title:string,
    boardId: number,
    order: number
}


export type ListResponseType = {
    data : {
        id : number,
        title: string,
        boardId: number,
        order: number
    }
}

export type updateListRequestPayload = {
    order?: number,
    listId: number,
    title?: string
}