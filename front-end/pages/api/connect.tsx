import {createContext, Dispatch, ReactElement, useContext, useReducer} from 'react';
import {ethers} from "ethers";
import reducer from './reducer';
import INIT_STATE from './initState';
import {Action, ActionType, ContextType, State} from "./types";

const initState = {...INIT_STATE};

const Web3Context = createContext<ContextType>({} as any);

interface Props{
    children: any
}

const connect = async (state:State, dispatch:Dispatch<Action>) => {
    if (typeof window !== "undefined") {
        const {web3Provider} = state;

        if (web3Provider != null) return;
        const web3Instance = new ethers.providers.Web3Provider((window as any).ethereum)

        if (web3Instance) {
            dispatch({type: ActionType.CONNECT, payload: web3Instance});

        }
    }
};

const ContextProvider = (props:Props) => {
    const [state, dispatch] = useReducer(reducer, initState);
    console.log("=====state=====",state);
    const { web3Provider } = state;

    if(web3Provider == null ) {
        connect(state, dispatch);
    }

    return <Web3Context.Provider value={{state,dispatch}}>
        {props.children}
    </Web3Context.Provider>;
};

const useWeb3 = () => ({...useContext(Web3Context)});
export {ContextProvider, useWeb3};
