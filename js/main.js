function setup(){
    canvas = createCanvas(640, 480);
    canvas.parent('canvas');

    openTab(event, 'Beam');
}

function draw(){
    background(0, 0, 128);
    translate(40, -40);

    for (var i = 0; i < b2dObjects.length; i++){
        if(b2dObjects[i].type == "beam"){
            b2dObjects[i].show(false);
        }
    }

    for (var i = 0; i < b2dObjects.length; i++){
        if(b2dObjects[i].type == "support"){
            b2dObjects[i].show(false);
        }
    }

    for (var i = 0; i < b2dObjects.length; i++){
        if(b2dObjects[i].type == "load"){
            b2dObjects[i].show(false);
        }
    }

    if(globalSelectedID != null){
        for (var i = 0; i < b2dObjects.length; i++){
            if(b2dObjects[i].id == globalSelectedID){
                b2dObjects[i].show(true);
                break;
            }
        }
    }
}
