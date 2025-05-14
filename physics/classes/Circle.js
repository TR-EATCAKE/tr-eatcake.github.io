import { Shape } from './Shape.js';
export class Circle extends Shape{
    constructor(radius=1) {
        super();
        this.radius = radius;
    }
    draw(ctx) {
        if (!this.parent) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}