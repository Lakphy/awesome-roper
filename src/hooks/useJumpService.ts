import { incrementJumps } from '@/store/ropeSlice';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';

export default function useJumpService() {
  const dispatch = useDispatch();
  const wsRef = useRef<any>(null);
  const [wsState, setWsState] = useState(false);
  useEffect(() => {
    if (wsState && !wsRef.current) {
      fetch('/api/ws').finally(() => {
        const socket = io();
        wsRef.current = socket;
        wsRef.current.on('connect', () => {
          // connected
        });
        wsRef.current.on('onJump', (data: any) => {
          console.log('onJump', data);
          dispatch(incrementJumps());
        });
        wsRef.current.on('disconnect', () => {
          wsRef.current = null;
          setWsState(false);
        });
      });
    }
  }, [wsState]);
  function beginWs() {
    setWsState(true);
  }
  function closeWs() {
    wsRef.current?.close();
    wsRef.current = null;
    setWsState(false);
  }
  return {
    beginWs,
    closeWs,
    wsState,
    wsRef
  };
}
