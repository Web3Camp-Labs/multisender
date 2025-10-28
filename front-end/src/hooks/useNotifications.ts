import { useCallback, useMemo } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ActionType } from '../context/types';

/**
 * Custom hook for managing user notifications/tips
 * Provides memoized tips state and setter function
 */
export const useNotifications = () => {
  const { state, dispatch } = useWeb3();
  const { tips } = state;

  const setTips = useCallback(
    (message: string | null) => {
      dispatch({ type: ActionType.TIPS, payload: message });
    },
    [dispatch]
  );

  const clearTips = useCallback(() => {
    dispatch({ type: ActionType.TIPS, payload: null });
  }, [dispatch]);

  return useMemo(
    () => ({
      tips,
      setTips,
      clearTips,
    }),
    [tips, setTips, clearTips]
  );
};
