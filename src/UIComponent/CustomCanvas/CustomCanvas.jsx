import React, { useEffect ,useRef, useState} from 'react';
import {Ticker, Stage ,Shape, StageGL} from "@createjs/easeljs";
import { SingleSquare , SquareManager} from '../../assets/CustomClass/SquareManager.js';
import { LED_SETTINGS,SPEED_SETTINGS } from '../../config.js';
import {InputSlider, SwitchLabels} from '../MuiComponent.jsx';
import styles from './CustomCanvas.module.css' 

export default function Canvas(props) {
    const [noOfLed, setNoOfLed] = React.useState(LED_SETTINGS.INITIAL_VALUE);
    const [moveLed, setMoveLed] = React.useState(false);
    const [speed, setSpeed] = React.useState(0);

    const canvasRef = useRef(null) // before it fully load lets place null as a place holder for canvasRef
    const [activeSquare,setActiveSquare] = useState(null)
    const managerRef =  useRef(null)
    const stageRef = useRef(null)

    const SCROLL_SENSITIVITY = 0.0005;
    const MAX_ZOOM = 10;
    const MIN_ZOOM = 0.3;
    const [zoom, setZoom] = useState(0.4);
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);




    function handleWheel(event) {
        // console.log("handle wheel")
        const { deltaY } = event;
        setZoom((zoom) => clamp(zoom + deltaY * SCROLL_SENSITIVITY * -1, MIN_ZOOM, MAX_ZOOM));
    }

    

    useEffect(() => {
        const canvas = canvasRef.current;
        const stage = new Stage(canvas);
        stageRef.current = stage
        
        
        const squareManager = new SquareManager(stage, (e, c) => setActiveSquare(c));
        managerRef.current = squareManager;  
        squareManager.init(noOfLed, speed, 50, 10);
        

        Ticker.timingMode = Ticker.RAF;
        // Ticker.framerate = 30;
        Ticker.addEventListener("tick", (event) => {
            squareManager.update(event.delta)
            //console.log("frameRate : ",Math.floor(1000/event.delta) )
            
            if (stage) {stage.update();}
        });
        
        return () => {
            console.log("reset?")
            Ticker.removeAllEventListeners("tick");
            squareManager.destroy()
            }
    }, [] ) // empty array ensure only runs on first render . Alternatively if you want to run upon change of props/ state insert them into the array

    
    // scaling with wheels
    useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current
    canvas.addEventListener('wheel', handleWheel);
    stage.clear()
    stage.set({scale: zoom })
    
    return () => { 
        canvas.removeEventListener('wheel', handleWheel);
        }
    }, [handleWheel]);

    
    useEffect(() => {
        if(managerRef.current) {
            managerRef.current.syncSquareQuantity(noOfLed)
            managerRef.current.setIsMoving(moveLed)
            managerRef.current.syncSpeed(speed)
        }
    }, [noOfLed,moveLed,speed])

    return (<div style={{ position: 'relative', display: 'inline-block' }}>

                <canvas className={styles.canvas} ref={canvasRef} style={props} width={1800} height={500}/>
                
                
                {activeSquare && ( // the && ie AND  means that the element of input does not get process if activeCirle is null
                    <input 
                        autoFocus
                        className={styles.colorInput}
                        defaultValue={activeSquare.color[0]} /// NOTE TO SELF : This for now is to just display the first colour of the array 
                        style = {{
                            left: activeSquare.x,
                            top: activeSquare.y
                        }}
                        size = {15}
                        onBlur={(e)=> {
                            activeSquare.change_color(e.target.value)
                            setActiveSquare(null)
                                }}
                        onKeyDown={(e)=> {
                            if (e.key === "Enter") {
                                e.target.blur();
                                }
                        }}
                    />
                )}
                 

                <SwitchLabels
                value = {moveLed}
                setValue= {setMoveLed}
                label="Run"
                />
                
                <InputSlider 
                value = {noOfLed} 
                setValue={setNoOfLed} 
                rangeWithStep = {LED_SETTINGS.RANGE} 
                name="Number of Led"
                id = "noOfLed"
                />
        
                <InputSlider 
                value = {speed} 
                setValue={setSpeed} 
                rangeWithStep = {SPEED_SETTINGS.RANGE} 
                name="Horizontal Speed"
                id = "speed"
                />
            </div>)
     // Wrapper for canva passing the props into dom's/native canvas
//Equvilent to 
// function Canvas(props) {
//   return <canvas {...props} />
// }
}
