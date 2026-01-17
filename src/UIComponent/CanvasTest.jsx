import React, { useEffect ,useRef} from 'react';
import {Stage,Shape} from "@createjs/easeljs";

export default function Canvas(props) {
    const canvasRef = useRef(null) // before it fully load lets place null as a place holder for canvasRef
    

    function draw(canvas) {
        let stage = new Stage(canvas);
        let shape = new Shape();
        shape.graphics.beginFill("red").drawRect(0, 0, 200, 120);
        stage.addChild(shape);
        stage.update();
    }


    useEffect(() => {
        const canvas = canvasRef.current;
        draw(canvas)

    }, 
    [] // empty array ensure only runs on first render . Alternatively if you want to run upon change of props/ state insert them into the array
)
    return <canvas ref={canvasRef}{...props}/> // Wrapper for canva passing the props into dom's/native canvas
//Equvilent to 
// function Canvas(props) {
//   return <canvas {...props} />
// }
}
