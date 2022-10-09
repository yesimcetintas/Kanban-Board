export type CardRequestPayload = {
    title:string,
    listId: number|undefined
}


export type CardResponseType = {
    data : {
        id : number,
        title: string,
        listId: number
    }
}

export type CardRequestUpdatePayload = {
    id: number | undefined
    title: string | undefined
    listId: number | undefined
    description: string | undefined
    duedate: string | null | undefined
}