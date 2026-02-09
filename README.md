## 🌈 LED POV Simulator & Binary Engine

This project is a simulation environment designed to model **Persistence of Vision (POV)**. It explores how the human eye integrates high-frequency light pulses into continuous images or blended colors.

### 🔭 The Core Concept
When an LED flashes at high frequencies (40Hz+), the eye perceives a single blended color. However, when that LED moves rapidly through space, the temporal flashes are mapped to spatial positions, causing the colors to "split" or "streak." 

This tool simulates that physical phenomenon by:
* **Simulating High-Frequency States:** Modeling LED behavior up to 1000Hz.
* **Weighted Integration:** Using mathematical "color fusion" to represent how our retinas average light intensity over time.
* **Spatio-Temporal Mapping:** Visualizing exactly when a color will appear solid and when it will break into distinct steps based on movement speed.
![LED TRAIL GIF](./LEDTRAIL.gif)


### 🚀 From Simulation to Hardware
Beyond visualization, this tool serves as a **Pre-Processor** for embedded systems.
1. **Design:** Manipulate pixels manually or via image placement in the virtual environment.
2. **Process:** The engine calculates the precise weighted color arrays needed for specific movement velocities.
3. **Export:** Generates optimized binary code ready to be flashed onto an **ESP32** for real-world POV display hardware.

## Currently it is a work in progress
