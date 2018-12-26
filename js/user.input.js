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
}

function updatePointsList(list){
    var select = document.getElementById(list);
    removeListOptions(select);
    for (var i = 0; i < env.getPointsSize(); i++){
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
        env.addObject(new Beam(0, x1, y1, x2, y2));

        if(x2 * env.getDrawScale() > width - 30){
            env.setDrawScale((width - 80) / (x2));
        } else {
            env.setDrawScale(200);
        }

    } else {
        env.addObject(new Beam(0, x2, y2, x1, y1));

        if(x1 * env.getDrawScale() > width - 30){
            env.setDrawScale((width - 80) / (x1));
        } else {
            env.setDrawScale(200);
        }
    }
    updateUIList("list_beams", "beam");
}

function addUserSupport(){
    var pointIndex = document.getElementById('list_points_support').value;
    p = env.getPoint(pointIndex);

    if(p != null){
        var type = document.querySelector('input[name="support_type"]:checked').value;
        var dir = document.querySelector('input[name="support_dir"]:checked').value;

        env.addObject(new Support(0, p.x, p.y, type, dir));
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

        env.addObject(new Load(0, p.x, p.y, 0, 0, "load_force", c_x, c_y, 0, 0));
        updateUIList("list_loads", "load");
    }
}

function addUserForceComp(){
    var pointIndex = document.getElementById('list_points_force').value;
    p = env.getPoint(pointIndex);

    if(p != null){
        var c_x = parseFloat(document.getElementById('force_c_x').value);
        var c_y = parseFloat(document.getElementById('force_c_y').value);

        env.addObject(new Load(0, p.x, p.y, 0, 0, "load_force", c_x, c_y, 0, 0));
        updateUIList("list_loads", "load");
    }
}

function addUserMoment(){
    var pointIndex = document.getElementById('list_points_moment').value;
    p = env.getPoint(pointIndex);

    if(p != null){
        var mag = parseFloat(document.getElementById('moment_magnitude').value);

        env.addObject(new Load(0, p.x, p.y, 0, 0, "load_moment", mag, 0, 0, 0));
        updateUIList("list_loads", "load");
    }
}

function solve(){
    if(env != null){
        var sol = new Beam2DSolver(env);
        var E = parseFloat(document.getElementById('solver_E').value);
        var I = parseFloat(document.getElementById('solver_I').value);

        sol.setI(I);
        sol.setE(E);

        sol.solve();

        env.v = sol.v;
        env.drawCharts();
    }
}