import { checklistItem } from "../CardInfo.types"

export type ChecklistItemProps= {
   item: checklistItem
   updateTask: (id: number, value: boolean, checklistId: number) => void
}