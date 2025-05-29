import { PhysicsManager } from "./classes/PhysicsManager.js";
import { PhysicsObject } from "./classes/PhysicsObject.js";
import { Vector2 } from "./classes/Vector2.js";
import { Shape, Circle, Rectangle } from "./classes/Shapes.js";
import { Input } from "./classes/Input.js";
import { Renderer } from "./classes/Renderer.js";
import { App } from "./classes/App.js"

var valueElapsedTime = 0;
var valueDeltaTime = 1 / 10;

var canvas = document.getElementById("canvas");
App.init(canvas);

var lastTime = performance.now();

function loop(currentTime){

    const deltaTime = (currentTime - lastTime) / 1000; // deltaTime in seconds
    lastTime = currentTime;

    App.update(deltaTime);
    Input.mousePressed = false;

    valueElapsedTime += deltaTime;
    while (valueElapsedTime >= valueDeltaTime) {
        updateValues(deltaTime);
        valueElapsedTime -= valueDeltaTime;
    }

    requestAnimationFrame(loop);

}

function updateValues(deltaTime){
    document.getElementById("fps").innerText = `${Math.round(1 / deltaTime)}`;
    document.getElementById("mouse").innerText = `${parseInt(Input.mouse_position.x)}, ${parseInt(Input.mouse_position.y)}`;
    document.getElementById("objectCount").innerText = `${PhysicsManager.objects.length}`;
    document.getElementById("totalKineticEnergy").innerText = parseInt(PhysicsManager.totalKineticEnergy);
    document.getElementById("totalPotentialEnergy").innerText = parseInt(PhysicsManager.totalPotentialEnergy);
    document.getElementById("totalEnergy").innerText = parseInt(PhysicsManager.totalKineticEnergy + PhysicsManager.totalPotentialEnergy);

    if (!Renderer.spawnObject){
        document.getElementById("objectShape").innerText = "None";
        document.getElementById("objectMass").innerText = "None";
        document.getElementById("objectBodyType").innerText = "None";
    }else{ 
        switch (Renderer.spawnObject.shape.type) {
            case Shape.CIRCLE:
                document.getElementById("objectShape").innerText = "Circle (Radius: " + Renderer.spawnObject.shape.radius + ")";
                break;
            case Shape.RECTANGLE:
                document.getElementById("objectShape").innerText = "Rectangle (Width: " + Renderer.spawnObject.shape.width + ", Height: " + Renderer.spawnObject.shape.height + ")";
                break;
            default:
                document.getElementById("objectShape").innerText = "Unknown";
        }

        document.getElementById("objectMass").innerText = `${Renderer.spawnObject.mass}`;
        document.getElementById("objectBodyType").innerText = `${Renderer.spawnObject.isDynamic ? "Dynamic" : "Static"}`;
    }
}

App.start();
requestAnimationFrame(loop);