import { touchRippleClasses } from "@mui/material";
import {Circle, Point} from "./geometry.js";
import {Shape,Graphics,Container} from "@createjs/easeljs";


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
        this._draw();
        
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
        this.graphics.
        clear().
        beginFill(this.color)
            .dc(0, 0, this.radius)
    }

    move_x(x_increment) {
        this.x += x_increment
    }

    set_x(x_value) {
        this.x = x_value
    }

    destroy() {
    // This removes EVERY listener attached to this shape (click, mouseover, etc.)
        this.removeAllEventListeners();
    }   

    change_color(color) {
        if (color == '') {
            console.log("empty!")
            this.color = "white"
        } else {
            this.color = color;
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
        
        this.fader = new Shape();
        this.initfader(stated_stage)
        
        stated_stage.addChild(this.fader)
        stated_stage.addChild(this)
        stated_stage.compositeOperation= "luminosity"


        // this.trailPersistence = 500
        this.prevX = null
        this.recorder = new Shape();
        // this.addChild(this.recorder);
    }

    initfader(stage) {
        this.fader.graphics
        .beginFill("rgba(0, 0, 0, 0.1)") // The "fill" logic
        .drawRect(0, 0, stage.canvas.width, stage.canvas.height);
        
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
    _handleTrail(delta) {
        return
        // if (!this.stage || !this.stage.canvas) 
        //     return;

        // if (this.prevX && this.prevX < this.x) {
        //     var g = this.recorder.graphics;
        //     if (this.horizontalSpeed > 150 ){
            
        //     g.setStrokeStyle(this.circleRadius * 2 ).beginFill("white").beginStroke("white").moveTo(0,0).lineTo(this.prevX -this.x ,0).endStroke();
        //     }
        //     else{
        //         g.clear()
        //     }
        

        // 2. Get the 2D context to draw the "Fader"
        const ctx = this.stage.canvas.getContext("2d");


        // 3. Calculate fade based on delta for frame-rate independence
        const fadeAlpha = Math.min(1,  (delta) / this.trailPersistence);

        // 4. Draw the fading rectangle
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
        ctx.fillRect(0, 0, this.stage.canvas.width, this.stage.canvas.height);
    }

    _addSingleCircle(index){
        let circle = new SingleCircle(
            0 , 0 + index * this.spacing, 
            this.circleRadius, 
            "white", 
            index);

        circle.setOnClicked(this.onClicked);
        this.addChild(circle);

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
        let maximumWidth  = this.stage.canvas.width
        // Safety: Only check width if the stage is ready
        if (this.stage && this.stage.canvas) {
            let maximumWidth = this.stage.canvas.width;
        // Use a dynamic reset point based on the circle size
            if (this.x > maximumWidth) {
                this.x = -(this.circleRadius * 4);
            }
        }
        
    }

    setIsMoving(toMove) {
        this.isMoving = toMove
    }

    update(delta){
        this.fader.graphics.command.fill = "rgba(0, 0, 0, 0.1)";
        if (this.isMoving){
            this.stage.autoClear = false
            
            
            this.processMovement(delta)
            this._handleTrail(delta)
            this.prevX = this.x

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