import { Vector2 } from "./classes/Vector2.js";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

let lastTime = performance.now();

function loop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000; // deltaTime in seconds
    lastTime = currentTime;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    console.log(deltaTime);

    requestAnimationFrame(loop);
}

//requestAnimationFrame(loop);