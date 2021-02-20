class Layer{

    constructor(level, color, height){
        this.level = level;
        this.color = color;
        this.height = height;

        this.objects = [];
    }

    randomPosNeg(x){
        return ((Math.random() * 2) - .5) * x
    }


    generateBuildings(){

        let current_x = 0;

        while(current_x < ctx.canvas.width){

            let next_x = current_x + this.randomPosNeg(building_spacing_variability);
            let next_y = this.height + this.randomPosNeg(building_size_variability);
            let next_w = building_width_average + this.randomPosNeg(building_width_variability);


            current_x = (next_w + next_x);
            this.objects.push(new Building(next_x, next_y, next_w))
        }

        this.setObjectColor();

    }

    generateClouds(){
        if(Math.random() < .7){
            let cloud = new Cloud(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height, 5 + Math.random() * 5, s.colors[2])
            this.objects.push(cloud);  
        }
    }

    show(){

        console.log(this.objects);
        for(let o of this.objects){
            o.show();
        }

    }

    setLayerColor(color){
        this.color = color;
    }

    setObjectColor(){
        for(let o of this.objects){
            o.setColor(this.color);
        }
    }

}