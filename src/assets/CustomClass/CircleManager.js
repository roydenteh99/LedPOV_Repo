import { touchRippleClasses } from "@mui/material";
import {Circle, Point} from "./geometry.js";
import {Shape,Shadow,Container} from "@createjs/easeljs";


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
        beginRadialGradientFill( // Create a gradient: Bright color in center -> Transparent version of color at edge
                [this.color, "rgba(0,0,0,0)"], [0.4, 1], 
                0, 0, 0, 
                0, 0, this.radius * 2
                )
            .dc(0, 0, this.radius * 2);
             this.compositeOperation = "lighter";

        
        
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
        stated_stage.addChild(this)
        this.onClicked = onClicked;
        this.isMoving = false;
        this.horizontalSpeed = 0;
        this.spacing = 0 ;
        this.circleRadius = 0;
        this.offset = [50, 50];
        this.trailPersistence = 500
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
        if (!this.stage || !this.stage.canvas) 
            return;

        // 1. Disable the automatic wipe
        this.stage.autoClear = false;

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
        if (this.isMoving){
            this._handleTrail(delta)
            this.processMovement(delta)
        }
        else {
            this.stage.autoClear = true
        }

    }


    destroy() {
        // Clean up listeners to prevent memory leaks
        this.removeAllChildren();
        this.circleContainer = [];
    }
}