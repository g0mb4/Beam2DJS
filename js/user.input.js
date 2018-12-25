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
    for (var i = 0; i < b2dObjects.length; i++){
        if(b2dObjects[i].type == type){
            var opt = document.createElement('option');
            opt.value = b2dObjects[i].id;
            var list_type = "";
            if(type == "support"){
                list_type = b2dObjects[i].support_type;
            } else if(type == "load"){
                list_type = b2dObjects[i].load_type;
            } else {
                list_type = type;
            }
            opt.innerHTML = list_type + " - " + b2dObjects[i].id + " ";
            select.appendChild(opt);
        }
    }
}

function delUserObject(list, type){
    var select = document.getElementById(list);
    if(select.options[select.selectedIndex]){
        var id = parseInt(select.options[select.selectedIndex].value);
        for (i = b2dObjects.length - 1 ; i >= 0 ; i--){
            if(b2dObjects[i].id == id){
                b2dObjects.splice(i, 1);
            }
        }
        updateUIList(list, type);
    }
}

function delUserObjectsAll(type){
    for (i = b2dObjects.length - 1 ; i >= 0 ; i--){
        if(b2dObjects[i].type == type){
            b2dObjects.splice(i, 1);
        }
    }

    updateUIList("list_" + type + "s", type);
}

function updateSelected(list){
    var select = document.getElementById(list);
    if(select.options[select.selectedIndex]){
        globalSelectedID = parseInt(select.options[select.selectedIndex].value);
    } else {
        globalSelectedID = null;
    }
}

function addUserBeam(){
    var x1 = parseFloat(document.getElementById('beam_x1').value);
    var y1 = parseFloat(document.getElementById('beam_y1').value);
    var x2 = parseFloat(document.getElementById('beam_x2').value);
    var y2 = parseFloat(document.getElementById('beam_y2').value);

    b2dObjects.push(new Beam(x1, y1, x2, y2));
    updateUIList("list_beams", "beam");
}

function addUserSupport(){
    var x = parseFloat(document.getElementById('support_x').value);
    var y = parseFloat(document.getElementById('support_y').value);
    var type = document.querySelector('input[name="support_type"]:checked').value;
    var dir = document.querySelector('input[name="support_dir"]:checked').value;

    b2dObjects.push(new Support(x, y, type, dir));
    updateUIList("list_supports", "support");
}

function addUserForceMag(){
    var x = parseFloat(document.getElementById('force_x').value);
    var y = parseFloat(document.getElementById('force_y').value);
    var magnitude = parseFloat(document.getElementById('force_magnitude').value);
    var angle = parseFloat(document.getElementById('force_angle').value);

    var c_x = magnitude * cos(radians(angle));
    var c_y = magnitude * sin(radians(angle));

    b2dObjects.push(new Load(x, y, 0, 0, "load_force", c_x, c_y, 0, 0));
    updateUIList("list_loads", "load");
}

function addUserForceComp(){
    var x = parseFloat(document.getElementById('force_x').value);
    var y = parseFloat(document.getElementById('force_y').value);

    var c_x = parseFloat(document.getElementById('force_c_x').value);
    var c_y = parseFloat(document.getElementById('force_c_y').value);

    b2dObjects.push(new Load(x, y, 0, 0, "load_force", c_x, c_y, 0, 0));
    updateUIList("list_loads", "load");
}

function addUserMoment(){
    var x = parseFloat(document.getElementById('moment_x').value);
    var y = parseFloat(document.getElementById('moment_y').value);

    var mag = parseFloat(document.getElementById('moment_magnitude').value);

    b2dObjects.push(new Load(x, y, 0, 0, "load_moment", mag, 0, 0, 0));
    updateUIList("list_loads", "load");
}
