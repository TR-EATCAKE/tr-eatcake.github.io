export class Shape{
    constructor(type, color="white"){
        this.color = color;
        this.type = type;
    }
    static CIRCLE = 0;
    static RECTANGLE = 1;
}

export class Circle extends Shape{
    constructor(radius=1, color) {
        super(Shape.CIRCLE, color);
        this.radius = radius;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class Rectangle extends Shape{
    
    constructor(size = new Vector2(1, 1), color) {
        super(Shape.RECTANGLE, color);
        this.width = size.x;
        this.height = size.y;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
    }
}