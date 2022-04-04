import {Dispatch} from "react";

interface firstObj{
    amounts:string
    tokenAddress:string
    decimals:string
}

export type State = {
    account: string | null
    first:firstObj | null
    web3Provider: any
}

export type Action = {
    type: ActionType
    payload: any
}


export interface ContextType {
    state: State
    dispatch: Dispatch<Action>
}

export const enum ActionType {
    SET_ACCOUNT = 'SET_ACCOUNT',
    STORE_FIRST = 'STORE_FIRST',
    CONNECT = 'CONNECT'
}