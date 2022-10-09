export type CardLabelRequestPayload = {
    cardId: number,
    labelId: number
}


export type CardLabelResponseType = {
    data : {
        id : number,
        cardId: number,
        labelId: number
    }
}