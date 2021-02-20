
/*
    <br>
    <p id="output" style="margin-bottom: 0px"> Slide To Adjust Generation Speed </p>
    <input id="timeSpeed" min="0" max="500" value="0" type="range">
*/ 



let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");

ctx.canvas.width  = window.innerWidth - 100;
ctx.canvas.height = window.innerHeight - 200;


let building_spacing_variability = 100; 
let building_start_height = 500; // 0 - 10
let building_size_variability = 50; // 0 - 100
let building_width_average = 100;
let building_width_variability = 20;

let color_seperation = 30; // Max: 360
let starting_hue = Math.random()*360;

let background_contrast = 30;
let sun_contrast = 40 + Math.random()*10;
let cloud_contrast = 20 + Math.random()*10;

let fence_population = 85;
let window_population = 75;
let chimney_population = 50;
let satellite_population = 2;
let stairwell_population = 30;
let slanted_roof_population = 10;

let layer_count = 12;
let time_of_day = 0; // 1: Morning, 2: Noon, 3: Sunset, 4:Midnight

let sun;
let s;

function setup(){ 
    generate();
}

function generate(){

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    starting_hue = Math.random()*360;
    s = new Scene();

    sun = new Sun(ctx.canvas.width - (Math.random() * ctx.canvas.width), ctx.canvas.height/(Math.random() * 10), 50 + Math.random() * 150, s.colors[1])

    ctx.fillStyle = s.colors[0];
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fill();

    sun.show();
    
    s.initLayers();
    s.show();
}

class Scene{

    constructor(){
        this.layers = [];

        this.colors = this.generateHslaColors(100, 50, 1, layer_count);
        console.log(this.colors)
        for(let i = 0; i < layer_count; i++){
            let starting_height = ctx.canvas.height - building_start_height;
            let increment = starting_height / (layer_count - 1);            
            let next_h = starting_height + (i * increment);

            let l = new Layer(i, this.colors[i+3], next_h)
            this.layers.push(l);
        }
    }

    initLayers(){
        for(let l of this.layers){
            
            l.generateBuildings();
            l.generateClouds();
        }
    }

    show(){
        for(let l of this.layers){
            l.show();
        }
    }

    generateHslaColors (saturation, lightness, alpha, amount) {
        let colors = []
        let huedelta = Math.trunc(color_seperation / amount)
        let hue = starting_hue;

        colors.push(`hsla(${hue},${saturation}%,${lightness+background_contrast}%,${alpha})`)
        colors.push(`hsla(${hue},${saturation}%,${lightness+sun_contrast}%,${alpha})`)
        colors.push(`hsla(${hue},${saturation}%,${lightness+cloud_contrast}%,${Math.random()})`)

        for (let i = 0; i < amount; i++) {
          hue += huedelta * Math.random()*2;
          lightness -= 20 * (1/amount)
          colors.push(`hsla(${hue},${saturation}%,${lightness}%,${alpha})`)
        }
        return colors
    }
}

class SceneObject{

    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    show(){}
}

class Feature extends SceneObject{
    constructor(x, y){
        super(x, y);
    }
}

class Cloud extends SceneObject{

    constructor(x, y, r, c){
        super(x, y);
        this.color = c;
        this.radius = r;
    }

    drawRoundRect(x, y){
        let x_off = 100 + Math.random() * 100;
        
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(x, y, this.radius, 0, 2 * Math.PI, false);
        ctx.rect(x, y-this.radius, x + x_off, (this.radius*2));
        ctx.arc(2 * x + x_off, y, this.radius, 0, 2 * Math.PI, false);
        ctx.closePath();

        ctx.fill();
    }

    show(){
        let y_off = 100 + Math.random() * 400;
        for(let i = 0; i < 3 + (Math.random()*2); i++){
            this.drawRoundRect(this.x + (Math.random() * 250)-175, ((2 * this.radius) * i) + (y_off))
        }  
    }

    setColor(color){
        this.color = color;
    }
}

class Sun extends SceneObject{

    constructor(x, y, r, c){
        super(x, y);
        this.r = r;
        this.color = c;
    }

    show(){
        ctx.beginPath();
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }
}
