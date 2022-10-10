export type CardChecklistRequestPayload = {
    title:string,
    cardId: number
}


export type CardChecklistResponseType = {
    data : {
        id : number,
        title: string,
        cardId: number
    }
}