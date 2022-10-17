export type StateType = {
    isLoggedIn:boolean,
    token:string,
    username:string,
    id: number
}
export type ContextType = {
    login : any,
    logout : any,
    state: StateType
}