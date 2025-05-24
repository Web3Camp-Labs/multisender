import * as React from 'react';
import { createContext, ReactNode, useContext, useReducer, useEffect } from 'react';
import { ethers } from "ethers";
import reducer from './reducer';
import INIT_STATE from './initState';
import { ContextType, State, Action, ActionType } from "./types";

const Web3Context = createContext<ContextType>({} as ContextType);

interface Props {
  children: ReactNode;
}

const connect = async (state: State, dispatch: React.Dispatch<Action>) => {
  if (typeof window !== "undefined") {
    const { web3Provider } = state;

    if (web3Provider != null) return;
    
    // Check if ethereum is available
    if (!(window as any).ethereum) {
      dispatch({ type: ActionType.TIPS, payload: "MetaMask or compatible wallet not found. Please install MetaMask or another wallet extension." });
      return;
    }
    
    try {
      dispatch({ type: ActionType.TIPS, payload: "Connecting to wallet..." });
      const web3Instance = new ethers.providers.Web3Provider((window as any).ethereum);
      
      if (web3Instance) {
        // Get accounts
        const accounts = await web3Instance.listAccounts();
        if (accounts.length > 0) {
          dispatch({ type: ActionType.SET_ACCOUNT, payload: accounts[0] });
        }
        dispatch({ type: ActionType.CONNECT, payload: web3Instance });
        dispatch({ type: ActionType.TIPS, payload: null }); // Clear tips on success
      } else {
        dispatch({ type: ActionType.TIPS, payload: "Failed to create Web3 provider instance." });
      }
    } catch (error: any) {
      dispatch({ type: ActionType.TIPS, payload: `Error connecting to wallet: ${error?.message || error}` });
      console.error("Error connecting to wallet:", error);
    }
  }
};

export const Web3Provider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  const { web3Provider } = state;

  useEffect(() => {
    if (web3Provider == null) {
      connect(state, dispatch);
    }
    
    // Setup event listeners for account changes
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          dispatch({ type: ActionType.SET_ACCOUNT, payload: null });
          dispatch({ type: ActionType.TIPS, payload: "Wallet disconnected. Please connect your wallet." });
        } else {
          dispatch({ type: ActionType.SET_ACCOUNT, payload: accounts[0] });
          dispatch({ type: ActionType.TIPS, payload: null });
        }
      };

      const handleChainChanged = () => {
        // Reload the page when the chain changes
        window.location.reload();
      };

      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', handleChainChanged);

      // Cleanup event listeners
      return () => {
        if ((window as any).ethereum.removeListener) {
          (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
          (window as any).ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [web3Provider, state]);

  console.log('[Web3Provider] state.first:', state.first);
  return (
    <Web3Context.Provider value={{ state, dispatch }}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to access Web3 context
export const useWeb3 = () => useContext(Web3Context);
