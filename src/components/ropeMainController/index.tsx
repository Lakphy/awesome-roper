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

export default function RopeMainController() {
  const dispatch = useDispatch();
  const ropeState = useSelector(selectRopeState);
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
        break;
      case RopeFlow.PENDING:
        dispatch(setRopeState(RopeFlow.FINISHED));
        dispatch(calculateTotalTime(Date.now()));
        dispatch(resetBeginTime());
        break;
      case RopeFlow.FINISHED:
        dispatch(setRopeState(RopeFlow.NONE));
        break;
    }
  }, [ropeState]);

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
