import { useCallback, useMemo } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ActionType } from '../context/types';

/**
 * Custom hook for transaction data management
 * Provides memoized transaction data and setter functions
 */
export const useTransactionData = () => {
  const { state, dispatch } = useWeb3();
  const { first, importRecord } = state;

  const setFirstData = useCallback(
    (data: { amounts: string; tokenAddress: string; decimals: number }) => {
      dispatch({ type: ActionType.STORE_FIRST, payload: data });
    },
    [dispatch]
  );

  const setImportRecord = useCallback(
    (data: Array<{ address: string; amount: string }>) => {
      dispatch({ type: ActionType.STORE_IMPORT, payload: data });
    },
    [dispatch]
  );

  return useMemo(
    () => ({
      first,
      importRecord,
      setFirstData,
      setImportRecord,
    }),
    [first, importRecord, setFirstData, setImportRecord]
  );
};
