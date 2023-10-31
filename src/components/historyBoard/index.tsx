import axios from 'axios';
import { useEffect, useState } from 'react';

export default function HistoryBoard() {
  const [showHistoryBoard, setShowHistoryBoard] = useState(false);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    if (showHistoryBoard) {
      axios.get('/api/history').then((res) => {
        setHistory(res.data);
      });
    }
  }, [showHistoryBoard]);
  return (
    <>
      <div
        onClick={() => {
          setShowHistoryBoard((prev) => !prev);
        }}
        className="w-[200px] h-[50px] absolute bottom-[50px] rounded-full border-[1px] border-[#6750A4] bg-[#EADDFF] leading-[50px] text-center text-[22px] text-[#6750A4]"
      >
        {showHistoryBoard ? '关闭历史记录' : '查看历史记录'}
      </div>
      <div
        className=" overflow-y-auto z-10 overflow-hidden w-[80vw] h-[66vh] bg-white absolute top-[100px] rounded-3xl p-4 shadow-md backdrop-blur-sm transition-all ease-in-out duration-500 flex justify-between align-bottom flex-wrap content-start"
        style={
          showHistoryBoard
            ? { transform: 'translateY(0)', filter: 'blur(0rem)', opacity: 1 }
            : {
                transform: 'translateY(-450px)',
                filter: 'blur(2rem)',
                opacity: 0
              }
        }
      >
        <div className=" w-full text-center mb-2 text-[22px] text-[#6750A4]">
          历史记录
        </div>
        {history.map((item: any, index) => {
          return (
            <div className=" w-full mt-2">
              <p>运动时间：{item.date}</p>
              <p>
                跳绳 {item.count} 次，用时 {item.duration} 秒
              </p>
              {index === history.length - 1 ? (
                <></>
              ) : (
                <div className="w-full h-[1px] bg-[#6750A4] my-2"></div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
