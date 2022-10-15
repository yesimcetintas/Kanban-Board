export type BoardRequestPayload = {
    title:string,
}


export type BoardResponseType = {
    data : {
        id : number,
        title: string,
        ownerId: number
    }
}

export type updateBoardRequestPayload = {
    boardId: number,
    title?: string
}