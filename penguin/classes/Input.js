import { Vector2 } from "./Vector2.js";

export class Input{
    constructor(inputElement){
        this.keys_pressed = new Array();
        this.mouse_position = Vector2.ZERO;

        window.addEventListener("keydown", e => this.KeyDown(e));
        window.addEventListener("keyup", e => this.KeyUp(e));
        inputElement.addEventListener("mousemove", e =>  this.MouseMove(e));
        inputElement.addEventListener("mousedown", e =>  this.MouseDown(e));
        inputElement.addEventListener("mouseup", e =>  this.MouseUp(e));
        
    }
    KeyDown(e){
        if (!this.keys_pressed.includes(e.code)) this.keys_pressed.unshift(e.code);
    }
    KeyUp(e){
        let index = this.keys_pressed.indexOf(e.code);
        if (index > -1) this.keys_pressed.splice(index, 1);
    }
    MouseMove(e){
        var rect = e.target.getBoundingClientRect();
        var scale = canvas.width / parseFloat(rect.width);
        this.mouse_position = new Vector2(e.clientX - rect.left, e.clientY - rect.top).multiply(scale);
    }
    MouseDown(e){
        this.mouse_pressed = true;
    }
    MouseUp(e){
        this.mouse_pressed = false;
    }
}