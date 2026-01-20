import {Circle, Point} from "./geometry.js";
import {Shape,Shadow} from "@createjs/easeljs";



export class SingleCircle {

    static create(circle , color, id = 0){
        if (!(circle instanceof Circle)){
            console.warn("Argument not of Circle Class.");
            return null
        } else {
            return new SingleCircle(circle ,color, id);
        }

    }

    constructor(circle, color, id){
        this.circle = circle;
        this.color = color;
        this.onClicked = null;
        this._shape = new Shape()
        this._id = id;
        this._draw();
        this._shape.addEventListener("click", (evt) => {
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
    const g = this._shape.graphics.clear();
// Create a gradient: Bright color in center -> Transparent version of color at edge
    g.beginRadialGradientFill(
        [this.color, "rgba(0,0,0,0)"], [0.4, 1], 
        this.circle.x, this.circle.y, 0, 
        this.circle.x, this.circle.y, this.circle.radius * 2
    )
    .dc(this.circle.x, this.circle.y, this.circle.radius * 2);
        
    this._shape.compositeOperation = "lighter";
    }

    move_x(x_increment) {
        this.shape.x += x_increment;
        this.circle.move_x(x_increment);
    }



    destroy() {
    // This removes EVERY listener attached to this shape (click, mouseover, etc.)
        this._shape.removeAllEventListeners();
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

    get id() {
        return this._id

    }

    get shape() {
        return this._shape
    }

}

export class CircleManager {
    constructor(stage, onClicked = null){
        this.stage = stage
        this.circleContainer = []
        this.onClicked = onClicked
    }

    createColumnOfCircle(noOfCircle, spacing, circleRadius, offset = [50,50]) {
        for (let i = 0 ; i < noOfCircle ; i++) {
            let circle = SingleCircle.create(Circle.fromCoords(offset[0] , offset[1] + i*spacing, circleRadius), "white", i);
            circle.setOnClicked(this.onClicked);
            this.stage.addChild(circle.shape);
            this.circleContainer.push(circle);
        }

        
    }

    move_x(x_increment){
        this.circleContainer.forEach(
            (circle) => {circle.move_x(x_increment);}
        )
    }

    destroy() {
        // Clean up listeners to prevent memory leaks
        this.circleContainer.forEach(c => c.destroy());
        this.stage.removeAllChildren();
        this.stage.removeAllEventListeners();
        this.circleContainer = [];
    }


}