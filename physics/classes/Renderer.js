import { PhysicsManager } from "./PhysicsManager.js";
import { Input } from "./Input.js";
export class Renderer {

    static canvas = null;
    static ctx = null;

    static spawnObject = null;

    static init(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    static render() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (const object of PhysicsManager.objects) {
            object.draw(this.ctx);
        }
        
        if (this.spawnObject){
            this.spawnObject.draw(this.ctx);
            this.spawnObject.position = Input.mouse_position;
        }
    }

}