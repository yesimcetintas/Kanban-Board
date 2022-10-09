import { label } from "../Card/CardInfo/CardInfo.types"

export type ListProps= {
}

export type addCardHandlerProps ={
    addCardHandler: (title: string, listId: number) => void
}

export type card={
    id: number | undefined
    title: string | undefined
    listId: number | undefined
    description: string | undefined
    duedate: string | null | undefined
    order: number | undefined
    labels: label[]
}