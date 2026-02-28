import {Bitmap, Container, Shape} from "@createjs/easeljs";

export default class MovablePic extends Container{
    constructor(image) {
        super();
        this.image = image;
        const bitmap = new Bitmap(image);
        bitmap.name = "bitmap";
        bitmap.regX = image.width / 2;  
        bitmap.regY = image.height / 2;
        bitmap.scale = 0.1;
        this.addChild(bitmap);

        const border = new Shape();
        border.name = "border";
        this.addChild(border);

        const cornerSquare = new Shape();
        cornerSquare.name = "cornerSquare";
        cornerSquare.graphics.beginFill("blue").drawRect(-5, -5, 10, 10);
        this.addChild(cornerSquare);

        
        this.on("mousedown", function(evt){
            evt.currentTarget.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
            console.log("Image clicked!");
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
    
    drawBorder() {
        const border = this.getChildByName("border");
        const bitmap = this.getChildByName("bitmap");
        const bound = bitmap.getBounds();
        // console.log(bound)
        const width = bound.width * bitmap.scaleX;
        const height = bound.height * bitmap.scaleY;
        border.graphics.clear().setStrokeStyle(5).beginStroke("red").drawRect(-width / 2, -height / 2, width, height);
    }

    clearBorder() {
        const border = this.getChildByName("border");
        border.graphics.clear();
    }

    

    static RawImageConstructor(rawImage) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    resolve(new MovablePic(img));
                };
            img.onerror = reject
        };
        
            reader.onerror = reject
            reader.readAsDataURL(rawImage);
        })}
}