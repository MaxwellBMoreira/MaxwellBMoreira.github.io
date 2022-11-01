
const cameraControl = {
  cameraPosX: 0,
  cameraPosY: 4,
  cameraPosZ: 20
};


const objectControl ={
  selectedObj: 1,
  spin: false,
  speed : 3,
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  rotate:0,
  scale: 1,

}

const sceneControl ={
  'Load Object':function(){
    loadNewObject();
  },
}


const interfaceGUI = () => {
  const gui = new dat.GUI();
  
  const manipObjFolder = gui.addFolder('Manipulate Objects')
    manipObjFolder.add(objectControl,"selectedObj",[1,2,3,4,5,6,7,8,9]);
    manipObjFolder.add(objectControl,"spin").listen();
    manipObjFolder.add(objectControl,"speed", 0, 6, 0.1).listen();
    manipObjFolder.add(objectControl,"positionX",-30,30,0.1).listen();
    manipObjFolder.add(objectControl,"positionY",-30,30,0.1).listen();
    manipObjFolder.add(objectControl,"positionZ",-30,30,0.1).listen();
    manipObjFolder.add(objectControl,"rotate",0,10,0.1).listen();
    manipObjFolder.add(objectControl,"scale",0,10,0.1).listen();
  
    
  const manipScene = gui.addFolder('Manipulate Scene')
    manipScene.add(sceneControl,"Load Object");


  const manipCamera = gui.addFolder('Manipulate Cameras')
    manipCamera.add(cameraControl, "cameraPosX",-50, 50,0.1);
    manipCamera.add(cameraControl,"cameraPosY",-50, 50, 0.1);
    manipCamera.add(cameraControl,"cameraPosZ",-50,50,0.1);

}

