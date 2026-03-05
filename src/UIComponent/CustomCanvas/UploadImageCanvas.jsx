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

    

    // function extractColorFromCanvas(x, y, width, height) {
    //     const canvas = canvasRef.current;
    //     const context = canvas.getContext('2d');
    //     const imageData = context.getImageData(x, y, width, height);
    //     const data = imageData.data;
    //     for (let i = 0; i < data.length; i += 4) {
    //     const r = data[i];
    //     const g = data[i + 1];
    //     const b = data[i + 2];
    //     const a = data[i + 3];

    //     console.log(`index i ${i} rgba(${r}, ${g}, ${b}, ${a})`);
    //     }
    // }



    // function TestColorExtraction(stage) {
    
    // const x = 100;
    // const y = 150;
    // const width = 200;
    // const height = 100;
    // const rectTest =new Shape()
    
    // rectTest.on("mousedown", function(evt) {
    // // Calculate the distance between the mouse click and the object's (0,0)
    // evt.currentTarget.offset = {
    //     x: evt.currentTarget.x - evt.stageX,
    //     y: evt.currentTarget.y - evt.stageY
    // };
    // console.log("Rect clicked!");
    // });

    // rectTest.addEventListener("dblclick", function(evt) {
    // // evt.currentTarget points directly to your Shape/Container
    // const x = evt.currentTarget.x;
    // const y = evt.currentTarget.y;

    // console.log(x, y); 
    // extractColorFromCanvas(x, y, width, height);
    // });

    // rectTest.on("pressmove", function(evt) {
    //         evt.currentTarget.x = evt.stageX + evt.currentTarget.offset.x;
    //         evt.currentTarget.y = evt.stageY + evt.currentTarget.offset.y;
    //         // make sure to redraw the stage to show the change:
    //         evt.currentTarget.stage.update();
    // });

    // rectTest.graphics.beginStroke("green").drawRect(0, 0, width, height)
    // stage.addChild(rectTest);
    // stage.addChild(new Grid(10, 10, 2));
    // stage.update();

    // }

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
