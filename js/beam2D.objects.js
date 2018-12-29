class Beam
{
    constructor(id, x1, y1, x2, y2){
        this.id = id;
        this.type = "beam";
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    show(selected, scale){
        if(selected){
            stroke(255, 0, 0);
        } else {
            stroke(255, 255, 0);
        }

        strokeWeight(3);
        line(this.x1 * scale,
            height - (this.y1 * scale),
            this.x2 * scale,
            height - (this.y2 * scale));
    }
}

class Support
{
    constructor(id, x, y, type, dir){
        this.id = id;
        this.type = "support";
        this.support_type = type;
        this.x = x;
        this.y = y;
        this.dir = dir;
    }

    show(selected, scale){
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
        translate(this.x * scale, height - (this.y * scale));
        rotate(angle);
        if(this.support_type == "support_wrist"){
            fill(0, 0, 128);
            triangle( 0,  0,
                     10, 15,
                    -10, 15);

            line(0, 15, 15,  15);
            line(0, 15, -15, 15);
            strokeWeight(2);
            line(-10, 15, -15, 25);
            line( -5, 15, -10, 25);
            line(  0, 15,  -5, 25);
            line(  5, 15,   0, 25);
            line( 10, 15,   5, 25);
            line( 15, 15,  10, 25);
        } else if(this.support_type == "support_trundle"){
            triangle( 0,  0,
                     10, 15,
                    -10, 15);
            fill(0, 0, 128);
            ellipse(0, 20, 10);
            line(0, 25, 15,  25);
            line(0, 25, -15, 25);
            strokeWeight(2);
            line(-10, 25, -15, 35);
            line( -5, 25, -10, 35);
            line(  0, 25,  -5, 35);
            line(  5, 25,   0, 35);
            line( 10, 25,   5, 35);
            line( 15, 25,  10, 35);
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
    constructor(id, x1, y1, x2, y2, type, c_x1, c_y1, c_x2, c_y2){
        this.id = id;
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

    show(selected, scale){
        if(selected){
            stroke(255, 0, 0);
            fill(255, 0, 0);
        } else {
            stroke(0, 255, 0);
            fill(0, 255, 0);
        }

        push();
        translate(this.x1 * scale, height - (this.y1 * scale));

        if(this.load_type == "load_force"){
            var angle = Math.atan2(this.c_y1, this.c_x1);
            rotate(-angle);
            line(0, 0, 50, 0);
            triangle(  50, 0,
                       40,-3,
                       40, 3);
        } else if(this.load_type == "load_moment"){
            noFill();
            strokeWeight(3);
            if(this.c_x1 < 0) {
                arc(0, 0, 40, 40, radians(60), radians(300), OPEN);
                triangle(  20 * cos(radians(300)), 20 * sin(radians(300)),
                           20 * cos(radians(315)), 20 * sin(radians(315)),
                           23 * cos(radians(300)), 23 * sin(radians(300)));
            } else {
                arc(0, 0, 40, 40, radians(240), radians(120), OPEN);
                triangle(  20 * cos(radians(240)), 20 * sin(radians(240)),
                           20 * cos(radians(225)), 20 * sin(radians(225)),
                           23 * cos(radians(240)), 23 * sin(radians(240)));
            }
        } else if(this.load_type == "load_dist_const"){
            strokeWeight(3);
            var lenX = this.x2 - this.x1;

            if(this.c_y1 < 0){
                triangle(  10, -20,
                           20, -20,
                           15, -10 );
            } else {
                triangle(  10, -10,
                           20, -10,
                           15, -20 );
            }

            line(0, 0, 0, -30);
            line(0, -30, lenX * scale, -30);
            line(lenX * scale, -30, lenX * scale, 0);
        }
        pop();
    }
}
