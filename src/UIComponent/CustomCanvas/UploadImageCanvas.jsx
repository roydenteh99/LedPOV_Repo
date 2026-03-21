import { use, useEffect ,useRef, useState} from 'react';
import styles from './CustomCanvas.module.css' 
import {Stage, Shape} from "@createjs/easeljs";
import MovablePic from '../../assets/CustomClass/MovablePic.js';
import {Grid} from '../../assets/CustomClass/Grid.js';
import Button from '@mui/material/Button';
import {InputSlider} from '../MuiComponent.jsx';

export default function Canvas(props) {

    const canvasRef = useRef(null);
    const stageRef = useRef(null);
    const gridRef = useRef(null);
    
    const selectedImageRef = useRef(null);
    const [rotation, setRotation] = useState(0); // Use useRef for mutable value that doesn't trigger re-renders
    const [imageSelected, setImageSelected] = useState(false); // when interacting with React UI components, useState is more suitable for triggering re-renders and managing state changes.
    
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
        MovablePic.RawImageConstructor(file, (state , movablePic) => {
            setImageSelected(state)
            console.log("State updated to:", state);
            selectedImageRef.current = movablePic;
        }).then((movablePic) => {
                movablePic.name="movablePic";
                stageRef.current.addChild(movablePic);
                stageRef.current.setChildIndex(movablePic, 0); // Move the new child to the top 
                stageRef.current.update();
                 // Update the reference to the selected image
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
            }}>
            Rasterise
        </Button>

        {imageSelected && (
            <InputSlider 
                value={rotation}
                setValue = {selectedImageRef.current ? (newValue) => {
                    selectedImageRef.current.rotation = newValue;
                    setRotation(newValue); // Update the state to reflect the new rotation
                    stageRef.current.update();
                } : () => {console.warn("No image selected to rotate!");}}
                rangeWithStep = {[0,360,1]}
                name ="Rotation Angle"
                id = "rotation"
        />
        )}        
        
    </>
    )}
