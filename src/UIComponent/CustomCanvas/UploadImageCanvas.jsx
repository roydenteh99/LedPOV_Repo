import { use, useEffect ,useRef, useState} from 'react';
import styles from './CustomCanvas.module.css' 
import {Stage} from "@createjs/easeljs";
import MovablePic from '../../assets/CustomClass/MovablePic.js';

export default function Canvas(props) {
    const canvasRef = useRef(null);
    const stageRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const stage = new Stage(canvas);
        stageRef.current = stage;
        }, [])


function addImageToCanvas(file) {
    if (!file) return;
    MovablePic.RawImageConstructor(file).then((movablePic) => {
            stageRef.current.addChild(movablePic);
            stageRef.current.update(); // Update the canvas to show the new child
        });
    };

    return (
    <>
    <canvas ref={canvasRef} className={styles.canvas} style={props} width={1800} height={500}/>
        <label> Choose a image to upload: 
            <input type ="file" id="file" accept="image/png, image/jpeg"
                onChange={(e)=> {addImageToCanvas(e.target.files[0])
                                console.log(e.target.files[0])}
                } />
        </label>
        
    </>
    )

}
