export type AddCardProps = {
    addCard: (values: AddCardFormValuesProps) => void
    listId: number| undefined
}

export type AddCardFormValuesProps = {
    title: string
    listId: number | undefined
    order: number
  }
  