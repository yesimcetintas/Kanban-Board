export type CardCommentRequestPayload = {
    message:string,
    cardId: number | undefined
}


export type CardCommentResponseType = {
    data : {
        id : number,
        message: string,
        cardId: number,
        authorId: number,
        createdAt: string
    }
}