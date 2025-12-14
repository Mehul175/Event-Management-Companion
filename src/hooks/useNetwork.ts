/**
 * Purpose: Subscribe to network status and trigger syncs.
 * Author: EventCompanion Team
 * Responsibility: Keep Redux network state updated and sync pending queues.
 */

import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useAppDispatch, useAppSelector } from './useRedux';
import { setIsConnected } from '../redux/networkSlice';
import { syncPendingCheckins } from '../services/syncService';

const useNetwork = () => {
  const dispatch = useAppDispatch();
  const { isConnected } = useAppSelector((state) => state.network);
  const pendingCheckins = useAppSelector((state) => state.attendees.pendingCheckins);

  useEffect(() => {
    const subscription = NetInfo.addEventListener((state) => {
      dispatch(setIsConnected(Boolean(state.isConnected)));
    });
    return () => subscription();
  }, [dispatch]);

  useEffect(() => {
    if (isConnected && pendingCheckins.length > 0) {
      syncPendingCheckins(dispatch, pendingCheckins);
    }
  }, [dispatch, isConnected, pendingCheckins]);

  return { isConnected };
};

export default useNetwork;
