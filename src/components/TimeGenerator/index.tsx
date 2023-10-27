import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

/** 最小化重选人更新单元 */
function TimeGenerator() {
  const timerRef = useRef<null | ReturnType<typeof setInterval>>(null);
  const [time, setTime] = React.useState(0);
  const beginTime = useSelector((state: any) => state.rope.beginTime);
  useEffect(() => {
    if (beginTime !== 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTime((Date.now() - beginTime) / 1000);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [beginTime]);
  return <>{time.toFixed(0)}</>;
}

export default TimeGenerator;
