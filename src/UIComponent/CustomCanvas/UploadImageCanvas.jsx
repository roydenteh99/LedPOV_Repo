import { use, useEffect ,useRef, useState} from 'react';
import styles from './CustomCanvas.module.css' 
import {Stage, Shape} from "@createjs/easeljs";
import MovablePic from '../../assets/CustomClass/MovablePic.js';
import {Grid} from '../../assets/CustomClass/Grid.js';
import Button from '@mui/material/Button';


export default function Canvas(props) {
    const canvasRef = useRef(null);
    const stageRef = useRef(null);
    const gridRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const stage = new Stage(canvas);
        stageRef.current = stage;
        stage.doubleClickEnabled = true;
        const grid = new Grid(10, 10, 2);
        gridRef.current = grid;
        stage.addChild(grid);
        stage.update();
        // TestColorExtraction(stageRef.current);

        }, [])


    function addImageToCanvas(file) {
        if (!file) return;
        MovablePic.RawImageConstructor(file).then((movablePic) => {
                movablePic.name="movablePic";
                stageRef.current.addChild(movablePic);
                stageRef.current.setChildIndex(movablePic, 0); // Move the new child to the top 
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
        <Button variant="contained" onClick={() => {
            console.log("rasterise!")
            gridRef.current.gridRasterisation();
            }}>Rasterise</Button>
        
    </>
    )}
