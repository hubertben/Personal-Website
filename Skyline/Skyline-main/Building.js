class Building extends SceneObject{

    constructor(x, y, w){
        super(x, y);
        this.w = w;
        this.color = '#000000';
    }

    setColor(color){
        this.color = color;
    }
    

    show(){
        ctx.beginPath();
        ctx.fillStyle = this.color
        let height = ctx.canvas.height - this.y;
        ctx.rect(this.x, this.y, this.w, height);
        ctx.fill();

        if(Math.random() < fence_population / 100){
            this.draw_top_fence();
        }

        if(Math.random() < window_population / 100){
            this.draw_windows();
        }

        if(Math.random() < chimney_population / 100){
            this.draw_chimney_pipes();
        }

        if(Math.random() < satellite_population / 100){
            this.draw_satellite();
        }

        if(Math.random() < stairwell_population / 100){
            this.draw_stairwell();
        }

        if(Math.random() < slanted_roof_population / 100){
            this.draw_slanted_roof();
        }
    }


    draw_windows(){
        ctx.beginPath();
        ctx.fillStyle = this.color
        let current_height = this.y + 5;
        while(current_height < ctx.canvas.height){
            let window_height = 30;
            let window_spacing = window_height + 10;

            if(Math.random() < .5){
                ctx.rect(this.x - 3, current_height, 5, window_height);
                ctx.rect(this.x + this.w - 2, current_height, 5, window_height);     
            }

            current_height += window_spacing;
        }
        ctx.fill();
    }

    draw_top_fence(){
        ctx.beginPath();
        ctx.fillStyle = this.color
        let current_height = this.y - 7;
        let x_start = Math.random() * 50;
        let x_end = (Math.random() * 100) + 20;
        while(true){
            if(x_end + x_start > this.w){
                x_end = (Math.random() * 100) + 20;
            }else{
                break;
            }
        }
        ctx.rect(this.x + x_start, current_height, x_end, 2);
        let rail_spacer = this.x + x_start + 1;
        while(rail_spacer < this.x + x_start + x_end - 1){
            ctx.rect(rail_spacer, current_height, 1, 8);
            rail_spacer += 4;
        }
        ctx.fill();
    }

    draw_chimney_pipes(){
        ctx.beginPath();
        ctx.fillStyle = this.color
        let x_start = Math.random() * this.w - 21;
        while(true){
            if(this.x + x_start < this.x){
                x_start = Math.random() * this.w - 21;
            }else{
                break;
            }
        }
        let x_draw = this.x + x_start;
        for(let i = 0; i < Math.random() * 3; i++){
            let h = Math.random()*30;
            ctx.rect(x_draw, this.y - h, 5, h + 1);
            x_draw += 8

        } 
        ctx.fill();
    }

    draw_chimney_pipes(){
        ctx.beginPath();
        ctx.fillStyle = this.color
        let x_start = Math.random() * this.w - 21;
        while(true){
            if(this.x + x_start < this.x){
                x_start = Math.random() * this.w - 21;
            }else{
                break;
            }
        }
        let x_draw = this.x + x_start;
        for(let i = 0; i < Math.random() * 3; i++){
            let h = Math.random()*30;
            ctx.rect(x_draw, this.y - h, 5, h + 1);
            x_draw += 8

        } 
        ctx.fill();
    }

    // Don't look at the function below... your eyes will bleed

    draw_satellite(){
        ctx.beginPath();

        let face = true;
        if(Math.random() < .5){
            face = false;
        }

        ctx.fillStyle = this.color
        ctx.strokeStyle = this.color

        let x_start = 20 + (Math.random() * (this.w - 30));
        while(true){
            if(this.x + x_start < this.x || this.x + x_start > this.x + this.w -20){
                x_start = 20 + (Math.random() * (this.w - 30));
            }else{
                break;
            }
        }
        if(face){
            ctx.arc(this.x + x_start, this.y - 20, 12, 1, Math.PI, false);

        }else{
            ctx.arc(this.x + x_start, this.y - 20, 12, 0, Math.PI-1, false);
        }
        ctx.moveTo(this.x + x_start, this.y);
        ctx.lineTo(0,0);
        ctx.closePath();
        ctx.fill();

        
        ctx.beginPath();

        if(face){
            ctx.moveTo(this.x + x_start-10, this.y-19);
            ctx.lineTo(this.x + x_start+3, this.y-25);
            ctx.moveTo(this.x + x_start+4, this.y-10);
            ctx.lineTo(this.x + x_start+3, this.y-25);     
            ctx.moveTo(this.x + x_start-7, this.y-10);
            ctx.lineTo(this.x + x_start, this.y-20);
        }else{
            ctx.moveTo(this.x + x_start+10, this.y-19);
            ctx.lineTo(this.x + x_start-3, this.y-25);
            ctx.moveTo(this.x + x_start-4, this.y-10);
            ctx.lineTo(this.x + x_start-3, this.y-25);
            ctx.moveTo(this.x + x_start+7, this.y-10);
            ctx.lineTo(this.x + x_start, this.y-20);   
        }

        ctx.closePath();
        ctx.stroke();
        
        ctx.beginPath();
        if(face){
            ctx.arc(this.x + x_start+3, this.y-25, 2, 0, 2 * Math.PI, false);
        }else{
            ctx.arc(this.x + x_start-3, this.y-25, 2, 0, 2 * Math.PI, false);
        }
        
        ctx.moveTo(this.x + x_start, this.y);
        ctx.lineTo(0,0);
        ctx.closePath();
        ctx.fill();


        ctx.beginPath();
        if(face){
            ctx.arc(this.x + x_start-7, this.y-7, 5, 0, 2 * Math.PI, false);
        }else{
            ctx.arc(this.x + x_start+7, this.y-7, 5, 0, 2 * Math.PI, false);
        }
        ctx.moveTo(this.x + x_start, this.y);
        ctx.lineTo(0,0);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();

        ctx.lineWidth = 5;
        if(face){
            ctx.moveTo(this.x + x_start-8, this.y-8);
            ctx.lineTo(this.x + x_start+3, this.y+7);
            ctx.moveTo(this.x + x_start-8, this.y-8);
            ctx.lineTo(this.x + x_start-20, this.y+3);     
        }else{
            ctx.moveTo(this.x + x_start+8, this.y-8);
            ctx.lineTo(this.x + x_start-3, this.y+7);
            ctx.moveTo(this.x + x_start+8, this.y-8);
            ctx.lineTo(this.x + x_start+20, this.y+3); 

        }
        ctx.closePath();
        ctx.stroke();
        ctx.lineWidth = 1;
    }

    draw_stairwell(){
        ctx.beginPath();  
        ctx.fillStyle = this.color
        let x_start = 20 + (Math.random() * (this.w - 30));
        while(true){
            if(this.x + x_start < this.x || this.x + x_start > this.x + this.w -30){
                x_start = 20 + (Math.random() * (this.w - 30));
            }else{
                break;
            }
        }
        let x_draw = this.x + x_start;  
        for(let i = 0; i < Math.random() * 2; i++){
            let h = 20+(Math.random()*10);
            ctx.rect(x_draw, this.y - h, 20, h + 1);
            x_draw += 8

        } 
        ctx.fill();
    }

    draw_slanted_roof(){
        ctx.beginPath();  
        ctx.fillStyle = this.color

        let face = true;
        if(Math.random() < .5){
            face = false;
        }

        let x_start = 20 + (Math.random() * (this.w - 30));
        while(true){
            if(this.x + x_start < this.x || this.x + x_start > this.x + this.w -30){
                x_start = 20 + (Math.random() * (this.w - 30));
            }else{
                break;
            }
        }
        
        let x_draw = this.x + x_start;   
        let h = 15+(Math.random()*10);
        ctx.rect(x_draw, this.y - h, 15, h + 1);  
        ctx.fill();

        ctx.beginPath();
        
        let slant = 10+(Math.random()*10);
        
        if(face){
            ctx.moveTo(this.x + x_start, this.y-h+1);
            ctx.lineTo(this.x + x_start, this.y-h-slant+1);
            ctx.lineTo(this.x + x_start + 15, this.y - h+1);
        }else{
            ctx.moveTo(this.x + x_start + 15, this.y-h+1);
            ctx.lineTo(this.x + x_start + 15, this.y-h-slant+1);
            ctx.lineTo(this.x + x_start, this.y - h+1);
        }
        ctx.closePath();
        ctx.fill();
    }
}