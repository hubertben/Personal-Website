let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");

const canvas_width = c.width;
const canvas_height = c.height;

let gravity = .6;

let fireworks = [];

let rendering_lock = true;
function pause() {
    rendering_lock = !rendering_lock;
    render();
}

function setup() {
    render();
}

function generateRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

function launch_firework() {
    let p = new Particle(generateRandomColor(), 25, 5, 15, 3, generateRandomColor(), 10, 5);
    fireworks.push(p);

}

function render() {
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    for (let fw of fireworks) {
        console.log(fireworks.length)
        if (fw.position_lock) {
            fireworks.splice(fw, 1);
        } else {
            fw.update();
        }

    }
    if (rendering_lock) {
        setTimeout(render, 30);
    }


}

class Particle {
    constructor(color, speed, size, child_density, child_size, child_color, child_speed, child_force) {
        this.color = color;
        this.size = size;
        this.speed = speed;

        this.x = Math.random() * canvas_width;
        this.y = canvas_height - 1;

        this.vel = new Vector2((Math.random() * 2) - 1, -speed);

        this.position_lock = false;

        this.children_particles = [0];
        this.child_density = child_density;
        this.child_color = child_color;
        this.child_speed = child_speed;
        this.child_force = child_force;
        this.child_size = child_size;


        this.lasty = canvas_height;
        this.first_render = true;

        this.decay = 1;
    }


    update() {

        this.x += this.vel.x;
        this.y += this.vel.y;
        this.vel.y += gravity;

        this.decay -= .01;

        let check_pl_children = 0;
        for (let c of this.children_particles) {
            if (c.position_lock) {
                check_pl_children += 1;
            }
        }

        if (check_pl_children === this.children_particles.length) {
            this.position_lock = true;
        } else {

            if (this.y > this.lasty + 5) {
                this.render_children();
            } else {
                this.render();
            }
            this.lasty = this.y;
        }
    }

    render() {
        ctx.beginPath();
        ctx.globalAlpha = this.decay;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    init_children() {
        this.children_particles = [];
        for (let chd = 0; chd < this.child_density; chd++) {
            this.children_particles.push(new ChildParticle(this.child_color, this.child_force, this.child_speed, this.child_size, this.x, this.y));
        }

        let range = this.child_density / 20;

        for (let chd = 0; chd < this.child_density; chd++) {
            this.children_particles[chd].vel.x = Math.cos(chd / (Math.PI * range)) * this.child_speed + Math.random() * 2;
            this.children_particles[chd].vel.y = Math.sin(chd / (Math.PI * range)) * this.child_speed + Math.random() * 2;
        }

        this.first_render = false;
    }

    render_children() {
        if (this.first_render) {
            this.init_children();
        }

        for (let c of this.children_particles) {
            if (c.position_lock) {
                this.children_particles.splice(c, 1);
            } else {
                c.update();
            }
        }
    }
}
class ChildParticle {

    constructor(color, force, speed, size, x, y) {
        this.color = color;
        this.force = force;
        this.speed = speed;
        this.size = size;

        this.vel = new Vector2(0, 0);

        this.position_lock = false;

        this.x = x;
        this.y = y;

        this.decay = 1;
    }


    update() {
        this.decay -= .01;
        this.x += this.vel.x;
        this.y += this.vel.y;
        this.vel.y += gravity;
        this.render();

        if (this.decay <= 0) {
            this.position_lock = true;
        }
    }

    render() {
        ctx.beginPath();
        ctx.globalAlpha = this.decay;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

}

class Vector2 {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}