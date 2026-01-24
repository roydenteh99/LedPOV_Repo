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
        // Create a circle with glowEffect: Bright color in center -> Transparent version of color at edge
        this.graphics.
        clear().
        beginFill("white").
        dc(0, 0, this.radius );

        // this.drawTrail(100,0)

        




    }


    drawTrail(length, colorArray) {
        // this.graphics.beginLinearGradientFill(
        //         [this.color, "rgba(0,0,0,0)"], // Colors
        //         [0.5, 1], 0, 0,-length, 0).                     // End point (at the end of the trail)
        //     drawRoundRectComplex(-length , -this.radius, length  ,this.radius * 2 ,this.radius ,0  ,0,this.radius)
        const coreWeight = this.radius * 2;
        this.graphics.setStrokeStyle(coreWeight, "round")
        .beginLinearGradientStroke(
        [this.color, "rgba(255,255,255,0)"], 
        [0.4,1], 
        0, 0, 
        -length * 0.5, 0)
        .moveTo(0, 0)
        .lineTo(-length, 0)
        .endStroke();



    //     // 2. Draw the "Core Capsule" (The bright center)
    // // This makes the center of the capsule look like a solid light source
    // this.graphics.setStrokeStyle(this.radius * 2, "round")
    //     .beginLinearGradientStroke(
    //         ["white", this.color], 
    //         [0, 0.8], 
    //         0, 0, 
    //         -length * 0.5, 0
    //     )
    //     .moveTo(0, 0)
    //     .lineTo(-length * 0.5, 0)
    //     .endStroke();


    }

    // move_x(x_increment) {
    //     this.x += x_increment
    // }

    // set_x(x_value) {
    //     this.x = x_value
    // }

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
        
        this.compositeOperation = "lighter";
        this.onClicked = onClicked;
        this.isMoving = false;
        this.horizontalSpeed = 0;
        this.spacing = 0 ;
        this.circleRadius = 0;
        this.offset = [50, 50];
        this.trailPersistence = 200
        this.prevX = null
        
        
        
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
    _handleTrail(delta ,ctx = null , offset = [0,0] ) {
        this.children.forEach(element => {
            element.drawTrail(this.horizontalSpeed *1)
            
        });
    }


    _addSingleCircle(index){
        let circle = new SingleCircle(
            0 , 0 + index * this.spacing, 
            this.circleRadius, 
            "white", 
            index);

        circle.setOnClicked(this.onClicked);
        this.addChildAt(circle, index);

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
            
            this.processMovement(delta)
            this._handleTrail(delta)
            
            this.prevX = this.x
        }

    }


    destroy() {
        // Clean up listeners to prevent memory leaks
        this.removeAllChildren();
        this.circleContainer = [];
    }
}