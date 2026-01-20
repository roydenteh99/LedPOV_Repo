import { LED_SETTINGS } from './config';

import Canvas from './UIComponent/CanvasTest';
import {InputSlider, SwitchLabels} from './UIComponent/MuiComponent';
import * as React from 'react';
import './App.css';

function App() {
  const [noOfLed, setNoOfLed] = React.useState(LED_SETTINGS.INITIAL_VALUE);
  const [moveLed, setMoveLed] = React.useState(false);
  
  
  return (
    <div>
      <h1>Test</h1>
      <SwitchLabels
        value = {moveLed}
        setValue={setMoveLed}
        label="Run"
        />

      <InputSlider 
        value = {noOfLed} 
        setValue={setNoOfLed} 
        rangeWithStep = {LED_SETTINGS.RANGE} 
        name="Number of Led"
        id = "noOfLed"
      />
      <Canvas 
       width = {500} 
       height = {500}
       noOfLed = {noOfLed}
       moveLed = {setMoveLed}
       />

    </div>
  );
}

export default App;