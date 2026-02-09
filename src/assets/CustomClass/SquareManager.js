import {Shape,Graphics,Container} from "@createjs/easeljs";
import Color from 'color';
import * as ColorUtil from "./ColorUtil.js"

// Note to self should have inherit the Square class so i dont have to rewrite some of the function
export class SingleSquare extends Shape {

    constructor(x_centre , y_centre, halfWidth, color, customId=0){
        super()
        this.x = x_centre
        this.y = y_centre
        this.halfWidth = halfWidth
        this.color = color.map((singleColor) => singleColor.rgbNumber());
        this.onClicked = null;
        this.ledId = customId;
        this._draw(); // NOTE to self if you dont want draw comment this out
        
        this.addEventListener("click", (evt) => {
            if (this.onClicked) this.onClicked(evt, this);
        });
    }

    setOnClicked(callback) {
        if (typeof callback !== 'function') {
            console.error("setOnClicked expects a function.");
            return this;
        }
        this.onClicked = callback;
        return this; // Allows for chaining
    }
    
    // }
    _draw() {
        //console.log(this.color)
        // this.graphics.clear().beginFill(this.color[0].rgb().string()).dc(0, 0, this.halfWidth)
        this.graphics.clear().setStrokeStyle(this.halfWidth * 2).beginStroke(ColorUtil.Uint24ToColor(this.color[0]).rgb().string()).moveTo(0,0).lt(-this.halfWidth * 2 , 0)
    }

    clearDrawing() {
        this.graphics.clear()
    }


    destroy() {
    // This removes EVERY listener attached to this shape (click, mouseover, etc.)
        this.removeAllEventListeners();
    }


    drawWhileRun(toDraw) {
        let offset = toDraw[0][0][1]
        console.log(offset)
        this.graphics.clear().setStrokeStyle(this.halfWidth * 2)
        // console.log(toDraw[0][0][1] ,toDraw[0][0][0]  )
        toDraw.forEach( (rangeAndColor)=> 
            { 
                let range = rangeAndColor[0]
                let Color = rangeAndColor[1]
                // console.log(range)
                // console.log(Color)
                this.graphics.beginStroke(Color.rgb().string()).moveTo(range[1] - offset ,0).lt(range[0] - offset , 0)
                ///TO BE Breaks SOLVED 
                

            }
        )


    }
    
    ///Note to be fixed//     
    updateHeadWhileRun(recordedArray, frameState) {
        const {horizontalSpeed, frequency,} = frameState; 
        const toDraw = ColorUtil.rangeAndColor(this.halfWidth * 2, frequency, horizontalSpeed, recordedArray , true , 0.25)
        // console.log(recordedArray.map((array)=>array[1]))
        // console.log(toDraw.map((array) => array[0][0]),toDraw.map((array) => array[0][1]))
        // console.log(toDraw.map((array) => array[1].rgb().string()))
        this.drawWhileRun(toDraw)
    }

    


    updateHeadAndTrailRun(ctx, frameState) {
        const {timeElapsed, delta , frequency, startCount, endCount} = frameState
        let recordedArray = ColorUtil.weightedColorArray(this.color, startCount, endCount)

        this.updateHeadWhileRun(recordedArray,frameState)
    }



    change_color(color) {
        if (color == '') {
            console.log("empty!")
        } else {
            this.color[0] = Color(color);
        }
        this._draw(); 
    }

}

export class SquareManager extends Container  {
    constructor(stated_stage, onClicked = null){
        super()
        
        this.onClicked = onClicked;
        this.isMoving = false;
        this.horizontalSpeed = 0;
        this.spacing = 0;
        this.squreHalfWidth = 0;
        this.offset = [50, 50];
        
        this.elapsedTime = 0
        this.startCount = 0 

        this.frequency = 100// can change in state later
        this.fader = new Shape();
        
        stated_stage.addChild(this.fader)
        stated_stage.addChild(this)
    
        this.fadeTimeInms = 500
        this.recorder = new Shape();
        // this.addChild(this.recorder);
    }


    init(noOfSquare, horizontalSpeed ,spacing, squreHalfWidth, offset = [50,50]) {
        this.spacing = spacing;
        this.horizontalSpeed = horizontalSpeed;
        this.squreHalfWidth = squreHalfWidth;
        this.x = offset[0];
        this.y = offset[1];
        
        for (let i = 0 ; i < noOfSquare ; i++) {
            this._addSingleSquare(i)
        }
    }

    _addSingleSquare(index){
        let square = new SingleSquare(
            0 , 0 + index * this.spacing, 
            this.squreHalfWidth, 
            [Color("red"), Color("orange"), Color("yellow"), Color("green"), Color("blue"), Color("indigo"), Color("violet")], 
            index);

        square.setOnClicked(this.onClicked);
        this.addChildAt(square, index);

    }
    
_handleTrail(delta, endCount) {
    // 1. Calculate Fade Logic (The "Death to Life" fader)
    const virtualWidth = this.stage.canvas.width / this.stage.scaleX;
    const virtualHeight = this.stage.canvas.height / this.stage.scaleY;
    const ctx = this.stage.canvas.getContext("2d");
    const fadeAlpha =  (delta / this.fadeTimeInms);
    // Clear the old instructions and write new ones
    this.fader.graphics
        .clear()
        .beginFill(`rgba(0, 0, 0, ${fadeAlpha})`)
        .drawRect(0, 0, virtualWidth, virtualHeight);

    // 2. Prepare Drawing Context and Constants

 
    const dist = (delta * this.horizontalSpeed) / 1000;
    
    
    const maxNoOfSplit = Math.floor(dist / (this.squreHalfWidth))
    const parentOffset = [this.x , this.y]
    const frameState = {
        delta,
        dist,
        maxNoOfSplit,
        fadeAlpha,
        parentOffset,
        endCount : endCount,
        startCount: this.startCount,
        timeElapsed : this.elapsedTime,
        frequency : this.frequency,
        horizontalSpeed:this.horizontalSpeed
    }
    // const calAlpha = 1 - fadeAlpha;
    

    
    // 3. Process each child Square
    this.children.forEach((child) => {
        //3.1 . update head of child
        child.updateHeadAndTrailRun(ctx, frameState)

    });
}


    syncSquareQuantity(newNoOfSquare) {
        while (newNoOfSquare > this.children.length){
            this._addSingleSquare(this.children.length);
        }

        while (newNoOfSquare< this.children.length){
           this.removeChildAt(this.children.length - 1);
        }
    }
    
    syncSpeed(speed){
        this.horizontalSpeed = speed
    }


    processMovement(delta){
        this.x += (delta * this.horizontalSpeed) / 1000;
        
        // Safety: Only check width if the stage is ready
        if (this.stage && this.stage.canvas) {
            let virtualWidth = this.stage.canvas.width / this.stage.scaleX;
        // Use a dynamic reset point based on the Square size
            if (this.x > virtualWidth) {
                this.x = this.x % virtualWidth
            }
        }
        
    }

    setIsMoving(toMove) {
        this.isMoving = toMove
    }

    update(delta){
        
        // console.log("<SquareManager .js><208>  Frame Rate : ", 1 / delta * 1000) // Frame Rate
        if (this.isMoving){

            this.stage.autoClear = false

            this.elapsedTime += delta;
            let endCount = this.elapsedTime * this.frequency / 1000

            
            this.processMovement(delta)
            this._handleTrail(delta, endCount)
    
            this.startCount = endCount
            

        } else {
            this.elapsedTime = 0
            this.startCount = 0
            this.stage.autoClear = true
        }



       
    }


    destroy() {
        // Clean up listeners to prevent memory leaks
        this.removeAllChildren();
    }
}