import { checklist } from "../CardInfo.types"

export type ChecklistProps = {
    checklist: checklist
    updateTask: (id: number, value: boolean, checklistId: number) => void
    value: string | undefined
    onChange: CustomInputProps['onChange']
    onSubmit: (id: number)=> void
}