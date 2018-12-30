function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function removeListOptions(selectbox){
    var i;
    for(i = selectbox.options.length - 1 ; i >= 0 ; i--){
        selectbox.remove(i);
    }
}

function updateUIList(list, type){
    var select = document.getElementById(list);
    removeListOptions(select);
    for (var i = 0; i < env.getObjectsSize(); i++){
        var o = env.getObjectIndex(i);
        if(o.type == type){
            var opt = document.createElement('option');
            opt.value = o.id;
            var list_type = "";
            if(type == "support"){
                list_type = o.support_type;
            } else if(type == "load"){
                list_type = o.load_type;
            } else {
                list_type = type;
            }
            opt.innerHTML = list_type + " - " + o.id + " ";
            select.appendChild(opt);
        }
    }

    updatePointsList('list_points_support');
    updatePointsList('list_points_force');
    updatePointsList('list_points_moment');
    updatePointsList('list_points_dist_const_1');
    updatePointsList('list_points_dist_const_2');
}

function updatePointsList(list){
    var select = document.getElementById(list);
    removeListOptions(select);

    for (var i = 0; i < env.points.length; i++){
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = '(' + i + ')';
        select.appendChild(opt);
    }
}

function delUserObject(list, type){
    var select = document.getElementById(list);
    if(select.options[select.selectedIndex]){
        var id = parseInt(select.options[select.selectedIndex].value);
        env.delObjectID(id);
        updateUIList(list, type);
    }
}

function delUserObjectsAll(type){
    env.delObjectType(type);

    updateUIList("list_" + type + "s", type);
}

function updateSelected(list){
    var select = document.getElementById(list);
    if(select.options[select.selectedIndex]){
        env.updateSelectedID(parseInt(select.options[select.selectedIndex].value));
    } else {
        env.updateSelectedID(null);
    }
}

function addUserBeam(){
    var x1 = parseFloat(document.getElementById('beam_x1').value);
    var y1 = parseFloat(document.getElementById('beam_y1').value);
    var x2 = parseFloat(document.getElementById('beam_x2').value);
    var y2 = parseFloat(document.getElementById('beam_y2').value);

    d1 = sqrt((x1 * x1) + (y1 * y1));
    d2 = sqrt((x2 * x2) + (y2 * y2));

    // (x1, y1) colosest point to (0, 0)
    if( d1 < d2 ){
        env.addObject(new Beam(env.getNextID(), x1, y1, x2, y2));
    } else {
        env.addObject(new Beam(env.getNextID(), x2, y2, x1, y1));
    }
    updateUIList("list_beams", "beam");
}

function addUserSupport(){
    var pointIndex = document.getElementById('list_points_support').value;
    p = env.getPoint(pointIndex);

    if(p != null){
        var type = document.querySelector('input[name="support_type"]:checked').value;
        var dir = document.querySelector('input[name="support_dir"]:checked').value;

        env.addObject(new Support(env.getNextID(), p.x, p.y, type, dir));
        updateUIList("list_supports", "support");
    }
}

function addUserForceMag(){
    var pointIndex = document.getElementById('list_points_force').value;
    p = env.getPoint(pointIndex);

    if(p != null){
        var magnitude = parseFloat(document.getElementById('force_magnitude').value);
        var angle = parseFloat(document.getElementById('force_angle').value);

        var c_x = magnitude * cos(radians(angle));
        var c_y = magnitude * sin(radians(angle));

        env.addObject(new Load(env.getNextID(), p.x, p.y, 0, 0, "load_force", c_x, c_y, 0, 0));
        updateUIList("list_loads", "load");
    }
}

function addUserForceComp(){
    var pointIndex = document.getElementById('list_points_force').value;
    p = env.getPoint(pointIndex);

    if(p != null){
        var c_x = parseFloat(document.getElementById('force_c_x').value);
        var c_y = parseFloat(document.getElementById('force_c_y').value);

        env.addObject(new Load(env.getNextID(), p.x, p.y, 0, 0, "load_force", c_x, c_y, 0, 0));
        updateUIList("list_loads", "load");
    }
}

function addUserMoment(){
    var pointIndex = document.getElementById('list_points_moment').value;
    p = env.getPoint(pointIndex);

    if(p != null){
        var mag = parseFloat(document.getElementById('moment_magnitude').value);

        env.addObject(new Load(env.getNextID(), p.x, p.y, 0, 0, "load_moment", mag, 0, 0, 0));
        updateUIList("list_loads", "load");
    }
}

function addUserDistConst(){
    var point1Index = document.getElementById('list_points_dist_const_1').value;
    p1 = env.getPoint(point1Index);

    var point2Index = document.getElementById('list_points_dist_const_2').value;
    p2 = env.getPoint(point2Index);

    if(p1 != null && p2 != null){
        var magnitude = parseFloat(document.getElementById('dist_const_mag').value);
        var angle = parseFloat(document.getElementById('dist_const_angle').value);

        var c_x = magnitude * cos(radians(angle));
        var c_y = magnitude * sin(radians(angle));

        env.addObject(new Load(env.getNextID(), p1.x, p1.y, p2.x, p2.y, "load_dist_const", c_x, c_y, c_x, c_y));
        updateUIList("list_loads", "load");
    }
}


function solve(){
    if(env != null){
        env.clearSolution();
        var sol = new Beam2DSolver(env);
        var E = parseFloat(document.getElementById('solver_E').value);
        var I = parseFloat(document.getElementById('solver_I').value);
        var dx = parseFloat(document.getElementById('solver_dx').value);

        sol.I = I;
        sol.E = E;
        sol.dx = dx;

        sol.solve();

        // orded is important !!!
        env.v = sol.generateDeflection();
        env.phi = sol.generateRotation();

        sol.removeDistForces(); // MUST HAVE TO DO !!!

        env.T = sol.generateShear();
        env.M = sol.generateBendingMoment();

        env.K0 = sol.K0;
        env.K1 = sol.K1;
        env.p0 = sol.p0;
        env.p1 = sol.p1;
        env.p0_nodist = sol.p0_nodist;
        env.d = sol.d;

        env.writeSolution();
        env.drawCharts();

        openTab(event, 'results_tab');
    }
}

function load_structure(){
    var txt = document.getElementById('text_load_save');
    env.objects = [];

    var obj = JSON.parse(txt.innerHTML);

    for(var i = 0; i < obj.objs.length; i++){
        env.addObjectJSON(obj.objs[i]);
    }

    document.getElementById('solver_I').value = obj.I;
    document.getElementById('solver_E').value = obj.E;
    document.getElementById('solver_dx').value = obj.dx;

    updateUIList("list_beams", "beam");
    updateUIList("list_supports", "support");
    updateUIList("list_loads", "load");
}

function save_structure(){
    var txt = document.getElementById('text_load_save');
    var structure = {
        objs: env.objects,
        I : parseFloat(document.getElementById('solver_I').value),
        E : parseFloat(document.getElementById('solver_E').value),
        dx : parseFloat(document.getElementById('solver_dx').value)
    };

    var str = JSON.stringify(structure, null, 2);
    txt.innerHTML = str;
}

function load_example(obj){
    var txt = document.getElementById('text_load_save');
    txt.innerHTML = JSON.stringify(obj, null, 2);
    load_structure();
}

function load_example1(){
    load_example({
      "objs": [
        {
          "id": 0,
          "type": "beam",
          "x1": 0,
          "y1": 0,
          "x2": 1.9,
          "y2": 0
        },
        {
          "id": 1,
          "type": "support",
          "support_type": "support_fixed",
          "x": 1.9,
          "y": 0,
          "dir": "dir_x_minus"
        },
        {
          "id": 2,
          "type": "load",
          "load_type": "load_force",
          "x1": 0,
          "y1": 0,
          "x2": 0,
          "y2": 0,
          "c_x1": 3473.2918522949863,
          "c_y1": -3596.6990016932555,
          "c_x2": 0,
          "c_y2": 0
        }
      ],
      "I": 0.00000573,
      "E": 210000000000,
      "dx": 0.001
    });
}

function load_example2(){
    load_example({
      "objs": [
        {
          "id": 5,
          "type": "beam",
          "x1": 0,
          "y1": 0,
          "x2": 1.7,
          "y2": 0
        },
        {
          "id": 6,
          "type": "beam",
          "x1": 1.7,
          "y1": 0,
          "x2": 5,
          "y2": 0
        },
        {
          "id": 7,
          "type": "beam",
          "x1": 5,
          "y1": 0,
          "x2": 6.2,
          "y2": 0
        },
        {
          "id": 8,
          "type": "support",
          "support_type": "support_wrist",
          "x": 0,
          "y": 0,
          "dir": "dir_y_plus"
        },
        {
          "id": 9,
          "type": "support",
          "support_type": "support_trundle",
          "x": 5,
          "y": 0,
          "dir": "dir_y_plus"
        },
        {
          "id": 10,
          "type": "load",
          "load_type": "load_moment",
          "x1": 1.7,
          "y1": 0,
          "x2": 0,
          "y2": 0,
          "c_x1": -4530,
          "c_y1": 0,
          "c_x2": 0,
          "c_y2": 0
        },
        {
          "id": 11,
          "type": "load",
          "load_type": "load_force",
          "x1": 6.2,
          "y1": 0,
          "x2": 0,
          "y2": 0,
          "c_x1": -2414.2972266850666,
          "c_y1": 2777.3312552198013,
          "c_x2": 0,
          "c_y2": 0
        }
      ],
      "I": 0.00000171,
      "E": 210000000000,
      "dx": 0.001
    });
}

function load_example3(){
    load_example({
      "objs": [
        {
          "id": 0,
          "type": "beam",
          "x1": 0,
          "y1": 0,
          "x2": 1.2,
          "y2": 0
        },
        {
          "id": 1,
          "type": "beam",
          "x1": 1.2,
          "y1": 0,
          "x2": 1.8,
          "y2": 0
        },
        {
          "id": 2,
          "type": "support",
          "support_type": "support_fixed",
          "x": 1.8,
          "y": 0,
          "dir": "dir_x_minus"
        },
        {
          "id": 3,
          "type": "load",
          "load_type": "load_force",
          "x1": 0,
          "y1": 0,
          "x2": 0,
          "y2": 0,
          "c_x1": 3581.44231343778,
          "c_y1": 2415.7133429936266,
          "c_x2": 0,
          "c_y2": 0
        },
        {
          "id": 4,
          "type": "load",
          "load_type": "load_dist_const",
          "x1": 1.2,
          "y1": 0,
          "x2": 1.8,
          "y2": 0,
          "c_x1": -3.416764569621115e-13,
          "c_y1": -1860,
          "c_x2": -3.416764569621115e-13,
          "c_y2": -1860
        }
      ],
      "I": 0.00000171,
      "E": 210000000000,
      "dx": 0.0005
    });
}

function load_example4(){
    load_example({
        "objs": [
        {
          "id": 5,
          "type": "beam",
          "x1": 0,
          "y1": 0,
          "x2": 2,
          "y2": 0
        },
        {
          "id": 6,
          "type": "beam",
          "x1": 2,
          "y1": 0,
          "x2": 4.3,
          "y2": 0
        },
        {
          "id": 7,
          "type": "beam",
          "x1": 4.3,
          "y1": 0,
          "x2": 7.6,
          "y2": 0
        },
        {
          "id": 8,
          "type": "support",
          "support_type": "support_wrist",
          "x": 0,
          "y": 0,
          "dir": "dir_y_plus"
        },
        {
          "id": 9,
          "type": "support",
          "support_type": "support_trundle",
          "x": 4.3,
          "y": 0,
          "dir": "dir_y_plus"
        },
        {
          "id": 10,
          "type": "support",
          "support_type": "support_trundle",
          "x": 7.6,
          "y": 0,
          "dir": "dir_y_plus"
        },
        {
          "id": 11,
          "type": "load",
          "load_type": "load_force",
          "x1": 2,
          "y1": 0,
          "x2": 0,
          "y2": 0,
          "c_x1": 0,
          "c_y1": -17600,
          "c_x2": 0,
          "c_y2": 0
        }
      ],
      "I": 0.0000145,
      "E": 210000000000,
      "dx": 0.0005
  });
}
