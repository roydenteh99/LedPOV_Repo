import { LED_SETTINGS } from './config';

import Canvas from './UIComponent/CanvasTest';
import InputSlider from './UIComponent/InputSlider';
import {SimpleButton} from './UIComponent/PracticeEvent';
import * as React from 'react';
import './App.css';

function App() {
  const [noOfLed, setNoOfLed] = React.useState(LED_SETTINGS.INITIAL_VALUE);
  
  
  return (
    <div>
      <h1>Test</h1>
      <SimpleButton />
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
       />

    </div>
  );
}

export default App;