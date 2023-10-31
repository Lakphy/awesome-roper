// 引入库
const fft = require('fft-js').fft;
const fftUtil = require('fft-js').util;

// 判断数组中是否存在周期性正弦波
function hasSinusoidalWave(arr) {
  // 对数组进行傅里叶变换
  const phasors = fft(arr);

  // 获取频谱
  const frequencies = fftUtil.fftFreq(phasors, 1);

  // 找到最大振幅的频率
  const maxFrequency =
    frequencies[
      phasors.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0)
    ];

  // 判断是否存在周期性正弦波
  const threshold = 0.15; // 阈值可以根据需要进行调整
  const isSinusoidal =
    maxFrequency > 0 && maxFrequency < 0.5 && phasors[maxFrequency] > threshold;

  return isSinusoidal;
}

// 示例用法
const array = [1, 1, 1, 1, 0, 1, 0, -1, 0, 1, 0, -1, 0, 1, 1, 1]; // 包含干扰数据的数组

console.log(hasSinusoidalWave(array)); // 输出 true 或 false
