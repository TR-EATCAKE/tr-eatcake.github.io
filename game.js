window.onload = function(){

    var users = document.getElementById("index");
    //var user = {x:200, y:400, mX: 147, mY: 25};
    console.log(users.users)

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var characterX = canvas.width/2;
    var characterY = canvas.height/2;
    var characterR = 15;
    var handR = 5;
    var mX;
    var mY;
    var vX = 0;
    var vY = 0;

    document.addEventListener("keydown", keyDownDedect);
    document.addEventListener("keyup", keyUpDedect);
    canvas.addEventListener("mousemove", MousePos);

    var Update = setInterval(update, 1000/50);

    function MousePos(event){
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        var mouseX = event.clientX - rect.left - root.scrollLeft;
        var mouseY = event.clientY - rect.top - root.scrollTop;
        mX = mouseX;
        mY = mouseY;
    }

    function keyDownDedect (event){
        if (event.keyCode == 87){ // W
            vY = -2;
        }else if (event.keyCode == 83){ // S
            vY = 2;
        }else if (event.keyCode == 65){ // A
            vX = -2;
        }else if (event.keyCode == 68){ // D
            vX = 2;
        }
    }

    function keyUpDedect(event){
        if (event.keyCode == 87){ // W
            vY = 0;
        }else if (event.keyCode == 83){ // S
            vY = 0;
        }else if (event.keyCode == 65){ // A
            vX = 0;
        }else if (event.keyCode == 68){ // D
            vX = 0;
        }
    }

    function mainMenu(){
        Rect(0, 0, canvas.width, canvas.height, "#32a852")
    }

    function update(){ 

        if (globalThis.users) console.log(globalThis.users);

        if (characterX - characterR + vX <= 0) vX = -(characterX - characterR);
        if (characterX + characterR + vX >= canvas.width) vX = canvas.width - (characterX + characterR);
        if (characterY - characterR + vY <= 0) vY = -(characterY - characterR);
        if (characterY + + characterR + vY >= canvas.height) vY = canvas.height - (characterY + characterR)
        characterX = characterX + vX;
        characterY = characterY + vY;

        Rect(0, 0, canvas.width, canvas.height, "#32a852");
        drawCharacter(characterX, characterY);

    }

    function drawCharacter(x, y){
        Circle(x, y, characterR, "#fad5be");
        if (mX >= characterX + characterR){ // sağ taraf
            if (mY >= characterY + characterR){ // sağ alt
                Circle(x + characterR + handR, y, handR, "#fad5be");
                Circle(x, y + characterR + handR, handR, "#fad5be");
            }else if (mY < characterY - characterR){ // sağ üst
                Circle(x + characterR + handR, y, handR, "#fad5be");
                Circle(x, y - characterR - handR, handR, "#fad5be");
            }else{ // sağ
                Circle(x + characterR/2 + handR, y - characterR/2 - handR - 3, handR, "#fad5be");
                Circle(x + characterR/2 + handR, y + characterR/2 + handR + 3, handR, "#fad5be");
            }
        }else if (mX < characterX - characterR){ // sol taraf
            if (mY >= characterY + characterR){ // sol alt
                Circle(x - characterR - handR, y, handR, "#fad5be");
                Circle(x, y + characterR + handR, handR, "#fad5be");
            }else if (mY < characterY - characterR){ // sol üst
                Circle(x - characterR - handR, y, handR, "#fad5be");
                Circle(x, y - characterR - handR, handR, "#fad5be");
            }else{ // sol
                Circle(x - characterR/2 - handR, y + characterR/2 + handR + 3, handR, "#fad5be");
                Circle(x - characterR/2 - handR, y - characterR/2 - handR - 3, handR, "#fad5be");

            }
        }else{
            if (mY >= characterY){ // alt
                Circle(x + characterR/2 + handR + 3, y + characterR/2 + handR, handR, "#fad5be");
                Circle(x - characterR/2 - handR - 3, y + characterR/2 + handR, handR, "#fad5be");
            }else{ // üst
                Circle(x - characterR/2 - handR - 3, y - characterR/2 - handR, handR, "#fad5be");
                Circle(x + characterR/2 + handR + 3, y - characterR/2 - handR, handR, "#fad5be");
            }
        }
    }

    function Rect(x, y, w, h, c){
        ctx.fillStyle = c;
        ctx.fillRect(x, y, w, h);
    }

    function Circle(x, y, r, c){
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }

}