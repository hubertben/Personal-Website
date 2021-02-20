let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");


const width = c.width;
const height = c.height;

let grav = .0000047;

let planets = [];
let draw_pos = false;
let timestep = 0;


function setup() {

    let j = -.605;
 
    for(let y = 0; y < 1; y++){
        planets.push(new Planet('Planet A', 5, 5, width/2, (y * 2), new Vector2(j, 0.07), 'blue'));
    }

    planets.push(new Planet('Sun', 3300, 100, width/2, height/2, new Vector2(0, 0), 'yellow'));
    
    directory();
    render();
}

function render(){

    ctx.clearRect(0,0,width,height);

    directory();

    for(let p of planets){
        if(p.name !== 'Sun'){
            p.update(planets, timestep);   
        }
        
        p.draw();
    }

    ctx.fillStyle = "white";
    ctx.font = "15px Arial";
    ctx.fillText(timestep, 20, 20); 
    timestep++;
    if(timestep < 10000){
        setTimeout(render, 20);
    }
}

function directory(){
    let direct = document.getElementById('direct');
    let planet_info = '';
    for(let p of planets){  
        planet_info += p.name + " [" + Math.floor(p.x) + "," +  Math.floor(p.y) + "]" + "<br>";
    }
    
    direct.innerHTML = planet_info;
}



class Planet{


    constructor(name, mass, radius, x, y, init_vel, texture){
        this.name = name;
        this.mass = mass;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.init_vel = init_vel;
        this.texture = texture;
        this.velocity = this.init_vel;
    }

    update_velocity(planets_list, timestep){

        for(let p of planets_list){
            if(p != this){   
                let t = new Vector2(this.x, this.y);
                let sqrDist = t.dist(p);
                let forceDir = t.two_point_uv_update(p)
                let force = forceDir.mult_components(grav * this.mass * p.mass);
                force = force.div_components(sqrDist);
                let acceleration  = force.div_components(this.mass);
                this.velocity = this.velocity.add_vector(acceleration.mult_components(timestep));
            }
        }

    }

    update_position(){      
        this.x += this.velocity.x * 5;
        this.y += this.velocity.y * 5; 
    }

  
    detect_collision(planets_list){
        for(let p of planets_list){
            if(p != this){         
                if(this.dist(p) <= this.radius + p.radius){
                    this.velocity = new Vector2(0, 0);
                    return true;
                } 
            }
        
        }
        return false;
    }

    

    dist(planet){
        return Math.sqrt(Math.pow(this.x - planet.x, 2) + Math.pow(this.y - planet.y, 2));
    }
    

    update(planets, timestep){
    	if(!this.detect_collision(planets)){
	        this.update_velocity(planets, timestep);
	        this.update_position(timestep);
	   	}
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.texture;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();

        if(draw_pos){
            ctx.font = "15px Arial";
            ctx.fillText("[" + Math.floor(this.x) + "," +  Math.floor(this.y) + "]", this.radius + this.x, this.radius + this.y); 
        }
    }
}


class Vector2{

    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    sqrMagnitude(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    dist(planet){
        return Math.sqrt(Math.pow(this.x - planet.x, 2) + Math.pow(this.y - planet.y, 2));
    }
    
    two_point_uv_update(planet){
        let denom = Math.sqrt(Math.pow(this.x - planet.x, 2) + Math.pow(this.y - planet.y, 2));
        return new Vector2(-(this.x - planet.x) / denom, -(this.y - planet.y) / denom);
    }

    mult_components(a){
        return new Vector2(this.x * a, this.y * a);
    }

    div_components(a){
        return new Vector2(this.x / a, this.y / a);
    }

    add_vector(v){
        return new Vector2(this.x + v.x, this.y + v.y);
    }

}