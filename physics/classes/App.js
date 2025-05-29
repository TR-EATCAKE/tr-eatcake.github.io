import { PhysicsManager } from "./PhysicsManager.js";
import { PhysicsObject } from "./PhysicsObject.js";
import { Vector2 } from "./Vector2.js";
import { Shape, Circle, Rectangle } from "./Shapes.js";
import { Input } from "./Input.js";
import { Renderer } from "./Renderer.js";

export class App{

    static canvas = null;
    static ctx = null;

    static fixedElapsedTime = 0;
    static fixedDeltaTime = 1 / 144;

    static degubElapsedTime = 0;
    static debugDeltaTime = 1 / 5;

    static keyCooldown = 0;
    static keyCooldownMax = 0.15;
    static spawnCooldown = 0;
    static spawnCooldownMax = 0.3;

    static init(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        Input.init(this.canvas);
        Renderer.init(this.canvas, this.ctx);
    }

    static start(){

        var wall1 = PhysicsManager.addObject(new PhysicsObject(new Vector2(-25, this.canvas.height/2), 1, new Rectangle(new Vector2(50, this.canvas.width), "white"))); // Left wall
        var wall2 = PhysicsManager.addObject(new PhysicsObject(new Vector2(this.canvas.width + 25, this.canvas.height/2), 1, new Rectangle(new Vector2(50, this.canvas.width), "white"))); // Right wall
        var wall3 = PhysicsManager.addObject(new PhysicsObject(new Vector2(this.canvas.width/2, -25), 1, new Rectangle(new Vector2(this.canvas.width, 50), "white"))); // Top wall
        var wall4 = PhysicsManager.addObject(new PhysicsObject(new Vector2(this.canvas.width/2, this.canvas.height + 25), 1, new Rectangle(new Vector2(this.canvas.width, 50), "white"))); // Bottom wall

        wall1.setStatic();
        wall2.setStatic();
        wall3.setStatic();
        wall4.setStatic();
    }


    static update(deltaTime){

        this.getSpawnInput();

        this.fixedElapsedTime += deltaTime;
        this.degubElapsedTime += deltaTime;
        if (this.keyCooldown > 0) this.keyCooldown -= deltaTime;
        if (this.spawnCooldown > 0) this.spawnCooldown -= deltaTime;
        
        while (this.fixedElapsedTime >= this.fixedDeltaTime){
            this.fixedUpdate(this.fixedDeltaTime);
            this.fixedElapsedTime -= this.fixedDeltaTime;
        }

        //while (this.degubElapsedTime >= this.debugDeltaTime){
        //    this.printDebugInfo(deltaTime);
        //    this.degubElapsedTime -= this.debugDeltaTime;
        //}

        Renderer.render();
    }

    static fixedUpdate(fixedDeltaTime){
        PhysicsManager.update(fixedDeltaTime);
    }

    static getSpawnInput(){
        if (Input.keys_pressed.includes("KeyR") && this.keyCooldown <= 0){
            this.keyCooldown = this.keyCooldownMax;

            if (!Renderer.spawnObject || Renderer.spawnObject.shape.type != Shape.RECTANGLE) {
                Renderer.spawnObject = new PhysicsObject(Input.mouse_position, 5, new Rectangle(new Vector2(30, 30), "hsl(0, 100%, 75%)"));
            }else Renderer.spawnObject = null;
        }
        
        if (Input.keys_pressed.includes("KeyC") && this.keyCooldown <= 0){
            this.keyCooldown = this.keyCooldownMax;

            if (!Renderer.spawnObject || Renderer.spawnObject.shape.type != Shape.CIRCLE) {
                Renderer.spawnObject = new PhysicsObject(Input.mouse_position, 5, new Circle(15, "hsl(0, 100%, 75%)"));
            }else Renderer.spawnObject = null;
        }
        
        if (Input.keys_pressed.includes("ArrowUp") && this.keyCooldown <= 0 && Renderer.spawnObject != null) {
            this.keyCooldown = this.keyCooldownMax;
            switch (Renderer.spawnObject.shape.type) {
                case Shape.CIRCLE:
                    Renderer.spawnObject.shape.radius += 5;
                    break;
                case Shape.RECTANGLE:
                    Renderer.spawnObject.shape.height += 5;
                    break;
            }
        }
        
        if (Input.keys_pressed.includes("ArrowDown") && this.keyCooldown <= 0 && Renderer.spawnObject != null) {
            this.keyCooldown = this.keyCooldownMax;

            switch (Renderer.spawnObject.shape.type) {
                case Shape.CIRCLE:
                    Renderer.spawnObject.shape.radius = Math.max(5, Renderer.spawnObject.shape.radius - 5);
                    break;
                case Shape.RECTANGLE:
                    Renderer.spawnObject.shape.height = Math.max(5, Renderer.spawnObject.shape.height - 5);
                    break;
            }
        }
        
        if (Input.keys_pressed.includes("ArrowLeft") && this.keyCooldown <= 0 && Renderer.spawnObject != null) {
            this.keyCooldown = this.keyCooldownMax;

            switch (Renderer.spawnObject.shape.type) {
                case Shape.CIRCLE:
                    Renderer.spawnObject.shape.radius = Math.max(5, Renderer.spawnObject.shape.radius - 5);
                    break;
                case Shape.RECTANGLE:
                    Renderer.spawnObject.shape.width = Math.max(5, Renderer.spawnObject.shape.width - 5);
                    break;
            }
        }
        
        if (Input.keys_pressed.includes("ArrowRight") && this.keyCooldown <= 0 && Renderer.spawnObject != null) {
            this.keyCooldown = this.keyCooldownMax;

            switch (Renderer.spawnObject.shape.type) {
                case Shape.CIRCLE:
                    Renderer.spawnObject.shape.radius += 5;
                    break;
                case Shape.RECTANGLE:
                    Renderer.spawnObject.shape.width += 5;
                    break;
            }
        }
        
        if ((Input.keys_pressed.includes("NumpadAdd") || Input.keys_pressed.includes("Add")) && this.keyCooldown <= 0 && Renderer.spawnObject != null) {
            this.keyCooldown = this.keyCooldownMax;

            Renderer.spawnObject.mass += 5;
        }
        
        if ((Input.keys_pressed.includes("NumpadSubtract") || Input.keys_pressed.includes("Subtract")) && this.keyCooldown <= 0 && Renderer.spawnObject != null) {
            this.keyCooldown = this.keyCooldownMax;

            Renderer.spawnObject.mass = Math.max(5, Renderer.spawnObject.mass - 5);
        }
        
        if (Input.keys_pressed.includes("KeyS") && this.keyCooldown <= 0 && Renderer.spawnObject != null) {
            this.keyCooldown = this.keyCooldownMax;

            Renderer.spawnObject.isDynamic = !Renderer.spawnObject.isDynamic;
        }

        if (Input.mouseDown && Renderer.spawnObject != null && this.spawnCooldown <= 0) {
            this.spawnCooldown = this.spawnCooldownMax;

            var spawnObject = Renderer.spawnObject.copy;
            spawnObject.shape.color = "red";

            PhysicsManager.addObject(spawnObject);
        }
    }

    static printDebugInfo(deltaTime){
        console.log(
            "FPS: " + Math.round(1 / deltaTime) +
            "\nTotal Kinetic Energy: " + PhysicsManager.totalKineticEnergy +
            "\nTotal Potential Energy: " + PhysicsManager.totalPotentialEnergy +
            "\nTotal Energy: " + (PhysicsManager.totalKineticEnergy + PhysicsManager.totalPotentialEnergy) +
            "\nKeys Pressed: " + Input.keys_pressed +
            "\nMouse Down: " + Input.mouseDown +
            "\nMouse Position: " + Input.mouse_position
        );
    }
}