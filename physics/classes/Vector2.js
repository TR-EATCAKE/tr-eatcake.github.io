export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    get magnitude() {
        return Math.hypot(this.x, this.y);
    }
    set magnitude(newLength) {
        this.x *= newLength/length;
        this.y *= newLength/length;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
    substract(v) {
        this.x -= v.x;
        this.y -= v.y;
    }
    scale(n) {
        this.x *= n;
        this.y *= n;
    }
    scaled(n) {
        return new Vector2(this.x * n, this.y * n);
    }
    normalize() {
        if (this.magnitude == 0) return;
        this.x /= this.magnitude;
        this.y /= this.magnitude;
    }
    normalized() {
        if (this.magnitude == 0) return new Vector2(0, 0);
        return new Vector2(this.x / this.magnitude, this.y / this.magnitude);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
    static add(v1, v2) {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }
    static subtract(v1, v2) {
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }

}