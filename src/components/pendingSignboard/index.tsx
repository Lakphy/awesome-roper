import React, { ReactChildren, useEffect, useState } from 'react';
import TimeGenerator from '../TimeGenerator';
import { useSelector } from 'react-redux';
import useJumpService from '@/hooks/useJumpService';

function SignboardItem(props: { children: any }) {
  return (
    <div className="w-[100%] mb-6 flex justify-start align-bottom content-end">
      {props.children}
    </div>
  );
}

function PendingSignboard() {
  const [mountAnimationState, setMountAnimationState] = useState(false);
  const jumps = useSelector((state: any) => state.rope.jumps);
  useEffect(() => {
    setMountAnimationState(true);
    return () => {
      setMountAnimationState(false);
    };
  }, []);
  return (
    <div
      key={'PendingSignboard'}
      className=" overflow-hidden w-[80vw] h-[66vh] bg-white absolute top-[100px] rounded-3xl p-4 pt-[220px] shadow-md backdrop-blur-sm transition-all ease-in-out duration-500 flex justify-between align-bottom flex-wrap content-start"
      style={
        mountAnimationState
          ? { transform: 'translateY(0)', filter: 'blur(0rem)', opacity: 1 }
          : { transform: 'translateY(100px)', filter: 'blur(2rem)', opacity: 0 }
      }
    >
      <img
        className="w-[80vw] h-[200px] absolute left-0 top-0"
        src="https://lh3.googleusercontent.com/4NcsDaP036q063sCZ-9pJlal0_WXpzNyqqkVj4XDh9yoloNsGcRv-s_gTeGaUi6XXwQ6nuEgoyuAbLfkiKaoYKaHdBlOfVkUjl6s1bSJl64unotQTdc=w960"
      ></img>
      <SignboardItem>
        <p className="text-4xl">跳绳</p>
        <p className=" text-base mt-4 ml-3">2023年10月10日 11:23</p>
      </SignboardItem>
      <SignboardItem>
        <p className=" text-base mt-4">当前次数</p>
        <p className="text-4xl ml-3 text-[#6750A4]">{jumps}</p>
        <p className=" text-base mt-4 ml-3">次</p>
      </SignboardItem>
      <SignboardItem>
        <p className=" text-base mt-4">运动时长</p>
        <p className="text-4xl ml-3 text-[#6750A4]">
          <TimeGenerator />
        </p>
        <p className=" text-base mt-4 ml-3">秒</p>
      </SignboardItem>
      <SignboardItem>
        <p className=" text-base mt-4">运动卡路里</p>
        <p className="text-4xl ml-3 text-[#6750A4]">{jumps}</p>
        <p className=" text-base mt-4 ml-3">kcal</p>
      </SignboardItem>
      <SignboardItem>
        <p className=" text-base mt-7">数据来源</p>
        <img
          className="h-[52px]"
          src="https://invensense.tdk.com/wp-content/uploads/2023/10/rp_mpu-6050.png"
        ></img>
        <p className=" text-base mt-7 ml-0">MPU6050</p>
      </SignboardItem>
    </div>
  );
}

export default PendingSignboard;
