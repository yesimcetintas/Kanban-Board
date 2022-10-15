

export type BoardListProps = {
    boards: board[]
    onClick?: MouseEventHandler<HTMLElement> | undefined 
    onRename: (id: number, title: string) => void
    onRemove: (id: number) => void
}