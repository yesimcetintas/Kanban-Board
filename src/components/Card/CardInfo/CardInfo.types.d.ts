import { card } from "../../List/List.types"

export type CardInfoProps= {
    onClose: ()=> void
    card: card
    updateCard: (card: card) => void 
}

export type label = {
    id: number
    title: string
    color: string
    CardLabel: cardLabel
}

export type cardLabel = {
    id: number
    cardId: number
    labelId: number
}

export type checklist = {
    id: number
    title: string
    cardId: number
    items: checklistItem[]
}

export type checklistItem = {
    id: number
    checklistId: number
    isChecked: boolean
    title: string
}

