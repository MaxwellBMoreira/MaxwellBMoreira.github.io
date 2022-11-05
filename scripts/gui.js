var gui;
var uiObj = {
   
  ['Select Object Index']: 0,
  selectedName: "",

  isObjectSelected: false,
  isAnimationPlaying: false,
  isWireframeOn: false,
  isTextureOn: false,
  destruction: false,
  objArray: [],
    
  animationSpeed: 2.5,

  translation: {
    x: 0.0,
    y: 0.0,
    z: 0.0,
  },
    
  rotation: {
    x: 0.0,
    y: 0.0,
    z: 0.0,

  },
    
  scale: {
    x: 1.0,
    y: 1.0,
    z: 1.0,
   },
    
  color: [0,0,0,1],

  shininess: 300,
/*
  ['Create Pyramid']: function() {
    createObj("pyramid");
  },

  ['Create Cube']: function() {
    createObj("cube");
  },

  ['Create triangle']: function() {
    createObj("triangle");
  },

  ['Create vertice']: function() {
    createVertice(0);
  }*/
};


const cameraControl = {
  cameraPosX: 0,
  cameraPosY: 4,
  cameraPosZ: 20
};


var objectControl ={

  arrayOfObjects: [],
  selectedObj: null,
  selectedName:'',
  isObjectSelected: false,
  //tudogira: false,
  //interfaceObj[]
  spin: false,
  speed : 3,
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  scale: 1,

  ['Add Wood Crate']:function(){
    loadNewObject(0,0);
  },
  ['Add Nitro Crate']:function(){
    loadNewObject(0,1);
  },
  ['Add TNT Crate']:function(){
    loadNewObject(0,2);
  },
  ['Add Life Crate']:function(){
    loadNewObject(0,3);
  },
  ['Load 4 side dice']:function(){
    loadNewObject(1,4);
  },
 /* 'Load car':function(){
    loadNewObject();
  },*/
  ['Load triangule']:function(){
    loadNewObject(2,5);
  }
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
  gui = new dat.GUI();
  var x;

  let objIndex;
  let objIsSpining;
  let objSpinSpeed;
  let objTx;
  let objTy;
  let objTz;
  let objRx;
  let objRy;
  let objRz;
  let objSx;
  let objSy;
  let objSz;
  let objS;
  


  /*var testeFolder = gui.addFolder('Teste');
  var objIndex = testeFolder.add(parameters,'objetoSelecionado',[1,2,3,4,5]);
  var objX = testeFolder.add(parameters,'x').min(-10).max(10).step(0.1).listen();

  objIndex.onChange(function(value){
    x = value;
    parameters.objetoSelecionado=value;
    parameters.x = nodeInfosByName[x].trs.translation[0];
    gui.destroy();
    //testeFolder.open();
    interfaceGUI();
  })
  objX.onChange(function(value){
    console.log('Index:'+x+'| valor:'+value);
    nodeInfosByName[parameters.objetoSelecionado].trs.translation[0]= value;
  })*/
  
  var manipObjFolder = gui.addFolder('Manipulate Objects');
  objIndex = manipObjFolder.add(objectControl,"selectedName",objectControl.arrayOfObjects);
    //manipObjFolder.add(objectControl,"tudogira");
  objIsSpining = manipObjFolder.add(objectControl,"spin");
  objSpinSpeed = manipObjFolder.add(objectControl,"speed", 0, 6, 0.1);
  objTx = manipObjFolder.add(objectControl,"positionX",-10,10,0.1);
  objTy = manipObjFolder.add(objectControl,"positionY",-10,10,0.1);
  objTz = manipObjFolder.add(objectControl,"positionZ",-10,10,0.1);
  objRx = manipObjFolder.add(objectControl,"rotateX",-6.3,6.3,0.1);
  objRy = manipObjFolder.add(objectControl,"rotateY",-6.3,6.3,0.1);
  objRz = manipObjFolder.add(objectControl,"rotateZ",-6.3,6.3,0.1);
  objSx = manipObjFolder.add(objectControl,"scaleX",-10,10,0.1);
  objSy = manipObjFolder.add(objectControl,"scaleY",-10,10,0.1);
  objSz = manipObjFolder.add(objectControl,"scaleZ",-10,10,0.1);
  //objS  = manipObjFolder.add(objectControl,"scale",-10,10,0.1);


  objIndex.onChange(function(value){
    x = value;
    objectControl.selectedObj=x;
    objectControl.isObjectSelected=true;
    objectControl.spin = nodeInfosByName[x].isSpining;
    objectControl.positionX = nodeInfosByName[x].trs.translation[0];
    objectControl.positionY = nodeInfosByName[x].trs.translation[1];
    objectControl.positionZ = nodeInfosByName[x].trs.translation[2];
    objectControl.rotateX = nodeInfosByName[x].trs.rotation[0];
    objectControl.rotateY = nodeInfosByName[x].trs.rotation[1];
    objectControl.rotateZ = nodeInfosByName[x].trs.rotation[2];
    objectControl.scaleX = nodeInfosByName[x].trs.scale[0];
    objectControl.scaleY = nodeInfosByName[x].trs.scale[1];
    objectControl.scaleZ = nodeInfosByName[x].trs.scale[2];
    //objectControl.scale = 1;

    gui.destroy();
    interfaceGUI();
  })

  /*
  objIsSpining.onChange(function(value){
    console.log(value+'|'+objectControl.rotateY+'|'+nodeInfosByName[objectControl.selectedObj].trs.rotation[1]);
    objectControl.rotateY = nodeInfosByName[objectControl.selectedObj].trs.rotation[1];
   
  })

  objTx.onChange(function(value){
    console.log('Index:'+x+'| valor:'+value);
    nodeInfosByName[objectControl.selectedObj].trs.translation[0]= value;
  });

  objTy.onChange(function(value){
    //console.log('Index:'+x+'| valor:'+value);
    nodeInfosByName[objectControl.selectedObj].trs.translation[1]= value;
  });

  objTz.onChange(function(value){
    //console.log('Index:'+x+'| valor:'+value);
    nodeInfosByName[objectControl.selectedObj].trs.translation[2]= value;
  });

  objRx.onChange(function(value){
    //console.log('Index:'+x+'| valor:'+value);
    nodeInfosByName[objectControl.selectedObj].trs.rotation[0]= value;
  });

  objRy.onChange(function(value){
    //console.log('Index:'+x+'| valor:'+value);
    nodeInfosByName[objectControl.selectedObj].trs.rotation[1]= value;
  });

  objRz.onChange(function(value){
    //console.log('Index:'+x+'| valor:'+value);
    nodeInfosByName[objectControl.selectedObj].trs.rotation[2]= value;
  });

  objSx.onChange(function(value){
    //console.log('Index:'+x+'| valor:'+value);
    nodeInfosByName[objectControl.selectedObj].trs.scale[0]= value;
    //objectControl.scaleX = nodeInfosByName[objectControl.selectedObj].trs.translation[0];
  });

  objSy.onChange(function(value){
    //console.log('Index:'+x+'| valor:'+value);
    nodeInfosByName[objectControl.selectedObj].trs.scale[1]= value;
    //objectControl.scaleY = nodeInfosByName[objectControl.selectedObj].trs.translation[0];
  });

  objSz.onChange(function(value){
    //console.log('Index:'+x+'| valor:'+value);
    nodeInfosByName[objectControl.selectedObj].trs.scale[2]= value;
    //objectControl.scaleZ = nodeInfosByName[objectControl.selectedObj].trs.translation[0];
  });

  /*objS.onChange(function(value){
    //console.log('Index:'+x+'| valor:'+value);
    nodeInfosByName[objectControl.selectedObj].trs.scale[0] += value;
    nodeInfosByName[objectControl.selectedObj].trs.scale[1] += value;
    nodeInfosByName[objectControl.selectedObj].trs.scale[2] += value;
    //objectControl.scaleX = nodeInfosByName[objectControl.selectedObj].trs.translation[0];
    //objectControl.scaleY = nodeInfosByName[objectControl.selectedObj].trs.translation[1];
    //objectControl.scaleZ = nodeInfosByName[objectControl.selectedObj].trs.translation[2];
  });*/
    
  
    
  const manipScene = gui.addFolder('Manipulate Scene')
    manipScene.add(objectControl,"Add Wood Crate");
    manipScene.add(objectControl,"Add Nitro Crate");
    manipScene.add(objectControl,"Add TNT Crate");
    manipScene.add(objectControl,"Add Life Crate");
    manipScene.add(objectControl,"Load 4 side dice");
    //manipScene.add(sceneControl,"Load car");
    manipScene.add(objectControl,"Load triangule");


  const manipCamera = gui.addFolder('Manipulate Cameras')
    manipCamera.add(cameraControl, "cameraPosX",-50, 50,0.1);
    manipCamera.add(cameraControl,"cameraPosY",-50, 50, 0.1);
    manipCamera.add(cameraControl,"cameraPosZ",-50,50,0.1);

}

