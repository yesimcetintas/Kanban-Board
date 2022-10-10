export type LabelProps={
    labels: label[]
    options: ItemProps[] | undefined
    onSelect: (value: string) => void
    onDeselect: (value: string) => void
}