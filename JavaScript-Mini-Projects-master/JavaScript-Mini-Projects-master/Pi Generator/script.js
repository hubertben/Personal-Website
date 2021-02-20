
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");

let width = c.width;
let height = c.height;

let speed = 0;
let radius = 200;

let x = width/2;
let y = height/2;

let totalPoints = 0;
let pointsInside = 0;

let newX = 0;
let newY = 0;

let running = true;

function pause() {
    running = !running; 
    if(running){
        draw();
    }
}

function draw() {

    if (running) {
        newPoint();
        display();
        setTimeout(draw, speed);
    }

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(newX, newY, .5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.arc(375, 375, 375, 0, 2 * Math.PI);
    ctx.stroke();
}

function display(){
    output.innerHTML = ((pointsInside / totalPoints) * 4).toFixed(13);
}

function newPoint(){
    newX = Math.random() * width;
    newY = Math.random() * height;

    if((Math.sqrt(Math.pow(newY - 375, 2) + Math.pow(newX - 375, 2))) <= 375){
        pointsInside++;
    }
    totalPoints++;
}


draw();
