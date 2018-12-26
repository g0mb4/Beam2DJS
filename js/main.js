function setup(){
    env = new Beam2DEnvironment(640, 300);

    openTab(event, 'Beam');
}

function draw(){
    env.show();
}
