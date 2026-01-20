import React, { useEffect ,useRef, useState} from 'react';
import {Circle, Point} from "../assets/CustomClass/geometry.js";
import {Ticker, Stage ,Shape} from "@createjs/easeljs";
import { SingleCircle , CircleManager} from '../assets/CustomClass/CircleManager.js';



export default function Canvas(props) {
    const canvasRef = useRef(null) // before it fully load lets place null as a place holder for canvasRef
    const {noOfLed, moveLed, ...rest } = props;

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
        const circleManager = new CircleManager(stage, onClickedCallback)
        circleManager.createColumnOfCircle(noOfLed,50,20)
        stage.update();

            // Start automatic stage updates
        Ticker.timingMode = Ticker.RAF;
        Ticker.addEventListener("tick", (event) => {
            circleManager.move_x(0)
        
        //put Object's process function here
        // shape.x += 60 * event.delta / 1000 ; // way to establish consistent speed regardless of tick speed
        
        if (stage) {stage.update();}
        });

        return () => {
        console.log("reset?")
        Ticker.removeAllEventListeners("tick");
        circleManager.destroy()
        // shape.removeAllEventListeners("click");
            }
        }, 
    [noOfLed] // empty array ensure only runs on first render . Alternatively if you want to run upon change of props/ state insert them into the array
    )

    // Update specific item based on props.state
    // useEffect(() => {
    //     Ticker.framerate = props.state;
    //         }, [props.state]
    //     )

    return (<div style={{ position: 'relative', display: 'inline-block' }}>
                <canvas ref={canvasRef}
                        style={{ 
                            backgroundColor: 'black', // Or '#000' 
                            }}
                    {...rest}/>
                {activeCircle && ( // the && ie AND  means that the element of input does not get process if activeCirle is null
                <input
                    defaultValue={activeCircle.color}
                    style={{
                        position: 'absolute',
                        // Use the coordinates from the circle object
                        left: activeCircle.circle.x, 
                        top: activeCircle.circle.y - activeCircle.circle.radius, 
                        transform: 'translate(-50%, -110%)', // Offset to sit above the circle
                        backgroundColor: 'white',
                    }}
                    size = {5}
                    // hidden={activeCircle == null}
                    autoFocus
                    onBlur={(e)=> {
                        activeCircle.change_color(e.target.value)
                        setActiveCircle(null)
                        }
                    }
                    onKeyDown={(e)=> {
                        if (e.key === "Enter") {
                            e.target.blur();
                            }
                        }
                    }
                    >
                </input>) //shortcut to not do this hidden
                }
            </div>)
     // Wrapper for canva passing the props into dom's/native canvas
//Equvilent to 
// function Canvas(props) {
//   return <canvas {...props} />
// }
}
