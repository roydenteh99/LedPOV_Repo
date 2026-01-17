export class Circle {
    #centrePoint; 
    #radius;

    static create(centrePoint, radius) {
        if (!(centrePoint instanceof Point)) {
            console.warn("Invalid centrePoint, please use Point.create(x,y) for centrePoint ")
            return null
        } else if (typeof radius !== "number") {
            console.warn("Invalid number for radius ")
            return null
        } else {
            return new Circle(centrePoint, radius)
        }

        }
    

    constructor(centrePoint, radius) {
        this.#centrePoint = centrePoint;
        this.#radius = radius;
        // console.log("circle created")
    }

    inSideCircle (point) {
        return (this.#centrePoint.distTo(point)) <= this.#radius;

    } 

}

export class Point {
    #x;
    #y;

    static create(x, y) {
        if (typeof x !== "number" || typeof y !== "number") {
            console.warn("Invalid Point coordinates. Use numbers.");
            return null;
        }
    return new Point(x, y);
    }

    constructor(x_coord ,y_coord) {

        this.#x= x_coord;
        this.#y= y_coord;
    }

    get x(){
        return this.#x;
    }
    
    get y(){
        return this.#y;
    }

    distTo(otherPoint) {
        if (typeof otherPoint instanceof Point) {
            console.warn("Invalid Point .Returning  0");
            return 0 ;
        }
        else {
            return Math.sqrt((this.#x - otherPoint.x)**2 + (this.#y - otherPoint.y)**2);

        }
        
    }

}

// const p = new Point(3,4)
// const y = new Point(4,5)
// const y =  Circle.create(Point.create(0,0),10)

// console.log(y.inSideCircle(Point.create(1,1)))
// // console.log(p.distTo(y))