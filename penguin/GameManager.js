import { Vector2 } from "./classes/Vector2.js";
import { Camera } from "./classes/Camera.js";
import { Input } from "./classes/Input.js";
import { Sprite } from "./classes/Sprite.js";
import { assets } from "./classes/Assets.js";
import { SpriteAnimation } from "./classes/SpriteAnimation.js";
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 360;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const SPEED = 125;

const input = new Input(canvas);
const camera = new Camera(CANVAS_WIDTH, CANVAS_HEIGHT);


var player = new Sprite({
    image: assets.images.penguin.image,
    frame_size: new Vector2(32, 32),
    h_frames: 4,
    v_frames: 8,
    position: new Vector2(100, 100)
})

player.velocity = Vector2.ZERO;

const idleAnimDown = new SpriteAnimation({
    frames: [0, 1, 2, 1, 0],
    duration: 1.5,
    playing: true,
    loop: true
})

const idleAnimUp = new SpriteAnimation({
    frames: [8, 9, 10, 9, 8],
    duration: 1.5,
    playing: true,
    loop: true
})

const idleAnimLeft = new SpriteAnimation({
    frames: [24, 25, 26, 25, 24],
    duration: 1.5,
    playing: true,
    loop: true
})

const idleAnimRight = new SpriteAnimation({
    frames: [16, 17, 18, 17, 16],
    duration: 1.5,
    playing: true,
    loop: true
})

const runAnimDown = new SpriteAnimation({
    frames: [4, 5, 4, 0, 6, 7, 6],
    duration: 0.5,
    playing: true,
    loop: true
})

const runAnimUp = new SpriteAnimation({
    frames: [12, 13, 12, 8, 14, 15, 14],
    duration: 0.5,
    playing: true,
    loop: true
})

const runAnimLeft = new SpriteAnimation({
    frames: [28, 29, 28, 24, 30, 31, 30],
    duration: 0.5,
    playing: true,
    loop: true
})

const runAnimRight = new SpriteAnimation({
    frames: [20, 21, 20, 16, 22, 23, 22],
    duration: 0.5,
    playing: true,
    loop: true
})


function Update(deltaTime){
    const direction = Vector2.ZERO;
    const lookingDirection = input.mouse_position.subtract(player.position.add(player.frame_size.divide(2)));

    if (input.keys_pressed.includes("KeyA")) direction.x -= 1;
    if (input.keys_pressed.includes("KeyD")) direction.x += 1;
    if (input.keys_pressed.includes("KeyW")) direction.y -= 1;
    if (input.keys_pressed.includes("KeyS")) direction.y += 1;

    if (direction.equalsTo(Vector2.ZERO)){
        //if (player.velocity.y > 0) player.setAnimation(idleAnimDown);
        //else if (player.velocity.y < 0) player.setAnimation(idleAnimUp);
        //else if (player.velocity.x > 0) player.setAnimation(idleAnimRight);
        //else if (player.velocity.x < 0) player.setAnimation(idleAnimLeft);

        if (Math.abs(lookingDirection.y) > Math.abs(lookingDirection.x)){
            if (lookingDirection.y > 0) player.setAnimation(idleAnimDown);
            else player.setAnimation(idleAnimUp);
        }else{
            if (lookingDirection.x > 0) player.setAnimation(idleAnimRight);
            else player.setAnimation(idleAnimLeft);
        }

        player.position = new Vector2(Math.round(player.position.x), Math.round(player.position.y));
    }else{

        if (direction.y > 0) player.setAnimation(runAnimDown);
        else if (direction.y < 0) player.setAnimation(runAnimUp);
        else if (direction.x > 0) player.setAnimation(runAnimRight);
        else if (direction.x < 0) player.setAnimation(runAnimLeft);

        //if (Math.abs(lookingDirection.y) > Math.abs(lookingDirection.x)){
        //    if (lookingDirection.y > 0) player.setAnimation(runAnimDown);
        //    else player.setAnimation(runAnimUp);
        //}else{
        //    if (lookingDirection.x > 0) player.setAnimation(runAnimRight);
        //    else player.setAnimation(runAnimLeft);
        //}

        player.velocity = direction.copy();
        player.velocity.length = SPEED * deltaTime
        player.position = (player.position.add(player.velocity));
    }
    


}   

function Draw(ctx, deltaTime){
    ctx.fillStyle = "pink"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    player.draw(ctx, deltaTime)
}


var lastTimeStamp = 0
function animate(timeStamp){
    const deltaTime = (timeStamp - lastTimeStamp) / 1000;
    lastTimeStamp = timeStamp;
    Update(deltaTime);
    Draw(ctx, deltaTime);
    requestAnimationFrame(animate)
}
requestAnimationFrame(animate);