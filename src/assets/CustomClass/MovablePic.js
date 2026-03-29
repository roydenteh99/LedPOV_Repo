import {Bitmap, Container, Shape} from "@createjs/easeljs";

export default class MovablePic extends Container{
    constructor(image , stateCallback) {
        super();
        this.image = image;
        this.stateCallback = stateCallback;
        
        const bitmap = new Bitmap(image);
        bitmap.name = "bitmap";
        bitmap.regX = image.width / 2;  // Centre the registration point for easier rotation
        bitmap.regY = image.height / 2; // Centre the registration point for easier rotation 
        bitmap.scale = 0.1;
        this.addChild(bitmap);

        const border = new Shape();
        border.name = "border";
        this.addChild(border);

        const cornerSquare = new Shape();
        cornerSquare.name = "cornerSquare";
        // cornerSquare.graphics.beginFill("blue").drawRect(-5, -5, 10, 10);
        this.addChild(cornerSquare);


        this.on("mousedown", function(evt){
            evt.currentTarget.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
            evt.stopPropagation();
            console.log("Image clicked!");
            stateCallback(true,this); // Update the state to indicate an image is selected and pass the movable
            this.drawBorder();
        });

        this.on("pressmove",function(evt) {
            // Calculate the new X and Y based on the mouse new position plus the offset.
            evt.currentTarget.x = evt.stageX + evt.currentTarget.offset.x;
            evt.currentTarget.y = evt.stageY + evt.currentTarget.offset.y;
            // make sure to redraw the stage to show the change:
            evt.currentTarget.stage.update();   
        });

        this.x = 0;
        this.y = 0;
    }

    resize(scale) {
        const bitmap = this.getChildByName("bitmap");
        const scaleChange = scale; // Simple scaling factor based on mouse movement
        bitmap.scaleX = scaleChange;
        bitmap.scaleY = scaleChange;
        this.drawBorder(); // Redraw border to fit new size
    }
    
    drawBorder() {
        const border = this.getChildByName("border");
        const bitmap = this.getChildByName("bitmap");
        const cornerSquare = this.getChildByName("cornerSquare");
        const bound = bitmap.getBounds();
        // console.log(bound)
        const width = bound.width * bitmap.scaleX;
        const height = bound.height * bitmap.scaleY;
        const cornerX = width / 2 
        const cornerY = height / 2 
        border.graphics.clear().setStrokeStyle(5).beginStroke("red").drawRect(-cornerX, -cornerY, width, height);
        
    }


    clearBorder() {
        const border = this.getChildByName("border");
        border.graphics.clear();
        const cornerSquare = this.getChildByName("cornerSquare");
        cornerSquare.graphics.clear();
    }

    

    static RawImageConstructor(rawImage , callback) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    resolve(new MovablePic(img , callback));
                };
            img.onerror = reject
        };
        
            reader.onerror = reject
            reader.readAsDataURL(rawImage);
        })}
}


// NOTE TO SELF event still propagate to main stage when click on the image, need to stop it and also need to make sure that the image is selected when click on it.