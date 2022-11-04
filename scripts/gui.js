
const cameraControl = {
  cameraPosX: 0,
  cameraPosY: 4,
  cameraPosZ: 20
};


const objectControl ={
  selectedObj: 1,
  tudogira: false,
  spin: false,
  speed : 3,
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scale: 1,

}

const sceneControl ={
  'Add Wood Crate':function(){
    loadNewObject(0,0);
  },
  'Add Nitro Crate':function(){
    loadNewObject(0,1);
  },
  'Add TNT Crate':function(){
    loadNewObject(0,2);
  },
  'Add Life Crate':function(){
    loadNewObject(0,3);
  },
  'Load 4 side dice':function(){
    loadNewObject(1,4);
  },
 /* 'Load car':function(){
    loadNewObject();
  },*/
  'Load triangule':function(){
    loadNewObject(2,5);
  },

}


const interfaceGUI = () => {
  const gui = new dat.GUI();
  
  const manipObjFolder = gui.addFolder('Manipulate Objects')
    manipObjFolder.add(objectControl,"selectedObj",[1,2,3,4,5,6,7,8,9]);
    manipObjFolder.add(objectControl,"tudogira");
    manipObjFolder.add(objectControl,"spin").listen();
    manipObjFolder.add(objectControl,"speed", 0, 6, 0.1).listen();
    manipObjFolder.add(objectControl,"positionX",-30,30,0.1).listen();
    manipObjFolder.add(objectControl,"positionY",-30,30,0.1).listen();
    manipObjFolder.add(objectControl,"positionZ",-30,30,0.1).listen();
    manipObjFolder.add(objectControl,"rotateX",-6.3,6.3,0.1).listen();
    manipObjFolder.add(objectControl,"rotateY",-6.3,6.3,0.1).listen();
    manipObjFolder.add(objectControl,"rotateZ",-6.3,6.3,0.1).listen();
    manipObjFolder.add(objectControl,"scale",0,10,0.1).listen();
  
    
  const manipScene = gui.addFolder('Manipulate Scene')
    manipScene.add(sceneControl,"Add Wood Crate");
    manipScene.add(sceneControl,"Add Nitro Crate");
    manipScene.add(sceneControl,"Add TNT Crate");
    manipScene.add(sceneControl,"Add Life Crate");
    manipScene.add(sceneControl,"Load 4 side dice");
    //manipScene.add(sceneControl,"Load car");
    manipScene.add(sceneControl,"Load triangule");


  const manipCamera = gui.addFolder('Manipulate Cameras')
    manipCamera.add(cameraControl, "cameraPosX",-50, 50,0.1);
    manipCamera.add(cameraControl,"cameraPosY",-50, 50, 0.1);
    manipCamera.add(cameraControl,"cameraPosZ",-50,50,0.1);

}

