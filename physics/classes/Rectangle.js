import { Shape } from './Shape.js';
export class Rectangle extends Shape{
    constructor(width=1, height=1) {
        super();
        this.width = width;
        this.height = height;
    }
    draw(ctx) {
        if (!this.parent) return;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}