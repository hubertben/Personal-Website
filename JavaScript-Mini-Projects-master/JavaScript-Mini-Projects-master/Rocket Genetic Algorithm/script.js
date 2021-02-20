let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");

let disp = document.getElementById("disp");
let speedSlide = document.getElementById("inputSpeed");
let sizeSlide = document.getElementById("inputSize");
let locSlide = document.getElementById("inputLoc");

let t;
let amm = 10;

let speed;
speedSlide.oninput = function () {
    speed = 10;
    speed = speedSlide.value;
    speedOutput.innerHTML = speed;
}

sizeSlide.oninput = function () {
    amm = sizeSlide.value;
    size.innerHTML = amm;
    generation = 1;
    setup();
}

locSlide.oninput = function () {
    t.x = locSlide.value;
    loc.innerHTML = t.x;
}

let count = 0;
const time = 400;
const width = c.width;
const height = c.height;
let running = true;
let group = [];
let generation = 1;

ctx.globalAlpha = .4;

function refresh() {
    setup();
}
function setup() {
    group = [];
    generation = 1;
    t = new Target();
    for (let i = 0; i < amm; i++) {
        group.push(new Individual());
    }
    t.x = locSlide.value;
    update();
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let r of group) {
        r.show();
    }
    t.draw();

    ctx.fillStyle = "white"
    ctx.font = "80px Arial";
    ctx.fillText("Generation " + generation, width / 4, height / 2);
}

function update() {
    if (running) {
        draw();
        setTimeout(update, speed);
    }

    if (count >= time - 1) {
        breed();
        generation++;
        count = 0;
    }
    count++;
}


let pool = [];
function breed() {

    let maxfit = 0;
    for (let i = 0; i < group.length; i++) {
        if (group[i].dist > maxfit) {
            maxfit = group[i].dist;
        }
    }

    for (let i = 0; i < group.length; i++) {
        group[i].dist /= maxfit;
    }

    pool = [];
    for (let i = 0; i < group.length; i++) {
        let n = group[i].dist * 100;

        if (group[i].target_reached) {
            n *= 1.02;
            n *= group[i].completion_time + 1;
        }
        for (let j = 0; j < n; j++) {
            pool.push(group[i]);
        }
    }
    pick();
}

function pick() {

    let newPool = [];

    for (let g = 0; g < group.length; g++) {
        let A = pool[Math.floor(Math.random() * pool.length)].dna;
        let B = pool[Math.floor(Math.random() * pool.length)].dna;

        let C = A.merge(B);
        newPool.push(new Individual(C));
    }
    group = newPool;
}


class Individual {

    constructor(importDNA) {
        this.x = width / 2;
        this.y = height - 30;
        this.dist = 0;
        this.vel_x = 0;
        this.vel_y = 0;
        this.angle = 0;
        this.dna = new DNA();
        if (importDNA) {
            this.dna = importDNA;
        }

        this.completion_time = 0;
        this.w = 2;
        this.h = 10;
        this.crashed = false;
        this.target_reached = false;
    }

    update() {
        this.x += this.vel_x;
        this.y += this.vel_y;
        this.angle = Math.atan2(this.vel_y, this.vel_x);

        this.vel_x += this.dna.genes[count].x;
        this.vel_y += this.dna.genes[count].y;
    }

    show() {

        this.collision();
        if (!this.crashed) {
            this.completion_time = 1 / count;
            this.update();
        }

        ctx.save();
        ctx.translate((this.x) - (this.w / 2), (this.y) - (this.h / 2));
        ctx.fillStyle = "white";
        ctx.rotate(this.angle + (Math.PI / 2));
        ctx.fillRect(-(this.w / 2), -(this.h / 2), this.w, this.h);
        ctx.restore();
    }

    collision() {
        if (this.x <= 5 || this.x >= width || this.y <= 10 || this.y >= height) {
            this.crashed = true;
        }

        this.calc_dist();
        if (this.dist > .9) {
            this.crashed = true;
            this.target_reached = true;
        }
    }

    calc_dist() {
        this.dist = 1 / (Math.sqrt(Math.pow(this.y - t.y, 2) + Math.pow(this.x - t.x, 2)));
    }

}

class DNA {
    constructor() {
        this.genes = [];
        for (let i = 0; i < time; i++) {
            this.genes.push(new Vector());
        }
    }

    merge(partner) {
        let dna = [];
        for (let t = 0; t < this.genes.length; t++) {
            let m = Math.random();
            if (m < .5) {
                dna.push(this.genes[t]);
            } else {
                dna.push(partner.genes[t]);
            }
        }

        let w = new DNA();
        w.genes = dna;
        return w;
    }
}

class Vector {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.init();
    }

    init() {
        let s = 1;
        this.x = Math.random() * (s) - s / 2;
        this.y = Math.random() * (s) - s / 2;
    }
}

class Target {

    constructor() {
        this.x = width / 2;
        this.y = 200;
        this.r = 10;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
    }
}

setup();
