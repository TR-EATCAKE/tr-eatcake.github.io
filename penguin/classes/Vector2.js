export class Vector2{
    constructor(x=0, y=0){
        this.x = x;
        this.y = y;
    }
    get length(){
        return Math.hypot(this.x, this.y);
    }
    set length(l){
        if (this.length == 0) return Vector2.ZERO;
        let m = l/this.length
        this.x *= m;
        this.y *= m;
    }
    copy(){
        return new Vector2(this.x, this.y);
    }
    add(v){
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    subtract(v){
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    multiply(n){
        return new Vector2(this.x * n, this.y * n);
    }
    divide(n){
        return new Vector2(this.x / n, this.y / n);
    }
    normalize(){
        return new Vector2(this.x/this.length, this.y/this.length);
    }
    dot(v){
        return this.x * v.x + this.y * v.y;
    }
    equalsTo(v){
        return this.x == v.x && this.y == v.y;
    }
    static add(v1, v2){
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }
    static subtract(v1, v2){
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }
    static multiply(v1, n){
        return new Vector2(v.x * n, v.y * n);
    }
    static divide(v1, n){
        return new Vector2(v.x / n, v.y / n);
    }
    static get ZERO(){
        return new Vector2();
    }
    static get UP(){
        return new Vector2(0, -1);
    }
    static get DOWN(){
        return new Vector2(0, 1);
    }
    static get LEFT(){
        return new Vector2(-1, 0);
    }
    static get RIGHT(){
        return new Vector2(1, 0);
    }
}