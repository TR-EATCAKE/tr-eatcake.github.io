import { Vector2 } from "./Vector2.js";

export class Camera{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.position = Vector2.ZERO;
    }
}