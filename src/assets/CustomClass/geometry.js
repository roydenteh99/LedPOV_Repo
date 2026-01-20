export class Circle {
    #centrePoint; 
    #radius;

    static fromPoint(centrePoint, radius) {
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
    static fromCoords(x, y, radius) {
        let centrePoint = Point.create(x, y)
        return new Circle(centrePoint,radius)

    }

    constructor(centrePoint, radius) {
        this.#centrePoint = centrePoint;
        this.#radius = radius;
        // console.log("circle created")
    }

    isInside (point) {
        return (this.#centrePoint.distTo(point)) <= this.#radius;

    }

    move_x(x_increment) {
        this.#centrePoint.x += x_increment

    }

    set_x(x_value) {
        this.#centrePoint.x = x_value 
    }
    
    get x() {
        return this.#centrePoint.x;
    }

    get y() {
        return this.#centrePoint.y;
    }

    get radius() {
        return this.#radius;
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
    
    set x(value){
        this.#x = value
    }

    get x(){
        return this.#x;
    }
    
    get y(){
        return this.#y;
    }

    distTo(otherPoint) {
        if (!(otherPoint instanceof Point)) {
            console.warn("Invalid Point .Returning  0");
            return 0 ;
        }
        else {
            return Math.sqrt((this.#x - otherPoint.x)**2 + (this.#y - otherPoint.y)**2);

        }
        
    }

}

const p = new Point(3,4)
const y = new Point(4,5)
const circle =  Circle.fromPoint(Point.create(0,0),10)

console.log(circle.isInside(Point.create(20,20)))
// console.log(p.distTo(y))