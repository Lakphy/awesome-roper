function kalmanFilter(inputArray: number[]) {
  var processNoise = 0.01; // 过程噪声
  var measurementNoise = 0.1; // 测量噪声
  var state = 0; // 初始状态
  var errorCovariance = 1; // 初始协方差

  var outputArray = [];

  for (var i = 0; i < inputArray.length; i++) {
    // 预测
    var predictedState = state;
    var predictedErrorCovariance = errorCovariance + processNoise;

    // 更新
    var kalmanGain =
      predictedErrorCovariance / (predictedErrorCovariance + measurementNoise);
    state = predictedState + kalmanGain * (inputArray[i] - predictedState);
    errorCovariance = (1 - kalmanGain) * predictedErrorCovariance;

    outputArray.push(state);
  }

  return outputArray;
}
