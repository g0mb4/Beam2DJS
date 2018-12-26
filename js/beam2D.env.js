class Beam2DEnvironment{
    constructor(w, h){
        this.canvas = createCanvas(w, h);
        this.canvas.parent('canvas');   // add to HTML div

        this.objects = [];
        this.points = [];

        this.objectID = 0;
        this.selectedID = null;

        this.drawScaleFactor = 200;

        this.v = [];
        this.phi = [];
    }

    show(){
        background(0, 0, 128);
        translate(40, -80);

        for (var i = 0; i < this.objects.length; i++){
            if(this.objects[i].type == "beam"){
                this.objects[i].show(false, this.drawScaleFactor);
            }
        }

        for (var i = 0; i < this.objects.length; i++){
            if(this.objects[i].type == "support"){
                this.objects[i].show(false, this.drawScaleFactor);
            }
        }

        for (var i = 0; i < this.objects.length; i++){
            if(this.objects[i].type == "load"){
                this.objects[i].show(false, this.drawScaleFactor);
            }
        }

        if(this.selectedID != null){
            for (var i = 0; i < this.objects.length; i++){
                if(this.objects[i].id == this.selectedID){
                    this.objects[i].show(true, this.drawScaleFactor);
                    break;
                }
            }
        }

        fill(255, 255, 0);
        textSize(14);
        textAlign(CENTER);
        strokeWeight(1);
        for (var i = 0; i < this.points.length; i++){
            var p = this.points[i];

            text('(' + i + ')', p.x * this.drawScaleFactor, height + 70 - (p.y * this.drawScaleFactor));
        }
    }

    addObject(o){
        o.id = this.objectID++;
        this.objects.push(o);

        if(o.type == "beam"){
            this.updatePoints();
        }
    }

    delObjectID(id){
        for (var i = this.objects.length - 1 ; i >= 0 ; i--){
            if(this.objects[i].id == id){
                this.objects.splice(i, 1);
            }
        }
    }

    delObjectType(type){
        for (var i = this.objects.length - 1 ; i >= 0 ; i--){
            if(this.objects[i].type == type){
                this.objects.splice(i, 1);
            }
        }

        if(type == "beam"){
            this.updatePoints();
        }
    }

    getObjectsSize(){
        return this.objects.length;
    }

    getObjectIndex(index){
        if(index >= this.objects.length){
            return null;
        } else {
            return this.objects[index];
        }
    }

    updateSelectedID(id){
        this.selectedID = id;
    }

    updatePoints(){
        var os = this.objects.slice();  // copy array by value
        /* sort points of beam based on the distance to (0, 0)*/
        os.sort(function(a, b){
            if(a.type == "beam" && b.type == "beam"){
                d1 = sqrt((a.x1) * (a.x1) + (a.y1) * (a.y1));
                d2 = sqrt((b.x1) * (b.x1) + (b.y1) * (b.y1));

                return d1-d2;
            } else {
                return 0;
            }
        });

        /* add every unique point to the array */
        this.points = [];
        for(var i = 0; i < os.length; i++){
            if(os[i].type == "beam"){
                var p1 = { x: os[i].x1, y: os[i].y1 };
                var p2 = { x: os[i].x2, y: os[i].y2 };

                var p1Found = false, p2Found = false;
                for(var j = 0; j < this.points.length; j++){
                    if(this.points[j].x == p1.x && this.points[j].y == p1.y){
                        p1Found = true;
                    }

                    if(this.points[j].x == p2.x && this.points[j].y == p2.y){
                        p2Found = true;
                    }
                }

                if(p1Found == false){
                    this.points.push(p1);
                }

                if(p2Found == false){
                    this.points.push(p2);
                }
            }
        }
    }

    getDrawScale(){
        return this.drawScaleFactor;
    }

    setDrawScale(s){
        this.drawScaleFactor = s;
    }

    getPointsSize(){
        return this.points.length;
    }

    getPoint(index){
        if(index >= this.points.length){
            return null;
        } else {
            return this.points[index];
        }
    }

    drawCharts(){
        google.charts.load('current', {'packages':['corechart']});

        var vData = [["x", "v"]];
        for(var i = 0; i < this.v.length; i++){
            vData.push([this.v[i].x, this.v[i].v]);
        }

        var vChartData = google.visualization.arrayToDataTable(vData);
        var vChartOptions = {
          title: 'Deflection',
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_deflection'));
        chart.draw(vChartData, vChartOptions);
    }
}
