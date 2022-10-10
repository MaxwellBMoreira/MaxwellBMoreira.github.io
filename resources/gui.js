const cameraControl = {
  cameraPosX: 0,
  cameraPosY: 4,
  cameraPosZ: 20
};



const redControl ={
  animate: false,
  speed : 3,
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  scale: 1,
}

const greenControl ={
  animate: true,
  speed : 3,
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  scale: 1,
}

const blueControl ={
  animate: true,
  speed : 3,
  positionX: 10,
  positionY: 0,
  positionZ: 0,
  scale: 1,
}


const cameraGUI = () => {
  const gui = new dat.GUI();
  gui.add(cameraControl, "cameraPosX",-50, 50,0.1);
  gui.add(cameraControl,"cameraPosY",-50, 50, 0.1);
  gui.add(cameraControl,"cameraPosZ",-50,50,0.1);
};

const redGUI = () => {
  const gui = new dat.GUI();
  gui.add(redControl,"animate");
  gui.add(redControl,"speed", 0, 6, 0.1);
  gui.add(redControl,"positionX",-30,30,0.1);
  gui.add(redControl,"positionY",-30,30,0.1);
  gui.add(redControl,"positionZ",-30,30,0.1);
  gui.add(redControl,"scale",0,10,0.1);
}

const greenGUI = () => {
  const gui = new dat.GUI();
  gui.add(greenControl,"animate");
  gui.add(greenControl,"speed", 0, 6, 0.1);
  gui.add(greenControl,"positionX",-30,30,0.1);
  gui.add(greenControl,"positionY",-30,30,0.1);
  gui.add(greenControl,"positionZ",-30,30,0.1);
  gui.add(greenControl,"scale",0,10,0.1);
}

const blueGUI = () => {
  const gui = new dat.GUI();
  gui.add(blueControl,"animate");
  gui.add(blueControl,"speed", 0, 6, 0.1);
  gui.add(blueControl,"positionX",-30,30,0.1);
  gui.add(blueControl,"positionY",-30,30,0.1);
  gui.add(blueControl,"positionZ",-30,30,0.1);
  gui.add(blueControl,"scale",0,10,0.1);
}


