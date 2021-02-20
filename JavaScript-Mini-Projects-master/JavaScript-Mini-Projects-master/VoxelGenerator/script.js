let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");

const width = c.width;
const height = c.height;

let size = 500;
let grid_size = 20;
let radius = 1;

let dim = 350;


let voxels = [];

let grid = [];
function setup() {

    for(let x = 0; x < width; x+=grid_size){
        for(let y = 0; y < width; y+=grid_size){
            grid.push(new Square(x, y));
        }
    }

    let range = size / 19.75896777;

    for (let i = 0; i < size; i++) {
        
        let x = width/2 + Math.cos(i / (Math.PI * range)) * dim;
        let y = height/2 + Math.sin(i / (Math.PI * range)) * dim;
        let v = new Voxel(x, y);
        voxels.push(v);
    }
    render();
}

function render_grid(){
    for(let x = 0; x < width; x+=grid_size){
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, x);
        ctx.lineTo(width, x);
        ctx.stroke();
    }
}

function render() {

    for(let v of voxels){
        let q = v.get_bounding_square();
        for(let s of grid){
            if(s.x === q[0] && s.y === q[1]){
                s.checked = true;
            }
        }
    }

    for(let s of grid){
        s.render();
    }
    render_grid();
    for(let v of voxels){
        v.render();
    }
}

class Voxel{

    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    render(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
    }

    get_bounding_square(){
        return [this.x - (this.x % grid_size), this.y - (this.y % grid_size)]
    }
}

class Square{

    constructor(x, y){
        this.x = x;
        this.y = y;
        this.checked = false;
    }

    render(){
        ctx.beginPath();
        ctx.rect(this.x, this.y, grid_size, grid_size);
        if(this.checked){
            ctx.fillStyle = 'red';
        }else{
            ctx.fillStyle = 'white';
        }
        ctx.fill();
    }
}