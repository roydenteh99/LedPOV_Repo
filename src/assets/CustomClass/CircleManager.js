import {Circle, Point} from "./geometry.js";
import {Shape,Shadow} from "@createjs/easeljs";


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

export class CircleManager {
    constructor(stage, onClicked = null){
        this.stage = stage
        this.circleContainer = []
        this.onClicked = onClicked
        this.moveLedState = false
        this.horizontalSpeed = 10
        this.spacing = 0
        this.circleRadius = 0
        this.offset = [50, 50];
    }

    createColumnOfCircle(noOfCircle, spacing, circleRadius, offset = [50,50]) {
        this.spacing = spacing
        this.circleRadius = circleRadius
        this.offset = offset;
        for (let i = 0 ; i < noOfCircle ; i++) {
            this._addSingleCircle(i)
        } 
    }

    _addSingleCircle(index){
        let circle = new SingleCircle(
            this.offset[0] , this.offset[1] + index* this.spacing, 
            this.circleRadius, 
            "white", 
            index);

        circle.setOnClicked(this.onClicked);
        this.stage.addChild(circle);
        this.circleContainer.push(circle);

    }

    adjust_circle(newNoOfCircle) {
        while (newNoOfCircle > this.circleContainer.length){
            this._addSingleCircle(this.circleContainer.length);
        }

        while (newNoOfCircle< this.circleContainer.length){
            this.stage.removeChild(this.circleContainer.pop())
        }
    } 

    set_x_speed(speed){
        this.horizontalSpeed = speed
    }


    move_x(x_increment){      
        this.circleContainer.forEach(
            (circle) => {
                if (circle.x > this.stage.canvas.width){
                    circle.set_x(-10);
                }
                else{
                circle.move_x(x_increment);}
            }
        )
    }

    set_moveLedState(toMove) {
        this.moveLedState = toMove
    }

    update(){
        if (this.moveLedState){
            this.move_x(this.horizontalSpeed)
        }
    }

    destroy() {
        // Clean up listeners to prevent memory leaks
        this.circleContainer.forEach(c => c.destroy());
        this.stage.removeAllChildren();
        this.stage.removeAllEventListeners();
        this.circleContainer = [];
    }
}