import { Vector2 } from "./Vector2.js";

export class Input {
    static keys_pressed = [];
    static mouse_pressed = [];
    static mouse_position = new Vector2(0, 0);
    static mousePressed = false;
    static mouseDown = false;
    static mouseMove = false;
    

    static init(canvas) {
        window.addEventListener('keydown', (e) => {
            if (!this.keys_pressed.includes(e.code)) this.keys_pressed.unshift(e.code);
        });

        window.addEventListener('keyup', (e) => {
            let index = this.keys_pressed.indexOf(e.code);
            if (index > -1) this.keys_pressed.splice(index, 1);
        });

        canvas.addEventListener('mousemove', (e) => {
            var rect = e.target.getBoundingClientRect();
            var scale = canvas.width / parseFloat(rect.width);
            this.mouse_position = new Vector2(e.clientX - rect.left, e.clientY - rect.top).scaled(scale);
        });

        canvas.addEventListener('click', (e) => {
            this.mousePressed = true;
        });

        canvas.addEventListener('mousedown', (e) => {
            this.mouseDown = true;
        });

        canvas.addEventListener('mouseup', (e) => {
            this.mouseDown = false;
        });

        canvas.addEventListener('scroll', (e) => {
            
        });

    }
}