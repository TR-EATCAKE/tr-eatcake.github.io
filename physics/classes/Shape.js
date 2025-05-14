export class Shape{
    constructor(color="white"){
        this.color = color;
        this.parent = null;
    }
    type = Shape.CIRCLE;
    static CIRCLE = 0;
    static RECTANGLE = 1;
}