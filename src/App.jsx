import InputSlider from './UIComponent/InputSlider';
import {SimpleButton} from './UIComponent/PracticeEvent';
import * as React from 'react';
import './App.css';

function App() {
  const [noOfLed, setNoOfLed] = React.useState(0);
  const ledRange = [0, 100, 1];
  return (
    <div>
      <h1>Test</h1>
      <SimpleButton />
      <InputSlider 
        value = {noOfLed} 
        setValue={setNoOfLed} 
        rangeWithStep = {[0,100,1]} 
        name="Number of Led"
        id = "noOfLed"
      />
    </div>
  );
}

export default App;