#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#include <Arduino.h>
#include <U8g2lib.h>

#ifdef U8X8_HAVE_HW_SPI
#include <SPI.h>
#endif
#ifdef U8X8_HAVE_HW_I2C
#include <Wire.h>
#endif

#define SERVER_IP "192.168.161.137:3000"
#ifndef STASSID
// #define STASSID "zjby1401"
// #define STAPSK "4000012999"
#define STASSID "Xiaomi 13"
#define STAPSK "1234567890"
// #define STASSID "Qingyou-Studio-111"
// #define STAPSK "qingyou+1s"
#endif

U8G2_SSD1306_128X64_NONAME_F_4W_SW_SPI u8g2(U8G2_R0, /* clock=*/14, /* data=*/13, /* cs=*/15, /* dc=*/2, /* reset=*/16);

// 卡尔曼滤波器参数
float dt = 0.01;        // 时间步长
float Q_angle = 0.001;  // 过程噪声方差
float Q_gyro = 0.003;   // 过程噪声方差
float R_angle = 0.05;   // 测量噪声方差

// 状态变量
float pitch = 0;
float roll = 0;
float gyro_x_bias = 0;
float gyro_y_bias = 0;

int8_t sensorBuffer[200] = {};
int sensorIndex = 0;

// 卡尔曼滤波器矩阵
float Xk[4][1] = { { 0 },
                   { 0 },
                   { 0 },
                   { 0 } };
float Pk[4][4] = { { 1, 1, 0, 0 },
                   { 1, 1, 0, 0 },
                   { 0, 0, 1, 1 },
                   { 0, 0, 1, 1 } };
const float Ak[4][4] = { { 1, -dt, 0, 0 },
                         { 0, 1, 0, 0 },
                         { 0, 0, 1, -dt },
                         { 0, 0, 0, 1 } };
const float Hk[2][4] = { { 1, 0, 0, 0 },
                         { 0, 0, 1, 0 } };
const float Qk[4][4] = { { Q_angle, 0, 0, 0 },
                         { 0, Q_gyro, 0, 0 },
                         { 0, 0, Q_angle, 0 },
                         { 0, 0, 0, Q_gyro } };
const float Rk[2][2] = { { R_angle, 0 },
                         { 0, R_angle } };

Adafruit_MPU6050 mpu;

void setup() {
  // Serial
  Serial.begin(115200);
  Serial.println("Serial: Ready!");

  // MPU6050
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  // 设置加速计范围为 +-8G
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  // 设置陀螺仪范围为 +- 500 deg/s
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  // 设置滤波器带宽为21 Hz
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  Serial.println("MPU6050: Ready!");

  // u8g2 oled
  u8g2.begin();
  delay(100);
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_ncenB08_tr);
  u8g2.drawStr(0, 20, "please visit ");
  u8g2.drawStr(0, 33, SERVER_IP);
  u8g2.drawStr(0, 46, "on your phone");
  u8g2.drawStr(0, 59, "to begin Rope!");
  u8g2.sendBuffer();
  Serial.println("U8G2-OLED: Ready.");

  // ESP8266
  WiFi.begin(STASSID, STAPSK);
  Serial.print("ESP8266: Connecting to Wifi.");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("ESP8266: Connected! IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("");

  delay(100);
}

/* 计算姿态角度 */
void calculateAttitude(sensors_event_t a, sensors_event_t g) {
  /* 获取传感器读数 */
  float gyro_x = g.gyro.x / 57.296 - gyro_x_bias;  // 将陀螺仪读数转换为弧度并减去静态偏差
  float gyro_y = g.gyro.y / 57.296 - gyro_y_bias;

  /* 计算加速度计测得的姿态角度 */
  float accel_pitch = atan2(a.acceleration.x, sqrt(pow(a.acceleration.y, 2) + pow(a.acceleration.z, 2)));
  float accel_roll = atan2(a.acceleration.y, sqrt(pow(a.acceleration.x, 2) + pow(a.acceleration.z, 2)));

  /* 融合加速度计和陀螺仪数据 */
  float alpha = 0.96;  // 加速度计和陀螺仪融合的权重因子
  pitch = alpha * (pitch + dt * gyro_x) + (1 - alpha) * accel_pitch;
  roll = alpha * (roll + dt * gyro_y) + (1 - alpha) * accel_roll;
}

/* 使用卡尔曼滤波器进行姿态角度滤波 */
void kalmanFilter() {
  float Yk[2][1] = { { pitch },
                     { roll } };
  // 卡尔曼滤波器预测
  float Xk_1[4][1] = { { 0 },
                       { 0 },
                       { 0 },
                       { 0 } };
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
      Xk_1[i][0] += Ak[i][j] * Xk[j][0];
    }
  }
  float Pk_1[4][4] = { { 0, 0, 0, 0 },
                       { 0, 0, 0, 0 },
                       { 0, 0, 0, 0 },
                       { 0, 0, 0, 0 } };
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
      for (int k = 0; k < 4; k++) {
        Pk_1[i][j] += Ak[i][k] * Pk[k][j];
      }
    }
  }
  for (int i = 0; i < 4; i++) {
    Pk_1[i][i] += Qk[i][i];
  }
  // 卡尔曼滤波器更新
  float temp1[2][4];
  float temp2[4][4];
  float S[2][2];
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 4; j++) {
      temp1[i][j] = 0;
      for (int k = 0; k < 4; k++) {
        temp1[i][j] += Hk[i][k] * Pk_1[k][j];
      }
    }
  }
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
      temp2[i][j] = 0;
      for (int k = 0; k < 4; k++) {
        temp2[i][j] += Pk_1[i][k] * Hk[k][j];
      }
    }
  }
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
      float temp3 = 0;
      for (int k = 0; k < 4; k++) {
        temp3 += Hk[i][k] * temp1[k][j];
      }
      S[i][j] = Rk[i][j] + temp3;
    }
  }
  float K[4][2];
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 2; j++) {
      float temp3 = 0;
      for (int k = 0; k < 4; k++) {
        temp3 += temp2[i][k] * Hk[j][k];
      }
      K[i][j] = temp1[j][i] / S[j][j];
    }
  }
  for (int i = 0; i < 4; i++) {
    Xk[i][0] = Xk_1[i][0] + K[i][0] * (Yk[0][0] - Hk[0][i] * Xk_1[i][0] + Yk[1][0] - Hk[1][i] * Xk_1[i][0]);
    for (int j = 0; j < 4; j++) {
      Pk[i][j] = (1 - K[i][0] * Hk[0][j] - K[i][1] * Hk[1][j]) * Pk_1[i][j];
    }
  }
}

void loop() {
  /* 获取新的传感器读数 */
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  /* 计算姿态角度 */
  calculateAttitude(a, g);

  /* 使用卡尔曼滤波器进行姿态角度滤波 */
  kalmanFilter();

  /* 打印输出姿态角度 */
  // Serial.print("Pitch: ");
  Serial.print(0);
  Serial.print(", ");
  Serial.println(pitch * 180 / PI, 2);

  // 往sensorBuffer最后写入数据
  if (sensorIndex == 200) {
    for (int i = 0; i < 199; i++) {
      sensorBuffer[i] = sensorBuffer[i + 1];
    }
    sensorBuffer[199] = pitch > 0 ? 1 : 0;
  } else {
    sensorBuffer[sensorIndex] = pitch > 0 ? 1 : 0;
    sensorIndex++;
  }

  int haveUpCase = 0;
  for (int i = 0; i < sensorIndex - 1; i++) {
    if (sensorBuffer[i] == 0 && sensorBuffer[i + 1] == 1) {
      haveUpCase++;
    }
  }
  if (haveUpCase >= 1) {
    Serial.println("************************************");
    sensorIndex = 0;
    if ((WiFi.status() == WL_CONNECTED)) {
      WiFiClient client;
      HTTPClient http;
      http.begin(client, "http://" SERVER_IP "/api/sensor");
      http.addHeader("Content-Type", "application/json");
      // int httpCode = http.POST("{\"x\":" + String(pitch * 180 / PI) + ", \"z\":" + "1" + "}");
      int httpCode = http.GET();

      if (httpCode > 0) {
        if (httpCode == HTTP_CODE_OK) {
          const String &payload = http.getString();
          u8g2.clearBuffer();
          if (payload == "STOPED") {
            u8g2.setFont(u8g2_font_ncenB08_tr);
            u8g2.drawStr(0, 20, "please visit ");
            u8g2.drawStr(0, 33, SERVER_IP);
            u8g2.drawStr(0, 46, "on your phone");
            u8g2.drawStr(0, 59, "to begin Rope!");
          } else {
            u8g2.setFont(u8g2_font_ncenB14_tr);
            u8g2.drawStr(0, 20, "Current");
            u8g2.drawStr(90, 20, payload.c_str());
            u8g2.setFont(u8g2_font_ncenB08_tr);
            u8g2.drawStr(0, 37, "visit ");
            u8g2.drawStr(0, 50, SERVER_IP);
            u8g2.drawStr(0, 63, "on your phone!");
          }
          u8g2.sendBuffer();
        }
        http.end();
      } else {
        Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }
    }
  } else {
    delay(20);
  }
}