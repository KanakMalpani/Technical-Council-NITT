#include <LiquidCrystal.h>
#include <avr/sleep.h>
#include <avr/power.h>

// LCD wiring uses the non-I2C 4-bit interface for brownie points.
const byte LCD_RS = 12;
const byte LCD_EN = 11;
const byte LCD_D4 = 5;
const byte LCD_D5 = 4;
const byte LCD_D6 = 7;
const byte LCD_D7 = 8;

const byte LANE_BUTTON = 2;
const byte RESTART_BUTTON = 3;
const byte ENTROPY_PIN = A0;

const unsigned long FRAME_MS = 260;
const byte LCD_COLS = 16;
const byte LCD_ROWS = 2;

LiquidCrystal lcd(LCD_RS, LCD_EN, LCD_D4, LCD_D5, LCD_D6, LCD_D7);

volatile bool laneInterrupt = false;
volatile bool restartInterrupt = false;

byte playerRow = 1;
int obstacleCol = LCD_COLS - 1;
byte obstacleRow = 0;
unsigned int score = 0;
unsigned int highScore = 0;
unsigned long lastFrame = 0;

enum GameState {
  WAITING_TO_START,
  RUNNING,
  GAME_OVER
};

GameState gameState = WAITING_TO_START;

void onLanePress() {
  laneInterrupt = true;
}

void onRestartPress() {
  restartInterrupt = true;
}

unsigned long collectEntropy() {
  unsigned long seed = 0;
  for (byte i = 0; i < 32; i++) {
    seed <<= 1;
    // On real hardware, a floating analog pin contributes noise. In Wokwi this is
    // close to pseudo-random, but the structure is ready for a physical entropy source.
    seed ^= (analogRead(ENTROPY_PIN) & 1);
    seed ^= (micros() & 1);
    delayMicroseconds(120 + (analogRead(ENTROPY_PIN) & 7));
  }
  return seed ^ micros();
}

void drawGame() {
  lcd.clear();
  for (byte row = 0; row < LCD_ROWS; row++) {
    lcd.setCursor(0, row);
    for (byte col = 0; col < LCD_COLS; col++) {
      if (row == playerRow && col == 0) {
        lcd.print('#');
      } else if (row == obstacleRow && col == obstacleCol) {
        lcd.print('*');
      } else {
        lcd.print(' ');
      }
    }
  }
}

void nextObstacle() {
  obstacleCol = LCD_COLS - 1;
  obstacleRow = random(0, 2);
}

void showStartScreen() {
  gameState = WAITING_TO_START;
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Campus Runner");
  lcd.setCursor(0, 1);
  lcd.print("Press START");
}

void echoSerialBeforeStart() {
  if (!Serial.available()) {
    return;
  }

  char text[LCD_COLS + 1];
  byte count = 0;
  while (Serial.available() && count < LCD_COLS) {
    char incoming = Serial.read();
    if (incoming == '\n' || incoming == '\r') {
      break;
    }
    text[count++] = incoming;
  }
  text[count] = '\0';

  if (count > 0) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(text);
    lcd.setCursor(0, 1);
    lcd.print("START to play");
  }
}

void startGame() {
  restartInterrupt = false;
  laneInterrupt = false;
  playerRow = 1;
  score = 0;
  nextObstacle();
  gameState = RUNNING;
  lastFrame = millis();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Campus Runner");
  lcd.setCursor(0, 1);
  lcd.print("Press jump!");
  delay(700);
  drawGame();
}

void showGameOver() {
  gameState = GAME_OVER;
  highScore = max(highScore, score);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Game Over!");
  lcd.setCursor(0, 1);
  lcd.print("Score:");
  lcd.print(score);
  lcd.print(" Hi:");
  lcd.print(highScore);
}

void enterPowerDownMode() {
  delay(80);
  detachInterrupt(digitalPinToInterrupt(LANE_BUTTON));
  set_sleep_mode(SLEEP_MODE_PWR_DOWN);
  sleep_enable();
  power_adc_disable();
  sleep_bod_disable();
  sleep_cpu();
  sleep_disable();
  power_adc_enable();
  laneInterrupt = false;
  attachInterrupt(digitalPinToInterrupt(LANE_BUTTON), onLanePress, FALLING);
}

void setup() {
  pinMode(LANE_BUTTON, INPUT_PULLUP);
  pinMode(RESTART_BUTTON, INPUT_PULLUP);
  pinMode(ENTROPY_PIN, INPUT);

  lcd.begin(LCD_COLS, LCD_ROWS);
  Serial.begin(9600);
  randomSeed(collectEntropy());

  attachInterrupt(digitalPinToInterrupt(LANE_BUTTON), onLanePress, FALLING);
  attachInterrupt(digitalPinToInterrupt(RESTART_BUTTON), onRestartPress, FALLING);
  showStartScreen();
}

void loop() {
  if (restartInterrupt) {
    startGame();
  }

  if (gameState == WAITING_TO_START) {
    echoSerialBeforeStart();
    return;
  }

  if (gameState == GAME_OVER) {
    enterPowerDownMode();
    return;
  }

  if (laneInterrupt) {
    laneInterrupt = false;
    playerRow = 1 - playerRow;
    drawGame();
  }

  if (millis() - lastFrame < FRAME_MS) {
    return;
  }

  lastFrame = millis();
  obstacleCol--;

  if (obstacleCol == 0 && obstacleRow == playerRow) {
    showGameOver();
    return;
  }

  if (obstacleCol < 0) {
    score++;
    nextObstacle();
  }

  drawGame();
}
