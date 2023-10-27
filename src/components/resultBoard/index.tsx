import React, { ReactChildren, useEffect, useState } from 'react';
import TimeGenerator from '../TimeGenerator';
import { useSelector } from 'react-redux';

function SignboardItem(props: { children: any }) {
  return (
    <div className="w-[100%] mb-6 flex justify-start align-bottom content-end">
      {props.children}
    </div>
  );
}

function ResultBoard() {
  const [mountAnimationState, setMountAnimationState] = useState(false);
  const jumps = useSelector((state: any) => state.rope.jumps);
  const totalTime = useSelector((state: any) => state.rope.totalTime);
  useEffect(() => {
    setMountAnimationState(true);
    return () => {
      setMountAnimationState(false);
    };
  });
  return (
    <>
      <div
        key={'PendingSignboard'}
        className=" overflow-hidden w-[80vw] h-[66vh] bg-white absolute top-[100px] rounded-3xl p-4 pt-[220px] shadow-md backdrop-blur-sm transition-all ease-in-out duration-500 flex justify-between align-bottom flex-wrap content-start"
        style={
          !mountAnimationState
            ? { transform: 'translateY(0)', filter: 'blur(0rem)', opacity: 1 }
            : {
                transform: 'translateY(-100px)',
                filter: 'blur(2rem)',
                opacity: 0
              }
        }
      >
        <img
          className="w-[80vw] h-[200px] absolute left-0 top-0"
          src="https://lh3.googleusercontent.com/4NcsDaP036q063sCZ-9pJlal0_WXpzNyqqkVj4XDh9yoloNsGcRv-s_gTeGaUi6XXwQ6nuEgoyuAbLfkiKaoYKaHdBlOfVkUjl6s1bSJl64unotQTdc=w960"
        ></img>
      </div>
      <div
        key={'ResultBoard'}
        className=" overflow-hidden w-[80vw] h-[66vh] bg-white absolute top-[100px] rounded-3xl p-4 pt-[220px] shadow-md backdrop-blur-sm transition-all ease-in-out duration-500 delay-200 flex justify-between align-bottom flex-wrap content-start"
        style={
          mountAnimationState
            ? { transform: 'translateY(0)', filter: 'blur(0rem)', opacity: 1 }
            : {
                transform: 'translateY(100px)',
                filter: 'blur(2rem)',
                opacity: 0
              }
        }
      >
        <img
          className="w-[80vw] h-[200px] absolute left-0 top-0"
          src="https://lh3.googleusercontent.com/zQXC4ZwVUA3GFP6oWjRrrBmQXGUF4ivC5Te-AqK9NPihA5oLEkLbVyQiW3Wi3gIbOl4xjqWP1GpTG6GSdi1FYRFFwJyJO3_JLMaFSOiLyJaHk5knWJfq=w960"
        ></img>
        <SignboardItem>
          <p className="text-2xl">🎉恭喜你完成了一次跳绳</p>
        </SignboardItem>
        <SignboardItem>
          <p className=" text-base">运动时间 2023年10月10日 11:23</p>
        </SignboardItem>
        <SignboardItem>
          <p className=" text-base mt-4">总次数</p>
          <p className="text-4xl ml-3 text-[#6750A4]">{jumps}</p>
          <p className=" text-base mt-4 ml-3">次</p>
        </SignboardItem>
        <SignboardItem>
          <p className=" text-base mt-4">运动时长</p>
          <p className="text-4xl ml-3 text-[#6750A4]">
            {(totalTime / 1000).toFixed(0)}
          </p>
          <p className=" text-base mt-4 ml-3">秒</p>
        </SignboardItem>
        <SignboardItem>
          <p className=" text-base mt-4">运动卡路里</p>
          <p className="text-4xl ml-3 text-[#6750A4]">{jumps}</p>
          <p className=" text-base mt-4 ml-3">kcal</p>
        </SignboardItem>
      </div>
    </>
  );
}

export default ResultBoard;
