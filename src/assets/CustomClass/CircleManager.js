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
    
    
    updateDrawWhileRun(timeElapsed, frequency) {
        //console.log(timeElapsed, frequency)
        //console.log(Math.floor(timeElapsed * frequency / 1000))
        let indexLength = Math.floor(timeElapsed * frequency / 1000)
        let currentIndex = indexLength % this.color.length
        this.graphics.clear().beginFill(this.color[currentIndex].rgb().string()).dc(0, 0, this.radius)
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
        this.spacing = 0 ;
        this.circleRadius = 0;
        this.offset = [50, 50];
        this.elapsedTime = 0
        this.frequency = 2 // can change in state later
        this.fader = new Shape();
        
        stated_stage.addChild(this.fader)
        stated_stage.addChild(this)
    


        this.fadeTimeInms = 1000
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
            [Color("red"),Color("blue")], 
            index);

        circle.setOnClicked(this.onClicked);
        this.addChildAt(circle, index);

    }
    
_handleTrail(delta) {
    // 1. Calculate Fade Logic (The "Death to Life" fader)
    const fadeAlpha = 1 - Math.pow(0.01, delta / this.fadeTimeInms);
    // Clear the old instructions and write new ones
    this.fader.graphics
        .clear()
        .beginFill(`rgba(0, 0, 0, ${fadeAlpha})`)
        .drawRect(0, 0, this.stage.canvas.width, this.stage.canvas.height);

    // 2. Prepare Drawing Context and Constants
    const ctx = this.stage.canvas.getContext("2d");
    const dist = (delta * this.horizontalSpeed) / 100;
    const calAlpha = 1 - fadeAlpha;

    // 3. Process each child circle
    this.children.forEach((child) => {
        const startX = this.x;
        const startY = this.y + child.y;

        //PreA . update head of child
        child.updateDrawWhileRun(this.elapsedTime, this.frequency)

        // A. Define the Gradient (From current position backward)
        let gradient = ctx.createLinearGradient(startX, startY, startX - dist, startY);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(1, `rgba(255,255,255,${calAlpha})`);

        // B. Configure Stroke Style
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.circleRadius * 2;
        ctx.lineCap = "round";

        // C. Draw the Trail Path
        ctx.beginPath();
        ctx.moveTo(startX, startY);             // Start at circle center
        ctx.lineTo(startX - dist, startY);      // Draw trail trailing behind
        ctx.stroke();

        // D. Toggle Head Visibility


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
        this.elapsedTime += delta;
    

        if (this.isMoving){
            this.stage.autoClear = false
            this.processMovement(delta)
            this._handleTrail(delta)
            

        } else {
            this.stage.autoClear = true
        }
    }


    destroy() {
        // Clean up listeners to prevent memory leaks
        this.removeAllChildren();
        this.circleContainer = [];
    }
}