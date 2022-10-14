export type CustomInputProps = {
    defaultValue?: string
    value?: string
    text?: string
    name?: string
    placeholder?: string
    buttonText?: string
    editClass?: string
    displayClass?: string| undefined
    isCustomInput?: boolean | undefined
    onSubmit: (e:any) =>void
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, v: string) => void
}