import { useMemo } from 'react';
import { useWeb3 } from '../context/Web3Context';

/**
 * Custom hook for wallet-related state
 * Memoizes wallet data to prevent unnecessary re-renders
 */
export const useWallet = () => {
  const { state } = useWeb3();
  const { account, web3Provider } = state;

  return useMemo(
    () => ({
      account,
      web3Provider,
      isConnected: !!account && !!web3Provider,
    }),
    [account, web3Provider]
  );
};
