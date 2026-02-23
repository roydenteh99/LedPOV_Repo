import {Bitmap} from "@createjs/easeljs";

export default class MovablePic extends Bitmap {
    constructor(image) {
        super(image);
        this.on("mousedown", function(evt){
            evt.currentTarget.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
            console.log("Image clicked!");
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
        this.scale = 0.1
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