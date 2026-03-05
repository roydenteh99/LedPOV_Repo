import {Shape} from "@createjs/easeljs";

export class Grid extends Shape {
    constructor(width, height, rowGap) {
        super();
        this.manualScale = 1;
        this.unitWidth = width;
        this.unitHeight = height;
        this.rowGap = rowGap;
        this.numberOfRow = 50
        this.on("added", () => this.drawGrid());
    }



    drawGrid() {
        this.graphics.clear().setStrokeStyle(1).beginStroke("red");

        // Pre-calculate scaled dimensions
        const h = this.unitHeight * this.manualScale;
        const g = this.rowGap * this.manualScale;
        const w = this.unitWidth * this.manualScale;
        
        // This is the "Magic Number": Height of the rectangle + the gap below it
        const stepY = h + g; 

        for (let i = 0; i < this.numberOfRow; i++) {
            // Calculate Y simply: Row index times the total step
            let y = i * stepY;
            
            // 1. Draw Horizontal Line (stretches across stage)
            this.graphics.moveTo(0, y).lineTo(this.stage.canvas.width, y);

            // 2. Draw Vertical Connectors
            if (i % 2 === 0) {
                let cols = this.stage.canvas.width / w;
                for (let j = 0; j <= cols; j++) {
                    let x = j * w;
                    
                    // START at current horizontal line
                    // END at exactly the next horizontal line's Y position
                    let nextY = (i + 1) * stepY; 
                    
                    this.graphics.moveTo(x, y).lineTo(x, nextY);
                }
            }
        }
    }

    readColour(startX,startY) {
            const ctx = this.stage.canvas.getContext("2d");
            const w = this.unitWidth * this.manualScale;
            const h = this.unitHeight * this.manualScale;
            const imageData = ctx.getImageData(startX, startY, w, h);
            return imageData.data;
    }

    blendColour(colourData){
        let r = 0, g = 0, b = 0, a = 0;
        for (let i = 0; i < colourData.length; i += 4) {
            r += colourData[i];     // Red
            g += colourData[i + 1]; // Green
            b += colourData[i + 2]; // Blue
            a += colourData[i + 3]; // Alpha
        }
        return {
            r: r / (colourData.length / 4),
            g: g / (colourData.length / 4),
            b: b / (colourData.length / 4),
            a: a / (colourData.length / 4)
        };
    }

    gridRasterisation() {
        this.graphics.clear(); // Clear previous grid lines
        for (let i = 0; i < this.numberOfRow; i++) {
            if (i % 2 !== 0) continue; // Only process even rows for connectors
            let y = i * (this.unitHeight * this.manualScale + this.rowGap * this.manualScale);
            for (let x = 0; x < this.stage.canvas.width; x += this.unitWidth * this.manualScale) {
                const colourData = this.readColour(x, y);
                const blendedColour = this.blendColour(colourData);
                // Here you can convert blendedColour to a format suitable for your LED display
                this.graphics
                .beginStroke(`rgba(${blendedColour.r}, ${blendedColour.g}, ${blendedColour.b}, ${blendedColour.a / 255})`)
                .setStrokeStyle(this.unitHeight * this.manualScale)
                .moveTo(x, y).lineTo(x + this.unitWidth * this.manualScale, y );
                
                // console.log(`Blended Color at (${x}, ${y}):`, blendedColour);
            }
            this.stage.update();
        }
    }

    changeScale (scale) {
        this.manualScale = scale;
        this.drawGrid();
        stage.update();
    }

}