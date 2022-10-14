import { DraggableProvided } from "react-beautiful-dnd"
import { card } from "../List/List.types"

export type CardProps = {
    card: card
    provided: DraggableProvided
}