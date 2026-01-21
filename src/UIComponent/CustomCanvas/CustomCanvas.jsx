import React, { useEffect ,useRef, useState} from 'react';
import {Ticker, Stage ,Shape} from "@createjs/easeljs";
import { SingleCircle , CircleManager} from '../../assets/CustomClass/CircleManager.js';
import { LED_SETTINGS } from '../../config.js';
import {InputSlider, SwitchLabels} from '../MuiComponent.jsx';
import styles from './CustomCanvas.module.css' 

export default function Canvas(props) {
      const [noOfLed, setNoOfLed] = React.useState(LED_SETTINGS.INITIAL_VALUE);
      const [moveLed, setMoveLed] = React.useState(false);

    const canvasRef = useRef(null) // before it fully load lets place null as a place holder for canvasRef
    
    const [activeCircle,setActiveCircle] = useState(null)


    function drawStage(canvas) {
        const stage = new Stage(canvas);
        return stage;
        }

    function onClickedCallback(e, circle) {
        setActiveCircle(circle)
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const stage = drawStage(canvas);
        const circleManager = new CircleManager(stage, onClickedCallback , moveLed) 
        circleManager.createColumnOfCircle(noOfLed,50,15)
        stage.update();

            // Start automatic stage updates
        Ticker.timingMode = Ticker.RAF;
        Ticker.addEventListener("tick", (event) => {
            circleManager.update()
        if (stage) {stage.update();}
        //put Object's process function here
        // shape.x += 60 * event.delta / 1000 ; // way to establish consistent speed regardless of tick speed
        
        });

        return () => {
        console.log("reset?")
        Ticker.removeAllEventListeners("tick");
        circleManager.destroy()
        // shape.removeAllEventListeners("click");
            }
        }, 
    [noOfLed,moveLed] // empty array ensure only runs on first render . Alternatively if you want to run upon change of props/ state insert them into the array
    )

    // Update specific item based on props.state
    // useEffect(() => {
    //     Ticker.framerate = props.state;
    //         }, [props.state]
    //     )

    return (<div style={{ position: 'relative', display: 'inline-block' }}>

                <canvas className={styles.canvas} ref={canvasRef} style={props} width={500} height={500}/>
                
                {activeCircle && ( // the && ie AND  means that the element of input does not get process if activeCirle is null
                <input 
                    autoFocus
                    className={styles.colorInput}
                    defaultValue={activeCircle.color}
                    style = {{
                        left: activeCircle.x,
                        top: activeCircle.y
                    }}
                    size = {5}
                    onBlur={(e)=> {
                        activeCircle.change_color(e.target.value)
                        setActiveCircle(null)
                            }}
                    onKeyDown={(e)=> {
                        if (e.key === "Enter") {
                            e.target.blur();
                            }
                        }}
                    >
                </input>) //shortcut to not do this hidden
                }
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
            </div>)
     // Wrapper for canva passing the props into dom's/native canvas
//Equvilent to 
// function Canvas(props) {
//   return <canvas {...props} />
// }
}
