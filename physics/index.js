import { PhysicsManager } from "./classes/PhysicsManager.js";
import { PhysicsObject } from "./classes/PhysicsObject.js";
import { Vector2 } from "./classes/Vector2.js";
import { Shape, Circle, Rectangle } from "./classes/Shapes.js";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


for (let i = 0; i < 150; i++) {
    const radius = Math.random() * 10 + 10;
    const x = Math.random() * (canvas.width - 2*radius) + radius;
    const y = Math.random() * (canvas.height - 2*radius) + radius;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    const circle = new PhysicsObject(new Vector2(x, y), 1, new Circle(radius, color));
    circle.velocity = new Vector2(Math.random() * 400 - 100, Math.random() * 400 - 100);
    PhysicsManager.addObject(circle);
}

let lastTime = performance.now()
function loop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000; // deltaTime in seconds
    
    lastTime = currentTime;
    PhysicsManager.update(deltaTime);

    console.log(
        "FPS: " + Math.round(1 / deltaTime) +
        "\nTotal Kinetic Energy: " + PhysicsManager.totalKineticEnergy
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < PhysicsManager.objects.length; i++) {
        const object = PhysicsManager.objects[i];
        object.draw(ctx);
    }

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
    