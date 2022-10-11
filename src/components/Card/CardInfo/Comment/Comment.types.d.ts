import { card } from "../../../List/List.types"
import { comment } from "../CardInfo.types"

export type CommentProps = {
    comments: comment []
    cardId: number | undefined
    listId: number | undefined
}