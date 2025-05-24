import type { State, Action } from './types';
import { ActionType } from "./types";

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.SET_ACCOUNT:
      return { ...state, account: action.payload };

    case ActionType.STORE_FIRST:
      console.log('[Reducer] STORE_FIRST payload:', action.payload);
      const newState = { ...state, first: action.payload };
      console.log('[Reducer] new state:', newState);
      console.log('[Reducer] new state after mutation:', newState);
      return newState;

    case ActionType.STORE_IMPORT:
      return { ...state, importRecord: action.payload };

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

export default reducer;
