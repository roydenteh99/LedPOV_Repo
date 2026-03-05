import {Bitmap, Container, Shape} from "@createjs/easeljs";

export default class MovablePic extends Container{
    constructor(image) {
        super();
        this.image = image;
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

        const corners = ["TL", "TR", "BL", "BR"].map(pos => {
            const corner = new Shape();
            corner.name = pos;
            this.addChild(corner);
            return corner;
        });

        
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

                // Corner square logic — must be added AFTER container listeners
        cornerSquare.on("mousedown", function (evt) {
            evt.stopPropagation(); // Prevents the container's mousedown from firing
            console.log("Corner clicked! Handle resize here.");
            // Store resize origin data on the target
            evt.currentTarget._resizeStart = {
                stageX: evt.stageX,
                stageY: evt.stageY,
            };
        });

        cornerSquare.on("pressmove", function (evt) {
            evt.stopPropagation(); // Prevents the container's pressmove from firing
            const delta = {
                x: evt.stageX - evt.currentTarget._resizeStart.stageX,
                y: evt.stageY - evt.currentTarget._resizeStart.stageY,
            };
            console.log("Resizing delta:", delta);
            // TODO: use delta to scale the bitmap
        })

        this.x = 0;
        this.y = 0;
        
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
        // border.graphics.clear().setStrokeStyle(5).beginStroke("red").drawRect(-cornerX, -cornerY, width, height);
        // cornerSquare.graphics.clear().beginFill("blue")
        // .drawRect(-(cornerX + 15 ), -(cornerY + 15), 10, 10)
        // .drawRect(cornerX + 5, -(cornerY + 15), 10, 10)
        // .drawRect(-(cornerX + 15), cornerY + 5, 10, 10)
        // .drawRect(cornerX + 5, cornerY + 5, 10, 10);
    }

    clearBorder() {
        const border = this.getChildByName("border");
        border.graphics.clear();
        const cornerSquare = this.getChildByName("cornerSquare");
        cornerSquare.graphics.clear();
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