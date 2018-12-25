class Beam
{
    constructor(x1, y1, x2, y2){
        this.id = globalID++;
        this.type = "beam";
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    show(selected){
        if(selected){
            stroke(255, 0, 0);
        } else {
            stroke(255, 255, 0);
        }

        strokeWeight(3);
        line(this.x1 * drawScaleFactor,
            height - (this.y1 * drawScaleFactor),
            this.x2 * drawScaleFactor,
            height - (this.y2 * drawScaleFactor));
    }
}

class Support
{
    constructor(x, y, type, dir){
        this.id = globalID++;
        this.type = "support";
        this.support_type = type;
        this.x = x;
        this.y = y;
        this.dir = dir;
    }

    show(selected){
        if(selected){
            stroke(255, 0, 0);
        } else {
            stroke(255, 255, 0);
        }

        strokeWeight(3);
        fill(0, 0, 128);

        var angle = 0;
        if(this.dir == "dir_y_plus"){
            angle = 0;
        } else if(this.dir == "dir_y_minus"){
            angle = radians(180);
        } else if(this.dir == "dir_x_plus"){
            angle = radians(90);
        } else if(this.dir == "dir_x_minus"){
            angle = radians(270);
        }

        push();
        translate(this.x * drawScaleFactor, height - (this.y * drawScaleFactor));
        rotate(angle);
        if(this.support_type == "support_wrist"){
            triangle(  0,  0,
                      15, 25,
                     -15, 25);

            fill(0, 0, 128);
            ellipse(0, 0, 10);
        } else if(this.support_type == "support_trundle"){
            triangle( 0,  0,
                     10, 15,
                    -10, 15);

            fill(0, 0, 128);
            ellipse(0, 20, 10);
        }
        pop();
    }
}

class Load
{
    constructor(x, y, magnitude, angle){
        this.id = globalID++;
        this.type = "load";
        this.load_type = "force";
        this.x = x;
        this.y = y;
        this.magnitude = magnitude;
        this.angle = radians(-angle);
    }

    show(selected){
        if(selected){
            stroke(255, 0, 0);
            fill(255, 0, 0);
        } else {
            stroke(255, 255, 0);
            fill(255, 255, 0);
        }

        push();
        translate(this.x * drawScaleFactor, height - (this.y * drawScaleFactor));
        rotate(this.angle);
        strokeWeight(1);
        triangle(  0,  0,
                  10,  5,
                  10, -5);
        strokeWeight(3);
        line(0, 0, 100, 0);
        pop();
    }
}
