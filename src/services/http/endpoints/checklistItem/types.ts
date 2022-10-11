
export type CardChecklistItemRequestPayload = {
    title:string,
    checklistId: number
    isChecked: boolean
}


export type CardChecklistItemResponseType = {
    data : {
        id : number,
        title: string,
        checklistId: number
        isChecked: boolean
    }
}

export type updateIsCheckedChecklistItemRequestPayload = {
    isChecked: boolean
    id: number
}

export type updateIsCheckedChecklistItemResponseType = {
    data : {
        id : number,
        title: string,
        checklistId: number
        isChecked: boolean
    }
}
