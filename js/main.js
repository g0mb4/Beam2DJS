function setup(){
    env = new Beam2DEnvironment(640, 300);

    openTab(event, 'beam_tab');
}

function draw(){
    env.show();
}
