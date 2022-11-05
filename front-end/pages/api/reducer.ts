import type {State,Action} from './types'
import { ActionType } from "./types";

const reducer = (state:State, action:Action) => {
    switch (action.type) {

        case ActionType.SET_ACCOUNT:
            return { ...state, account: action.payload };

        case ActionType.STORE_FIRST:
            return { ...state, first: action.payload };

        case ActionType.TIPS:
            return { ...state, tips: action.payload };

        case ActionType.STORE_TXHASH:
            return { ...state, txHash: action.payload };

        case ActionType.STORE_TXHASHLIST:
            return { ...state, txHashList: action.payload };

        case ActionType.CONNECT:
            return { ...state, web3Provider: action.payload };


        default:
            throw new Error(`Unknown type: ${action.type}`);
    }
};
export default reducer
