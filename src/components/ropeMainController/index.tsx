import {
  RopeFlow,
  calculateTotalTime,
  resetBeginTime,
  resetJumps,
  selectRopeState,
  setBeginTime,
  setTotalTime
} from '@/store/ropeSlice';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRopeState } from '@/store/ropeSlice';
import useJumpService from '@/hooks/useJumpService';
import axios from 'axios';

export default function RopeMainController() {
  const dispatch = useDispatch();
  const ropeState = useSelector(selectRopeState);
  const beginTime = useSelector((state: any) => state.rope.beginTime);
  const jumps = useSelector((state: any) => state.rope.jumps);
  const btnStyle = useMemo(() => {
    switch (ropeState) {
      case RopeFlow.NONE:
        return {
          width: '300px',
          height: '300px',
          lineHeight: '300px',
          backgroundColor: '#6750A4',
          color: '#fff',
          transform: 'translateY(100px)',
          borderRadius: '50%',
          overflow: 'hidden',
          textalign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '40px'
        };
      case RopeFlow.PENDING:
        return {
          width: '120px',
          height: '120px',
          lineHeight: '120px',
          backgroundColor: '#6750A4',
          color: '#fff',
          transform: 'translateY(600px)',
          borderRadius: '50%',
          overflow: 'hidden',
          textalign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '30px'
        };
      case RopeFlow.FINISHED:
        return {
          width: '120px',
          height: '120px',
          lineHeight: '120px',
          backgroundColor: '#fff',
          color: '#6750A4',
          border: '1px solid #6750A4',
          transform: 'translateY(600px)',
          borderRadius: '50%',
          overflow: 'hidden',
          textalign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '30px'
        };
    }
  }, [ropeState]);
  const btnText = useMemo(() => {
    switch (ropeState) {
      case RopeFlow.NONE:
        return '开始跳绳';
      case RopeFlow.PENDING:
        return '结束';
      case RopeFlow.FINISHED:
        return '返回';
    }
  }, [ropeState]);
  const handleClick = useCallback(() => {
    switch (ropeState) {
      case RopeFlow.NONE:
        dispatch(setRopeState(RopeFlow.PENDING));
        dispatch(setBeginTime(Date.now()));
        dispatch(resetJumps());
        axios.post('/api/asyncJumps', { jumps: 0, isJump: true });
        break;
      case RopeFlow.PENDING:
        dispatch(setRopeState(RopeFlow.FINISHED));
        dispatch(calculateTotalTime(Date.now()));
        dispatch(resetBeginTime());
        axios.post('/api/asyncJumps', { jumps: 0, isJump: false });
        axios.post('/api/history', {
          // 日期格式：2023年10月31日 12:00
          date: new Date().toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          count: jumps,
          duration: ((Date.now() - beginTime) / 1000).toFixed(0)
        });
        break;
      case RopeFlow.FINISHED:
        dispatch(setRopeState(RopeFlow.NONE));
        break;
    }
  }, [ropeState, beginTime, jumps]);

  const { beginWs, closeWs, wsState, wsRef } = useJumpService();

  useEffect(() => {
    if (ropeState === RopeFlow.PENDING && wsState === false) {
      beginWs();
    } else if (wsState === true) {
      closeWs();
    }
  }, [ropeState]);

  return (
    <div
      className="ease-in-out transition-all duration-500"
      style={btnStyle}
      onClick={handleClick}
    >
      {btnText}
    </div>
  );
}
