import { Dispatch } from "react";
import { BrowserProvider } from "ethers";

interface FirstObj {
  amounts: string;
  tokenAddress: string;
  decimals: number;
}

interface AddressObj {
  address: string;
  amount: string;
}

export type State = {
  account: string | null;
  tips: string | null;
  importRecord: AddressObj[] | null;
  first: FirstObj | null;
  web3Provider: BrowserProvider | null;
  txHash: string | null;
  txHashList: string[];
}

export type Action = {
  type: ActionType;
  payload: any;
}

export interface ContextType {
  state: State;
  dispatch: Dispatch<Action>;
}

export enum ActionType {
  SET_ACCOUNT = 'SET_ACCOUNT',
  STORE_FIRST = 'STORE_FIRST',
  CONNECT = 'CONNECT',
  STORE_TXHASH = 'STORE_TXHASH',
  STORE_TXHASHLIST = 'STORE_TXHASHLIST',
  TIPS = 'TIPS',
  STORE_IMPORT = 'STORE_IMPORT'
}
