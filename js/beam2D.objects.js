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

    getLength() {
        return sqrt((this.x2 - this.x1) * (this.x2 - this.x1) + (this.y2 - this.y1) * (this.y2 - this.y1));
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
        } else if(this.support_type == "support_fixed"){
            line(0, 0, 15,  0);
            line(0, 0, -15, 0);
            strokeWeight(2);
            line(-10, 0, -15, 10);
            line( -5, 0, -10, 10);
            line(  0, 0,  -5, 10);
            line(  5, 0,   0, 10);
            line( 10, 0,   5, 10);
            line( 15, 0,  10, 10);
        }
        pop();
    }
}

class Load
{
    constructor(x1, y1, x2, y2, type, c_x1, c_y1, c_x2, c_y2){
        this.id = globalID++;
        this.type = "load";
        this.load_type = type;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.c_x1 = c_x1;
        this.c_y1 = c_y1;
        this.c_x2 = c_x2;
        this.c_y2 = c_y2;
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
        translate(this.x1 * drawScaleFactor, height - (this.y1 * drawScaleFactor));

        if(this.load_type == "load_force"){
            line(0, 0, this.c_x1, -this.c_y1);
        } if(this.load_type == "load_moment"){
            noFill();
            strokeWeight(3);
            if(this.c_x1 < 0) {
                arc(0, 0, 50, 50, PI, TWO_PI, OPEN);
            } else {
                arc(0, 0, 50, 50, 0, PI, OPEN);
            }
        }
        pop();
    }
}
