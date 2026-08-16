# LED POV Project Guide

## Project purpose

This project is a browser-based simulator for a Persistence of Vision display. The app visualizes how rapid LED pulses can be perceived as a continuous light trail or image when the device moves through space.

The core idea is:

- LEDs pulse at a chosen frequency.
- The simulation blends colors over time.
- Motion causes those time-based flashes to map to spatial positions.
- The result is a visual approximation of how a POV display would look.

The project is also intended to act as a rough pre-processing tool for hardware work: you can design patterns in the browser, adjust timing and motion, and generate output ideas before pushing them into an embedded system.

## Stack

- React 19
- Vite
- EaselJS for canvas drawing and animation
- Material UI for sliders and switches
- color for color manipulation

## Main runtime flow

1. The app boots in [src/App.jsx](../src/App.jsx).
2. The scene is created in [src/UIComponent/CustomCanvas/CustomCanvas.jsx](../src/UIComponent/CustomCanvas/CustomCanvas.jsx).
3. The LED animation is managed by [src/assets/CustomClass/SquareManager.js](../src/assets/CustomClass/SquareManager.js).
4. Per-LED timing and light blending are handled by [src/assets/CustomClass/ColorUtil.js](../src/assets/CustomClass/ColorUtil.js).
5. Image-based rasterization is handled by [src/UIComponent/CustomCanvas/UploadImageCanvas.jsx](../src/UIComponent/CustomCanvas/UploadImageCanvas.jsx) and [src/assets/CustomClass/Grid.js](../src/assets/CustomClass/Grid.js).

## Important files

### App shell

- [src/App.jsx](../src/App.jsx): application entry; mounts the main canvas and upload canvas.
- [src/config.js](../src/config.js): global slider ranges and defaults.

### UI and controls

- [src/UIComponent/MuiComponent.jsx](../src/UIComponent/MuiComponent.jsx): shared slider and toggle components.
- [src/UIComponent/CustomCanvas/CustomCanvas.jsx](../src/UIComponent/CustomCanvas/CustomCanvas.jsx): main POV simulation UI with LED count, frequency, and speed controls.
- [src/UIComponent/CustomCanvas/UploadImageCanvas.jsx](../src/UIComponent/CustomCanvas/UploadImageCanvas.jsx): image upload, rotation control, and rasterization trigger.

### Simulation engine

- [src/assets/CustomClass/SquareManager.js](../src/assets/CustomClass/SquareManager.js): container that owns the LED strip. Handles movement, fade, animation timing, and end-to-end update loop.
- [src/assets/CustomClass/ColorUtil.js](../src/assets/CustomClass/ColorUtil.js): computes weighted color arrays and converts time-based LED events into spatial color ranges.

### Image tools

- [src/assets/CustomClass/MovablePic.js](../src/assets/CustomClass/MovablePic.js): wraps an uploaded image as a draggable EaselJS object.
- [src/assets/CustomClass/Grid.js](../src/assets/CustomClass/Grid.js): rasterizes an image into a grid of averaged colors.

## Setup

From the project root:

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

Production build:

```bash
npm run build
```

Optional lint check:

```bash
npm run lint
```

## How the main simulation works

The main simulation is driven by the animation loop inside [src/assets/CustomClass/SquareManager.js](../src/assets/CustomClass/SquareManager.js).

### State variables

- `isMoving`: whether the LED line is animated.
- `horizontalSpeed`: how fast the POV sweep is moving.
- `frequency`: LED pulse frequency in Hz.
- `elapsedTime` and `startCount`: track how much time has passed and which LED events are active.
- `children`: each child is an LED-like square.

### Update cycle

Every tick:

- `SquareManager.update(delta)` increments elapsed time if movement is on.
- `processMovement(delta)` shifts the draw position based on speed.
- `_handleTrail(delta, endCount)` calculates the visible merged trail.
- `child.updateHeadAndTrailRun(...)` tells each LED to redraw its color pattern using weighted historical data.

### Color math

The key logic lives in [src/assets/CustomClass/ColorUtil.js](../src/assets/CustomClass/ColorUtil.js):

- `weightedColorArray(...)` converts a time interval into a list of weighted colors.
- `eventGenerator(...)` turns each active LED pulse into position-based events.
- `rangeAndColor(...)` fuses overlapping events into segments with blended color.

This is the mathematical center of the project. If you want to understand what the visual effect is doing, start here.

## UI and interaction flow

### Main POV canvas

The main canvas in [src/UIComponent/CustomCanvas/CustomCanvas.jsx](../src/UIComponent/CustomCanvas/CustomCanvas.jsx):

- sets up the EaselJS stage
- creates the LED manager
- binds wheel zoom to the stage
- exposes sliders for:
  - number of LEDs
  - horizontal speed
  - frequency
  - zoom
- allows toggling the animation with the Run switch
- lets you click an LED to change its color

### Image upload and rasterization

The image workflow currently lives in [src/UIComponent/CustomCanvas/UploadImageCanvas.jsx](../src/UIComponent/CustomCanvas/UploadImageCanvas.jsx):

- upload a bitmap
- render it as a movable, draggable EaselJS object
- rotate the image using the slider
- click Rasterise to sample the image through a grid and draw averaged colors back to the canvas

This is the path closest to “pre-processing design for hardware.”

## Common tasks and where to edit them

### Change the default LED settings

Edit [src/config.js](../src/config.js):

- `INITIAL_VALUE`
- `RANGE`
- `FREQUENCY_SETTINGS`
- `SPEED_SETTINGS`
- `ZOOM_SETTINGS`

### Change the rendering or animation behavior

Look at:

- [src/assets/CustomClass/SquareManager.js](../src/assets/CustomClass/SquareManager.js)
- [src/assets/CustomClass/ColorUtil.js](../src/assets/CustomClass/ColorUtil.js)

### Add or tweak controls

Look at:

- [src/UIComponent/MuiComponent.jsx](../src/UIComponent/MuiComponent.jsx)
- [src/UIComponent/CustomCanvas/CustomCanvas.jsx](../src/UIComponent/CustomCanvas/CustomCanvas.jsx)

### Change image processing logic

Look at:

- [src/assets/CustomClass/MovablePic.js](../src/assets/CustomClass/MovablePic.js)
- [src/assets/CustomClass/Grid.js](../src/assets/CustomClass/Grid.js)

## Current project status

This is still a working prototype rather than a polished product. The project clearly separates the simulation layer from the image-processing layer, but there are still rough edges and experimental logic.

A few patterns worth knowing before editing:

- Some parts are intentionally exploratory rather than production-clean.
- Debug logging is present in the utility files.
- The system depends on canvas timing and stage state being kept in sync.
- The simulation data flow is time-based, so small changes to frequency or speed may drastically change the visual result.

## Recommended reading order for a return visit

If you are coming back after some time, this is the best order to approach the code:

1. [src/App.jsx](../src/App.jsx)
2. [src/UIComponent/CustomCanvas/CustomCanvas.jsx](../src/UIComponent/CustomCanvas/CustomCanvas.jsx)
3. [src/assets/CustomClass/SquareManager.js](../src/assets/CustomClass/SquareManager.js)
4. [src/assets/CustomClass/ColorUtil.js](../src/assets/CustomClass/ColorUtil.js)
5. [src/UIComponent/CustomCanvas/UploadImageCanvas.jsx](../src/UIComponent/CustomCanvas/UploadImageCanvas.jsx)
6. [src/assets/CustomClass/Grid.js](../src/assets/CustomClass/Grid.js)

That sequence follows the app from boot, to visual simulation, to light math, then to image conversion.

## Useful debugging ideas

- If the animation looks wrong, inspect `frequency`, `speed`, and `elapsedTime` first.
- If the LED strip is not updating, check whether `isMoving` is toggled and whether the manager is mounted correctly.
- If the image rasterization looks strange, inspect the grid sampling logic and the `readColour` / `blendColour` steps.
- If the stage updates unexpectedly, remember that the main canvas uses EaselJS tick listeners and direct stage updates.

## Next logical improvements

Potential next steps for this project include:

- cleaning up the timing model and making the rendering math more explicit
- exporting rasterized patterns as hardware-ready arrays or binary payloads
- adding a proper preset system for common POV designs
- separating simulation state from rendering state to simplify debugging
- improving the image rasterization workflow to support custom grid density and LED mapping

## Quick summary

This project is a visual and mathematical playground for POV light behavior. The key intellectual center is the overlap between time and space: how led pulses, when sampled over time and motion, create the illusion of a continuous image. The most important files to understand are the canvas controller, the square manager, and the color utility.
