// Basic demo for accelerometer readings from Adafruit MPU6050

#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#define SERVER_IP "192.168.209.137:3000"
#ifndef STASSID
// #define STASSID "zjby1401"
// #define STAPSK "4000012999"
#define STASSID "Xiaomi 13"
#define STAPSK "1234567890"
#endif

Adafruit_MPU6050 mpu;

void setup(void) {
  // Serial
  Serial.begin(115200);
  while (!Serial)
    delay(10);
  Serial.println("Serial: Ready!");

  // MPU6050
  if (!mpu.begin()) {
    Serial.println("MPU6050: Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050: Ready!");
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  Serial.print("MPU6050: Accelerometer range set to: ");
  switch (mpu.getAccelerometerRange()) {
    case MPU6050_RANGE_2_G:
      Serial.println("+-2G");
      break;
    case MPU6050_RANGE_4_G:
      Serial.println("+-4G");
      break;
    case MPU6050_RANGE_8_G:
      Serial.println("+-8G");
      break;
    case MPU6050_RANGE_16_G:
      Serial.println("+-16G");
      break;
  }
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  Serial.print("MPU6050: Gyro range set to: ");
  switch (mpu.getGyroRange()) {
    case MPU6050_RANGE_250_DEG:
      Serial.println("+- 250 deg/s");
      break;
    case MPU6050_RANGE_500_DEG:
      Serial.println("+- 500 deg/s");
      break;
    case MPU6050_RANGE_1000_DEG:
      Serial.println("+- 1000 deg/s");
      break;
    case MPU6050_RANGE_2000_DEG:
      Serial.println("+- 2000 deg/s");
      break;
  }
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  Serial.print("MPU6050: Filter bandwidth set to: ");
  switch (mpu.getFilterBandwidth()) {
    case MPU6050_BAND_260_HZ:
      Serial.println("260 Hz");
      break;
    case MPU6050_BAND_184_HZ:
      Serial.println("184 Hz");
      break;
    case MPU6050_BAND_94_HZ:
      Serial.println("94 Hz");
      break;
    case MPU6050_BAND_44_HZ:
      Serial.println("44 Hz");
      break;
    case MPU6050_BAND_21_HZ:
      Serial.println("21 Hz");
      break;
    case MPU6050_BAND_10_HZ:
      Serial.println("10 Hz");
      break;
    case MPU6050_BAND_5_HZ:
      Serial.println("5 Hz");
      break;
  }
  Serial.println("");

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

void loop() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  double x = a.acceleration.x;
  double z = a.acceleration.z;

  Serial.print(x);
  Serial.print(",");
  Serial.println(z);

  if ((WiFi.status() == WL_CONNECTED)) {
    WiFiClient client;
    HTTPClient http;
    http.begin(client, "http://" SERVER_IP "/api/sensor");
    http.addHeader("Content-Type", "application/json");
    int httpCode = http.POST("{\"x\":" + String(x) + ", \"z\":" + String(z) + "}");
    http.end();

    if (httpCode > 0) {
      // Serial.printf("[HTTP] POST... code: %d\n", httpCode);
      // if (httpCode == HTTP_CODE_OK) {
      //   const String& payload = http.getString();
      //   Serial.println("received payload:\n<<");
      //   Serial.println(payload);
      //   Serial.println(">>");
      // }
    } else {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }
  }

  delay(20);
}