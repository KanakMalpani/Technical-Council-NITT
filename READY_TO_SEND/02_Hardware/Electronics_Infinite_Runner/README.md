# Electronics Task - LCD Infinite Runner

This folder contains a Wokwi-ready Arduino solution for the Level 3 infinite runner task.

## Implemented

- Non-I2C 16x2 LCD wiring using `LiquidCrystal`.
- Serial Monitor text is echoed to the LCD before the game starts.
- Interrupt-based lane toggle button on digital pin 2.
- Interrupt-based start/restart/wake button on digital pin 3.
- Non-blocking game loop using `millis()`.
- Obstacle movement from right to left.
- Score and high score tracking while the MCU remains powered.
- Game over screen with score and high score.
- Power-down sleep mode after game over.
- Entropy collection from a floating analog pin plus timer jitter for random seeding.

## Wokwi Setup

1. Create a new Arduino Uno project on Wokwi.
2. Replace `sketch.ino` with the file in this folder.
3. Replace `diagram.json` with the file in this folder.
4. Run the simulation.
5. Add the Wokwi project link to the final report PDF before submission.

## Pin Map

| Component | Arduino Pin |
|---|---:|
| LCD RS | 12 |
| LCD E | 11 |
| LCD D4 | 5 |
| LCD D5 | 4 |
| LCD D6 | 7 |
| LCD D7 | 8 |
| Lane button | 2 |
| Start/restart button | 3 |
| Entropy analog input | A0 (dedicated potentiometer in Wokwi) |

## Notes

The task asks for a true random number generator. In a real circuit, the floating analog pin can be improved with a dedicated noisy source, such as reverse-biased transistor junction noise. Wokwi cannot perfectly reproduce physical analog noise, so the code combines analog least significant bits with timer jitter and keeps the implementation clearly marked.
