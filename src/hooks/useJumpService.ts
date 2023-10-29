import { RopeFlow, incrementJumps } from '@/store/ropeSlice';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axios from 'axios';

export default function useJumpService() {
  const dispatch = useDispatch();
  const wsRef = useRef<any>(null);
  const [wsState, setWsState] = useState(false);
  const currentJump = useSelector((state: any) => state.rope.jumps);
  const ropeState = useSelector((state: any) => state.rope.ropeState);
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
  useEffect(() => {
    if (wsRef.current && ropeState === RopeFlow.PENDING) {
      axios.post('/api/asyncJumps', {
        jumps: currentJump,
        isJump: true
      });
    }
  }, [currentJump]);
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
