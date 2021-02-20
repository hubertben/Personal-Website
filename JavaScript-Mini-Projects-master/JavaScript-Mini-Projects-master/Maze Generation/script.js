let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");

let slider = document.getElementById("timeSpeed");
var output = document.getElementById("output");

let pause_button = document.getElementById("pause");
let speed;

slider.oninput = function() {
    speed = slider.value;
    output.innerHTML = "Generation Speed : " + speed;
}

ctx.strokeStyle = "black";

let rows = 0;
let cols = 0;
let W = 10;
let grid = [];
let current;
let next;
let running = true;

let stack = [];

const width = c.width;
const height = c.height;

function pause() {
    running = !running;

    if(!running){
        pause_button.innerHTML = "Play";
    }else{
        pause_button.innerHTML = "Pause";
        generate();
    }
    
}

function step() {
    update();
    draw();
}

function refresh() {
    c = this.getRandomColor();
    ctx.clearRect(0, 0, width, height);
    grid = [];
    stack = [];
    setup();
}

function generate() {
    if (running) {
        step();
        setTimeout(generate, speed);
    }
};

function update() {
    next = current.checkNeighbors();
    if (next) {
        next.visited = true;
        stack.push(current);
        removeWalls(current, next);
        current = next;
    } else if (stack.length > 0) {
        current = stack.pop();
    }
}

function draw() {
    ctx.clearRect(0, 0, W, W);
    display_walls();
    if (stack.length > 0){
        ctx.fillStyle = "green";
        ctx.fillRect(current.i * W, current.j * W, W, W);
    }
}

function removeWalls(c, n) {

    let x = c.i - n.i;
    let y = c.j - n.j;

    if (x === -1) {
        c.walls[3] = false;
        n.walls[1] = false;

    } else if (x === 1) {
        c.walls[1] = false;
        n.walls[3] = false;
    }

    if (y === 1) {
        c.walls[0] = false;
        n.walls[2] = false;

    } else if (y === -1) {
        c.walls[2] = false;
        n.walls[0] = false;
    }
}

function setup() {

    cols = Math.floor(width / W);
    rows = Math.floor(height / W);

    this.grid = []

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            let cell = new Cell(i, j);
            grid.push(cell);
        }
    }

    current = grid[0];
    current.visited = true;
}


function display_walls() {
    for (let j = 0; j < grid.length; j++) {
        grid[j].drawWalls();
    }
}

function find_location(i, j) {
    if (i < 0 || j < 0 || i > cols - 1 || j > cols - 1) {
        return -1;
    }
    return i + (j * cols);
}


class Cell {

    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.walls = [true, true, true, true]; // T R B L
        this.visited = false;
        this.solved = false;
    }

    checkNeighbors() {
        let neighbors = [];

        let N = [grid[find_location(this.i, this.j - 1)], grid[find_location(this.i + 1, this.j)], grid[find_location(this.i, this.j + 1)], grid[find_location(this.i - 1, this.j)]];
        for (let i = 0; i < 4; i++) {
            if (N[i] && !N[i].visited) {
                neighbors.push(N[i]);
            }
        }
        if (neighbors.length > 0) {
            let r = Math.floor(Math.random() * Math.floor(neighbors.length)); 3
            return neighbors[r];
        } else {
            return undefined;
        }
    }


    drawWalls() {
        let x = (this.i * (W));
        let y = (this.j * (W));

        let wallCoords = [[x, y, x + W, y], [x, y, x, y + W], [x, y + W, x + W, y + W], [x + W, y, x + W, y + W]];

        ctx.beginPath();

        for (let i = 0; i < 4; i++) {

            if (this.visited) {
                if (this.walls[i]) {
                    ctx.moveTo(wallCoords[i][0], wallCoords[i][1]);
                    ctx.lineTo(wallCoords[i][2], wallCoords[i][3]);
                }
                ctx.lineWidth = 2;
                ctx.fillStyle = c;
                ctx.fillRect(x, y, W, W);
            }
        }
        ctx.strokeStyle = "black";
        ctx.closePath();
        ctx.stroke();
    }
}

c = this.getRandomColor();

function getRandomColor() {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
}
