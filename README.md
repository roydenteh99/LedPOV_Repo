# LED POV Simulator

This project is a browser-based simulator for a Persistence of Vision display. It is designed to help visualize how fast LED pulses can be perceived as continuous lights, trails, and image-like output when the strip moves through space.

The purpose is part practical and part exploratory:

- simulate POV behavior visually
- tune parameters like LED count, frequency, and speed
- upload images and test rasterized patterns
- understand how time-based light pulses become spatial patterns

![LED TRAIL GIF](./LEDTRAIL.gif)

## What this app does

- Shows a virtual LED strip with adjustable number of LEDs
- Lets you control pulse frequency and horizontal motion speed
- Lets you toggle an animation loop and watch the trail form
- Allows clicking individual LEDs to recolor them
- Lets you upload a bitmap and rasterize it into a grid-based visual approximation

## Stack

- React + Vite for the app shell
- EaselJS for canvas drawing and animation
- Material UI for sliders and switches
- color for RGB color manipulation

## Quick start

```bash
npm install
npm run dev
```

Then open the local Vite URL from the terminal.

For a production build:

```bash
npm run build
```

For linting:

```bash
npm run lint
```

## Project structure

```text
src/
  App.jsx                      # app entry and mounting point
  config.js                    # default ranges and system settings
  UIComponent/
    MuiComponent.jsx           # reusable sliders and toggle controls
    CustomCanvas/
      CustomCanvas.jsx         # main POV simulation canvas
      UploadImageCanvas.jsx    # image upload / rasterization UI
  assets/CustomClass/
    ColorUtil.js               # weighted-color math and temporal-to-spatial conversion
    Grid.js                    # image sampling and grid-based rasterization
    MovablePic.js              # draggable uploaded image wrapper
    SquareManager.js           # manages LED strip motion and animation updates
```

## Important runtime flow

The app starts in [src/App.jsx](src/App.jsx), which mounts the main POV canvas and the upload canvas.

The main simulator is defined in [src/UIComponent/CustomCanvas/CustomCanvas.jsx](src/UIComponent/CustomCanvas/CustomCanvas.jsx). It creates an EaselJS stage and a `SquareManager` instance. The slider state is wired to:

- number of LEDs
- frequency
- horizontal speed
- zoom
- run toggle

The animation loop lives in [src/assets/CustomClass/SquareManager.js](src/assets/CustomClass/SquareManager.js). This file is the core of the motion simulation:

- `update(delta)` decides whether the playhead is moving
- `processMovement(delta)` modifies the strip position
- `_handleTrail(delta, endCount)` calculates color overlap and fade behavior
- children are each rendered as LED segments derived from `SingleSquare`

The actual color blending and time-to-space conversion details live in [src/assets/CustomClass/ColorUtil.js](src/assets/CustomClass/ColorUtil.js). That is the mathematical center for understanding the POV effect.

## Core concept behind the math

The project simulates the fact that the eye perceives a moving light source as a continuous trail because it averages flash events over time. The code approximates this by:

- turning LED activity into weighted time intervals
- converting those intervals into event positions
- fusing overlapping events into color segments
- drawing those segments as a moving trail

In practical terms:

- `weightedColorArray(...)` turns a time range into LED color events
- `eventGenerator(...)` maps those events to a position timeline
- `rangeAndColor(...)` merges overlapping ranges and computes blended color

If the visual result feels “off,” the first place to inspect is the timing math in [src/assets/CustomClass/ColorUtil.js](src/assets/CustomClass/ColorUtil.js).

## Settings and config

The system defaults are stored in [src/config.js](src/config.js):

- `LED_SETTINGS`
- `FREQUENCY_SETTINGS`
- `SPEED_SETTINGS`
- `ZOOM_SETTINGS`

These values control the operating window for the app and are the easiest place to adjust the default experience.

## Image rasterization flow

The upload workflow in [src/UIComponent/CustomCanvas/UploadImageCanvas.jsx](src/UIComponent/CustomCanvas/UploadImageCanvas.jsx) is meant to prepare images for a POV-style display.

Flow:

1. upload an image file
2. wrap it in a draggable `MovablePic`
3. render it onto the canvas
4. click `Rasterise`
5. sample colors through a grid in [src/assets/CustomClass/Grid.js](src/assets/CustomClass/Grid.js)
6. average the sampled color values and draw them back as LED-like strokes

This is still experimental, but it is the closest thing this project has to a “hardware pre-processor.”

## Where to start when returning to the project

If you need to pick up where you left off, read in this order:

1. [src/App.jsx](src/App.jsx)
2. [src/UIComponent/CustomCanvas/CustomCanvas.jsx](src/UIComponent/CustomCanvas/CustomCanvas.jsx)
3. [src/assets/CustomClass/SquareManager.js](src/assets/CustomClass/SquareManager.js)
4. [src/assets/CustomClass/ColorUtil.js](src/assets/CustomClass/ColorUtil.js)
5. [src/UIComponent/CustomCanvas/UploadImageCanvas.jsx](src/UIComponent/CustomCanvas/UploadImageCanvas.jsx)
6. [src/assets/CustomClass/Grid.js](src/assets/CustomClass/Grid.js)

That sequence follows the app from setup to animation logic to image processing.

## Common editing notes

- The app is built around EaselJS `Stage` objects and direct canvas manipulation.
- The animation is state-driven from React controls, but the actual drawing updates are handled by the class-based manager layer.
- Timing math is the highest-leverage place to change behavior, especially frequency/speed combinations.
- The image conversion logic is more experimental and easier to break if the canvas stage state or sampling bounds are off.

## Current status

This is a work-in-progress prototype. It already demonstrates the core POV concept and the image preprocessing direction, but it is not yet a polished or production-ready tool. The code is intentionally exploratory and will benefit from cleanup if you continue iterating on it.

## Useful next improvements

- separate animation state from render state
- add presets for common POV patterns
- improve export of rasterized image data for embedded hardware
- clean up the color math and simplify the trail-generation logic
- add a more explicit “design → simulate → export” workflow

For a more detailed project map, see [docs/PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md).
