import { card } from "../../components/List/List.types"
import { board } from "../Dashboard/Dashboard.types"

export type list = {
    id: number | undefined
    title: string | undefined
    board: board | undefined
    boardId: number | undefined
    cards?: card[]
}