import { LED_SETTINGS } from './config';

import Canvas from './UIComponent/CustomCanvas/CustomCanvas';

import * as React from 'react';
import './App.css';

function App() {

  
  
  return (
    <div>
      <h1>POI LIGHT TEST(100 Hz)</h1>

      <Canvas />

    </div>
  );
}

export default App;