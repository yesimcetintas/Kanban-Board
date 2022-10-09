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

