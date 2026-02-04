import {Shape,Graphics,Container} from "@createjs/easeljs";
import Color from 'color';
import * as ColorUtil from "./ColorUtil.js"

// Note to self should have inherit the circle class so i dont have to rewrite some of the function
export class SingleCircle extends Shape {

    constructor(x_centre , y_centre, radius, color, customId=0){
        super()
        this.x = x_centre
        this.y = y_centre
        this.radius = radius
        this.color = color;
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
        this.graphics.clear().beginFill(this.color[0].rgb().string()).dc(0, 0, this.radius)
    }

    clearDrawing() {
        this.graphics.clear()
    }


    destroy() {
    // This removes EVERY listener attached to this shape (click, mouseover, etc.)
        this.removeAllEventListeners();
    }
    
    ///Note to be fixed//     
    updateHeadWhileRun(recordedArray, frameState) {
        const {dist , horizontalSpeed, frequency,} = frameState; 
        let fraction = ((this.radius * 2) / (this.radius * 2 + dist) ) 
        let colorAndWeight = ColorUtil.colorArraySplitter(recordedArray, 1, fraction)
        let color = colorAndWeight[0][1]
        console.log(ColorUtil.findColorSegments(ColorUtil.rangeGenerator(this.radius * 2, frequency, horizontalSpeed, recordedArray)).length)  

        this.graphics.clear().beginFill(color.rgb().string()).dc(0, 0, this.radius)
        return
        // const {timeElapsed, frequency} = frameState;
        // let indexLength = Math.floor(timeElapsed * frequency / 1000)
        // let currentIndex = indexLength % this.color.length
        // this.graphics.clear().beginFill(this.color[currentIndex].rgb().string()).dc(0, 0, this.radius)
        //this.graphics.clear()
        // console.log(timeElapsed, frequency)
        // console.log(Math.floor(timeElapsed * frequency / 1000))
    }

    // updateRecordedTrail(ctx, recordedArray, frameState) {
        
    //     const {parentOffset, dist, totalWeight, fadeAlpha, maxNoOfSplit} = frameState;
    //     let startX = parentOffset[0] + this.x
    //     let startY = parentOffset[1] + this.y 
    //     let colorAndWeight = ColorUtil.colorArraySplitter(recordedArray, maxNoOfSplit)

    //     let alphaDeduction = 0

    //     ctx.lineWidth = this.radius * 2;
    //     ctx.lineCap = "round"
        
    //     for(let i = 0 ; i < colorAndWeight.length ; i++) {    
    //         let [weight, color] = colorAndWeight[i]
    //         let weight_proportion =  weight / totalWeight
    //         let step = weight_proportion * dist
    //         alphaDeduction += weight_proportion * fadeAlpha 
    //         ctx.beginPath();
    //         ctx.strokeStyle = color.alpha(1 - alphaDeduction).hexa();
    //         ctx.moveTo(startX, startY);             // Start at circle center
    //         ctx.lineTo(startX - step, startY);      // Draw trail trailing behind
    //         ctx.stroke();
    //         startX -= step
    //     }
    //     // console.log("running recorded trail")
    //     console.log(maxNoOfSplit)
    // }


    updateHeadAndTrailRun(ctx, frameState) {
        const {timeElapsed, delta , frequency, startCount, endCount} = frameState
        let recordedArray = ColorUtil.weightedColorArray(this.color, startCount, endCount)
        // console.log(recordedArray.map(value => value[0]))
        // console.log(recordedArray.map(value => value[1].rgb().string()))
        this.updateHeadWhileRun(recordedArray,frameState)
        // this.updateRecordedTrail(ctx, recordedArray, frameState)
        

        // console.log(recordedArray)
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

export class CircleManager extends Container  {
    constructor(stated_stage, onClicked = null){
        super()
        
        this.onClicked = onClicked;
        this.isMoving = false;
        this.horizontalSpeed = 0;
        this.spacing = 0;
        this.circleRadius = 0;
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


    init(noOfCircle, horizontalSpeed ,spacing, circleRadius, offset = [50,50]) {
        this.spacing = spacing;
        this.horizontalSpeed = horizontalSpeed;
        this.circleRadius = circleRadius;
        this.x = offset[0];
        this.y = offset[1];
        
        for (let i = 0 ; i < noOfCircle ; i++) {
            this._addSingleCircle(i)
        }
    }

    _addSingleCircle(index){
        let circle = new SingleCircle(
            0 , 0 + index * this.spacing, 
            this.circleRadius, 
            [Color("red"),Color("green"),Color("blue")], 
            index);

        circle.setOnClicked(this.onClicked);
        this.addChildAt(circle, index);

    }
    
_handleTrail(delta, endCount) {
    // 1. Calculate Fade Logic (The "Death to Life" fader)

    const ctx = this.stage.canvas.getContext("2d");
    const fadeAlpha =  (delta / this.fadeTimeInms);
    // Clear the old instructions and write new ones
    this.fader.graphics
        .clear()
        .beginFill(`rgba(0, 0, 0, ${fadeAlpha})`)
        .drawRect(0, 0, this.stage.canvas.width, this.stage.canvas.height);

    // 2. Prepare Drawing Context and Constants

 
    const dist = (delta * this.horizontalSpeed) / 100;
    
    const maxNoOfSplit = Math.floor(dist / (this.circleRadius))
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
    

    
    // 3. Process each child circle
    this.children.forEach((child) => {
        //3.1 . update head of child
        child.updateHeadAndTrailRun(ctx, frameState)

    });
}


    syncCircleQuantity(newNoOfCircle) {
        while (newNoOfCircle > this.children.length){
            this._addSingleCircle(this.children.length);
        }

        while (newNoOfCircle< this.children.length){
           this.removeChildAt(this.children.length - 1);
        }
    }
    
    syncSpeed(speed){
        this.horizontalSpeed = speed
    }


    processMovement(delta){
        this.x += (delta * this.horizontalSpeed) / 100;
        
        // Safety: Only check width if the stage is ready
        if (this.stage && this.stage.canvas) {
            let maximumWidth = this.stage.canvas.width;
        // Use a dynamic reset point based on the circle size
            if (this.x > maximumWidth) {
                this.x = this.x % maximumWidth 
            }
        }
        
    }

    setIsMoving(toMove) {
        this.isMoving = toMove
    }

    update(delta){
        

        if (this.isMoving){

            this.stage.autoClear = false

            this.elapsedTime += delta;
            let endCount = this.elapsedTime * this.frequency / 1000

            
            this.processMovement(delta)
            this._handleTrail(delta, endCount)
            
            // console.log("Start Count",this.startCount)
            // console.log("End Count", endCount)
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
        this.circleContainer = [];
    }
}