var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "black";

var mouseX;
var mouseY;

var FPS = 60;

var objectY = -100;
var objects = [];
var objectVY = 5;

var basketW = 112;
var basketH = 75;
var basketX = canvas.width/2 - basketW/2;
var basketY = canvas.height - basketH - 10;
var basketVX = 0;
var basketSlippery = 1.5;

var stoppedDirection = "none";

var score = 0;
var wrong = 0;

var gameStart = false;

var basketImg = new Image();
basketImg.src = "./imgs/basket.png";

var objectImgs = [];
var loaded = 0;

var appleImg = new Image();
appleImg.src = "./imgs/apple.png";
objectImgs.push(appleImg)

var bombImg = new Image();
bombImg.src = "./imgs/bomb.png";
objectImgs.push(bombImg);

var gameObjects = [
    {
        name: "apple",
        img: appleImg,
        x: null,
        y: objectY,
        width: 34,
        height: 38,
        kind: "good"
    },
    {
        name: "bomb",
        img: bombImg,
        x: null,
        y: objectY,
        width: 48,
        height: 39,
        kind: "bad"
    }
];

for (var i = 0; i < objectImgs.length; i++){
    objectImgs[i].onload = function(){
        loaded ++;
    }
}

window.onload = function(){

    function loadImages(){

        if (loaded < objectImgs.length) return loadImages();

        mainMenu();

    }
    
    function move(){


        if (objects.length === 0){
            addObject();
        }

        if (objects[objects.length - 1].y > basketY){
            if (objects[objects.length - 1].x >= basketX && objects[objects.length - 1].x + objects[objects.length - 1].width <= basketX + basketW){
                if (objects[objects.length - 1].kind === "bad"){
                    wrong ++;
                    console.log("-")
                }else{
                    score ++;
                    console.log("+")
                }
                objects.pop();
            }
        }

        if (objects[objects.length - 1].y >= canvas.height){
            if (objects[objects.length - 1].kind === "good"){
                wrong ++;
                console.log("-")
            }
            objects.pop();
        }
            if (objects[0].y + objects[0].height >= 300 && objects.length < 3) addObject();
        
        
        for (var i = 0; i < objects.length; i++){
            objects[i].y = objects[i].y + objectVY;
        }

        if (basketX + basketVX + basketW >= canvas.width){
            stoppedDirection = "right";
            basketVX = 0;
            basketX = canvas.width - basketW;
        }else if (basketX + basketVX <= 0){
            stoppedDirection = "left";
            basketVX = 0;
            basketX = 0;
        }else{
            stoppedDirection = "none";
        }
        
        basketX = basketX + basketVX;

    }

    function draw(){
        drawRect(0, 0, canvas.width, canvas.height, "#40dbc7");
        for (var i = 0; i < objects.length; i++){
            ctx.drawImage(objects[i].img, objects[i].x, objects[i].y, objects[i].width, objects[i].height);
        }
        ctx.drawImage(basketImg, basketX, basketY, basketW, basketH);
    }

    function mainMenu(){

        document.addEventListener("keydown", keyDown);
        document.addEventListener("keyup", keyUp);
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mousedown", mouseDown);

        function keyDown(e){
            if (!gameStart) return;

            if (e.keyCode == 37 || e.keyCode == 65){
                if (stoppedDirection === "left") return;
                if (basketVX >= -7) basketVX -= basketSlippery;
            }else if (e.keyCode == 39 || e.keyCode == 68){
                if (stoppedDirection === "right") return;
                if (basketVX <= 7) basketVX += basketSlippery;
            }
        };

        function keyUp(e){
            if (!gameStart) return;

            if (e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 65 || e.keyCode == 68){
            
                if (basketVX > 0){
                    basketVX -= basketSlippery;
                }else if (basketVX < 0){
                    basketVX += basketSlippery;
                }
            
                if (basketVX !== 0) setTimeout(function(){
                    keyUp(e);
                }, 175);

            }
        }

        function mouseMove(e){
            var rect = canvas.getBoundingClientRect();
            var root = document.documentElement;
            mouseX = e.clientX - rect.left - root.scrollLeft;
            mouseY = e.clientY - rect.top - root.scrollTop;
            if (!gameStart){
                if (canvas.width/2 - 100 + 200 > mouseX && mouseX > canvas.width/2 - 100 && 390 + 65 > mouseY && mouseY > 390){
                    drawRect(canvas.width/2 - 100, 390, 200, 65, "#706464");
                }else{
                    drawRect(canvas.width/2 - 100, 390, 200, 65, "#8b8f89");
                }
            }
        };

        function mouseDown(e){
            if (canvas.width/2 - 100 + 200 > mouseX && mouseX > canvas.width/2 - 100 && 390 + 65 > mouseY && mouseY > 390){
                if (gameStart) return;
                startGame();
            }
        };

        drawRect(0, 0, canvas.width, canvas.height, "#e33939");
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.font = "50px Arial";
        ctx.fillText("Test Oyunu", canvas.width/2, 230);
        drawRect(canvas.width/2 - 100, 390, 200, 65, "#8b8f89");
    }

    function startGame(){
        gameStart = true;
        var update = setInterval(function(){
            move();
            draw();
        }, 1000/FPS);
    }

    function addObject(){

        var xCoords = [];
        
        for (var i = 10; i < canvas.width - 50; i++){
            xCoords.push(i);
        }

        var gameObject = Object.create(random(gameObjects));

        gameObject.x = random(xCoords);

        objects.unshift(gameObject);
    
    }

    function random(array){
        return array[Math.floor(Math.random() * array.length)];
    }

    function lose(){
        clearInterval(update);
        alert("gaybettin");
    }

    function drawRect(x, y, w, h, c){
        ctx.fillStyle = c;
        ctx.fillRect(x, y, w, h);
    }

    function drawCircle(x, y, r, c){
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2);
        ctx.fill();
    }

    loadImages();

}