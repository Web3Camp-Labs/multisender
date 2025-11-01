import React, { createContext, ReactNode, useContext, useReducer, useEffect, useMemo } from 'react';
import { BrowserProvider } from "ethers";
import reducer from './reducer';
import INIT_STATE from './initState';
import { ContextType, State, Action, ActionType } from "./types";

const Web3Context = createContext<ContextType>({} as ContextType);

interface Props {
  children: ReactNode;
}

// Initialize provider without prompting wallet connection
const initProvider = async (dispatch: React.Dispatch<Action>) => {
  if (typeof window === "undefined") return;

  // Check if ethereum is available
  if (!(window as any).ethereum) {
    dispatch({ type: ActionType.TIPS, payload: "MetaMask or compatible wallet not found. Please install MetaMask or another wallet extension." });
    return;
  }

  try {
    // Create provider instance without requesting accounts (no popup)
    const web3Instance = new BrowserProvider((window as any).ethereum);
    dispatch({ type: ActionType.CONNECT, payload: web3Instance });
  } catch (error: any) {
    console.error("Error initializing provider:", error);
  }
};

// Connect wallet - this will prompt the user
export const connectWallet = async (state: State, dispatch: React.Dispatch<Action>) => {
  if (typeof window === "undefined") return;

  const { web3Provider } = state;

  if (!web3Provider) {
    dispatch({ type: ActionType.TIPS, payload: "Web3 provider not initialized" });
    return;
  }

  try {
    dispatch({ type: ActionType.TIPS, payload: "Connecting to wallet..." });

    // Request account access - this triggers wallet popup
    const accounts = await (window as any).ethereum.request({
      method: 'eth_requestAccounts'
    });

    if (accounts.length > 0) {
      dispatch({ type: ActionType.SET_ACCOUNT, payload: accounts[0] });
      dispatch({ type: ActionType.TIPS, payload: null });
    }
  } catch (error: any) {
    dispatch({ type: ActionType.TIPS, payload: `Error connecting to wallet: ${error?.message || error}` });
    console.error("Error connecting to wallet:", error);
  }
};

// Disconnect wallet
export const disconnectWallet = (dispatch: React.Dispatch<Action>) => {
  dispatch({ type: ActionType.SET_ACCOUNT, payload: null });
  dispatch({ type: ActionType.TIPS, payload: null });
};

export const Web3Provider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  const { web3Provider } = state;

  useEffect(() => {
    // Only initialize provider on mount, don't auto-connect
    if (web3Provider == null) {
      initProvider(dispatch);
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

  const contextValue = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to access Web3 context
export const useWeb3 = () => useContext(Web3Context);
