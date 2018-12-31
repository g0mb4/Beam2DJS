class Beam2DEnvironment{
    constructor(w, h){
        this.canvas = createCanvas(w, h);
        this.canvas.parent('canvas');   // add to HTML div

        this.objects = [];
        this.points = [];

        this.objectID = 0;
        this.selectedID = null;

        this.drawScaleFactor = 200;

        this.K0 = [];
        this.K1 = [];
        this.p0 = [];
        this.p1 = [];
        this.p0_nodist = [];
        this.d = [];

        this.T = [];
        this.M = [];
        this.v = [];
        this.phi = [];
    }

    show(){
        background(0, 0, 128);
        stroke(255, 255, 0);
        strokeWeight(2);
        line(10, height - 10, 40, height - 10);
        line(10, height - 10, 10, height - 40);
        strokeWeight(1);
        text('x', 50, height - 5);
        text('y', 10, height - 50);

        translate(80, -80);

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
        stroke(255, 255, 0);
        textSize(14);
        textAlign(CENTER);
        strokeWeight(1);
        for (var i = 0; i < this.points.length; i++){
            var p = this.points[i];

            text(p.x + ' m', p.x * this.drawScaleFactor, height + 55 - (p.y * this.drawScaleFactor));
            text('(' + i + ')', p.x * this.drawScaleFactor, height + 70 - (p.y * this.drawScaleFactor));
        }
    }

    getNextID(){
        return this.objectID++;
    }

    addObject(o){
        this.objects.push(o);

        if(o.type == "beam"){
            this.updatePoints();
        }
    }

    addObjectJSON(o){
        if(o.type == "beam"){
            this.addObject(new Beam(o.id, o.x1, o.y1, o.x2, o.y2));
        } else if(o.type == "support"){
            this.addObject(new Support(o.id, o.x, o.y, o.support_type, o.dir));
        } else if(o.type == "load"){
            this.addObject(new Load(o.id, o.x1, o.y1, o.x2, o.y2, o.load_type, o.c_x1, o.c_y1, o.c_x2, o.c_y2));
        }

        this.objectID = 0;
        for(var i = 0; i < this.objects.length; i++){
            if(this.objects[i].id >= this.objectID){
                this.objectID = this.objects[i].id + 1;
            }
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

        if(this.selectedID != null){
            var table = document.getElementById("properties");
            table.innerHTML = "";

            for (var i = 0; i < this.objects.length; i++){
                if(this.objects[i].id == this.selectedID){
                    var props = this.objects[i].listProperties();

                    var row0 = table.insertRow(0).insertCell(0).innerHTML = props[0].value + " tulajdonságai";

                    for(var p = 1; p < props.length; p++){
                        var row = table.insertRow(p);

                        row.insertCell(0).innerHTML = props[p].name;
                        row.insertCell(1).innerHTML = props[p].value;
                    }

                    break;
                }
            }
        }
    }

    updatePoints(){
        var os = this.objects.slice();  // copy array by value
        /* sort points of beam based on the distance to (0, 0)*/
        os.sort(function(a, b){
            if(a.type == "beam" && b.type == "beam"){
                var d1 = sqrt((a.x1) * (a.x1) + (a.y1) * (a.y1));
                var d2 = sqrt((b.x1) * (b.x1) + (b.y1) * (b.y1));

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

        var x_max = 0;
        for(var i = 0; i < this.points.length; i++){
            var x = this.points[i].x;
            if(x > x_max){
                x_max = x;
            }
        }

        if(x_max * this.drawScaleFactor > width - 50){
            this.drawScaleFactor = (width - 120) / (x_max);
        } else {
            this.drawScaleFactor = 200;
        }
    }

    getDrawScale(){
        return this.drawScaleFactor;
    }

    setDrawScale(s){
        this.drawScaleFactor = s;
    }

    getPoint(index){
        if(index >= this.points.length){
            return null;
        } else {
            return this.points[index];
        }
    }

    clearSolution(){
        document.getElementById("table_results").innerHTML = "";
        document.getElementById('solution_text').innerHTML = "";
        document.getElementById('chart_shear').style.display = "none";
        document.getElementById('chart_bending_moment').style.display = "none";
        document.getElementById('chart_deflection').style.display = "none";
        document.getElementById('chart_rotation').style.display = "none";
    }

    _showMatricies(){
        var div = document.getElementById('solution_text');

        // p
        var str = "\\( \\underline{p_1} ="
        str += "\\begin{pmatrix}";
        this.p1.map(function (value, index, matrix) {
            str += value;

            if(index[0] < matrix._size[0] - 1){
                str += "\\\\";
            }
        });
        str += " \\end{pmatrix}";

        str += "\\underline{\\underline{K_1}} ="
        str += "\\begin{pmatrix}";
        for(var i = 0; i < this.K1._size[0]; i++){
            for(var j = 0; j < this.K1._size[1]; j++){
                str += math.subset(this.K1, math.index(i, j));

                if(j < this.K1._size[1] - 1){
                    str += " & ";
                }
            }

            if(i < this.K1._size[0] - 1){
                str += " \\\\";
            }
        }
        str += " \\end{pmatrix} \\\\";

        // d
        str += "\\underline{d} ="
        str += "\\begin{pmatrix}";
        for(var i = 0; i < this.d._size[0] / 2; i++){
            str += "v_" + i + "\\\\";
            str += "\\varphi_" + i;

            if(i < this.d._size[0] / 2 - 1){
                str += " \\\\";
            }
        }
        str += " \\end{pmatrix} =";

        str += "\\begin{pmatrix}";
        this.d.map(function (value, index, matrix) {
            str += value;
            if(index[0] % 2 == 0){
                str += " \\quad \\mathrm{m}";
            } else {
                str += " \\quad \\mathrm{rad}";
            }

            if(index[0] < matrix._size[0] - 1){
                str += " \\\\";
            }
        });

        str += " \\end{pmatrix} \\quad";

        str += "\\underline{p_0} ="
        str += "\\begin{pmatrix}";
        for(var i = 0; i < this.p0._size[0] / 2; i++){
            str += "F_{y" + i + "} \\\\";
            str += "M_{hz" + i + "}";

            if(i < this.p0._size[0] / 2 - 1){
                str += " \\\\";
            }
        }
        str += " \\end{pmatrix} =";

        str += "\\begin{pmatrix}";
        this.p0.map(function (value, index, matrix) {
            str += value;

            if(index[0] % 2 == 0){
                str += " \\quad \\mathrm{N}";
            } else {
                str += " \\quad \\mathrm{Nm}";
            }

            if(index[0] < matrix._size[0] - 1){
                str += "\\\\";
            }
        });
        str += " \\end{pmatrix}";

        str += "\\underline{p_{0nodist}} ="
        str += "\\begin{pmatrix}";
        this.p0_nodist.map(function (value, index, matrix) {
            str += value;

            if(index[0] % 2 == 0){
                str += " \\quad \\mathrm{N}";
            } else {
                str += " \\quad \\mathrm{Nm}";
            }

            if(index[0] < matrix._size[0] - 1){
                str += "\\\\";
            }
        });
        str += " \\end{pmatrix} \\)";

        div.innerHTML = str;
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "solution_text"]);
    }

    writeSolution(){
        //this._showMatricies();

        var table = document.getElementById("table_results");
        var size = this.d.size()[0];
        var k = 0;
        for(var i = 0; i < size; i += 2){
            var row1 = table.insertRow(i);
            var row2 = table.insertRow(i + 1);

            var F_n = row1.insertCell(0);
            var F_v = row1.insertCell(1);
            var v_n = row1.insertCell(2);
            var v_v = row1.insertCell(3);

            var M_n = row2.insertCell(0);
            var M_v = row2.insertCell(1);
            var phi_n = row2.insertCell(2);
            var phi_v = row2.insertCell(3);

            v_n.innerHTML = "v" + k;
            v_v.innerHTML = this.d._data[i][0] + " m";
            F_n.innerHTML = "Fy" + k;
            F_v.innerHTML = this.p0_nodist._data[i][0] + " N";

            phi_n.innerHTML = "phi" + k;
            phi_v.innerHTML = this.d._data[i + 1][0] + " rad";
            M_n.innerHTML = "Mhz" + k;
            M_v.innerHTML = this.p0_nodist._data[i + 1][0] + " Nm";

            k++;
        }
    }

    drawCharts(){
        document.getElementById('chart_shear').style.display = "block";
        document.getElementById('chart_bending_moment').style.display = "block";
        document.getElementById('chart_deflection').style.display = "block";
        document.getElementById('chart_rotation').style.display = "block";

        var TData = [["x", "T"]];
        for(var i = 0; i < this.T.length; i++){
            TData.push([this.T[i].x, this.T[i].T]);
        }

        var TChartData = google.visualization.arrayToDataTable(TData);
        var TChartOptions = {
          title: 'Nyíró igénybevétel',
          width: 800,
          legend: 'none',
          hAxis: { title: 'x, m' },
          vAxis: { title: 'Ty, N' }
        };

        var TChart = new google.visualization.AreaChart(document.getElementById('chart_shear'));
        TChart.draw(TChartData, TChartOptions);

        var MData = [["x", "M"]];
        for(var i = 0; i < this.M.length; i++){
            MData.push([this.M[i].x, this.M[i].M]);
        }

        var MChartData = google.visualization.arrayToDataTable(MData);
        var MChartOptions = {
            title: 'Hajlító nyomatéki igénybevétel',
            width: 800,
            legend: 'none',
            hAxis: { title: 'x, m' },
            vAxis: { title: 'Mhz, Nm' }
        };

        var MChart = new google.visualization.AreaChart(document.getElementById('chart_bending_moment'));
        MChart.draw(MChartData, MChartOptions);

        var vData = [["x", "v"]];
        for(var i = 0; i < this.v.length; i++){
            vData.push([this.v[i].x, this.v[i].v]);
        }

        var vChartData = google.visualization.arrayToDataTable(vData);
        var vChartOptions = {
            title: 'Lehajlás',
            width: 800,
            legend: 'none',
            hAxis: { title: 'x, m' },
            vAxis: { format: 'scientific', title: 'v, m' }
        };

        var vChart = new google.visualization.LineChart(document.getElementById('chart_deflection'));
        vChart.draw(vChartData, vChartOptions);

        var phiData = [["x", "phi"]];
        for(var i = 0; i < this.phi.length; i++){
            phiData.push([this.phi[i].x, this.phi[i].phi]);
        }

        var phiChartData = google.visualization.arrayToDataTable(phiData);
        var phiChartOptions = {
            title: 'Szögelfordulás',
            width: 800,
            legend: 'none',
            hAxis: { title: 'x, m' },
            vAxis: { format: 'scientific', title: 'phi, rad' }
        };

        var phiChart = new google.visualization.LineChart(document.getElementById('chart_rotation'));
        phiChart.draw(phiChartData, phiChartOptions);
    }
}
