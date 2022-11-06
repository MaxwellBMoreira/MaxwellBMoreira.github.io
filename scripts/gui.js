var gui;
var x = null;
var lookTexture;

var inMemoryObjects =[];
var myCameras = [];

const cameraControl = {

  arrayOfCameras:[],
  selectedCamera: 1,
  cameraPosX: 0,
  cameraPosY: 4,
  cameraPosZ: 20,
  lookX: 0,
  lookY: 0,
  lookZ: 0,

  ['Adicionar Camera']: function(){
    cameraCounter++;
    let newCamera = {
      index:cameraCounter,
      posX:0,
      posY:5,
      posZ:30
    }
  
    myCameras.push(newCamera);
    cameraControl.arrayOfCameras.push(newCamera.index);

    gui.destroy();
    interfaceGUI();
    console.log(myCameras);

  }
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
  texture: null,
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
    
    if(numberOfObjects>0){
      for(ii=1;ii<=numberOfObjects;ii++){
        inMemoryObjects[ii-1].positionX=nodeInfosByName[ii].trs.translation[0];
        inMemoryObjects[ii-1].positionY=nodeInfosByName[ii].trs.translation[1];
        inMemoryObjects[ii-1].positionZ=nodeInfosByName[ii].trs.translation[2];
        inMemoryObjects[ii-1].rotateX=nodeInfosByName[ii].trs.rotation[0];
        inMemoryObjects[ii-1].rotateY=nodeInfosByName[ii].trs.rotation[1]
        inMemoryObjects[ii-1].rotateZ=nodeInfosByName[ii].trs.rotation[2]
        inMemoryObjects[ii-1].scaleX=nodeInfosByName[ii].trs.scale[0];
        inMemoryObjects[ii-1].scaleY=nodeInfosByName[ii].trs.scale[1];
        inMemoryObjects[ii-1].scaleZ=nodeInfosByName[ii].trs.scale[2];
        inMemoryObjects[ii-1].spin=nodeInfosByName[ii].isSpining;
        inMemoryObjects[ii-1].speed=nodeInfosByName[ii].speed;
      }
    }

    loadNewObject(0,0);

    let anotherNewObj = {
      //arrayOfObjects: [],
      //selectedObj: null,
      selectedName: numberOfObjects,
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
      scale: 1
    }
    inMemoryObjects.push(anotherNewObj);

    for(ii=1;ii<=numberOfObjects;ii++){
      nodeInfosByName[ii].trs.translation[0]=inMemoryObjects[ii-1].positionX;
      nodeInfosByName[ii].trs.translation[1]=inMemoryObjects[ii-1].positionY;
      nodeInfosByName[ii].trs.translation[2]=inMemoryObjects[ii-1].positionZ;
      nodeInfosByName[ii].trs.rotation[0]=inMemoryObjects[ii-1].rotateX;
      nodeInfosByName[ii].trs.rotation[1]=inMemoryObjects[ii-1].rotateY;
      nodeInfosByName[ii].trs.rotation[2]=inMemoryObjects[ii-1].rotateZ;
      nodeInfosByName[ii].trs.scale[0]=inMemoryObjects[ii-1].scaleX;
      nodeInfosByName[ii].trs.scale[1]=inMemoryObjects[ii-1].scaleY;
      nodeInfosByName[ii].trs.scale[2]=inMemoryObjects[ii-1].scaleZ;
      nodeInfosByName[ii].isSpining=inMemoryObjects[ii-1].spin;
     nodeInfosByName[ii].speed=inMemoryObjects[ii-1].speed;
    }
  },
  ['Add Nitro Crate']:function(){

    if(numberOfObjects>0){
      for(ii=1;ii<=numberOfObjects;ii++){
        inMemoryObjects[ii-1].positionX=nodeInfosByName[ii].trs.translation[0];
        inMemoryObjects[ii-1].positionY=nodeInfosByName[ii].trs.translation[1];
        inMemoryObjects[ii-1].positionZ=nodeInfosByName[ii].trs.translation[2];
        inMemoryObjects[ii-1].rotateX=nodeInfosByName[ii].trs.rotation[0];
        inMemoryObjects[ii-1].rotateY=nodeInfosByName[ii].trs.rotation[1]
        inMemoryObjects[ii-1].rotateZ=nodeInfosByName[ii].trs.rotation[2]
        inMemoryObjects[ii-1].scaleX=nodeInfosByName[ii].trs.scale[0];
        inMemoryObjects[ii-1].scaleY=nodeInfosByName[ii].trs.scale[1];
        inMemoryObjects[ii-1].scaleZ=nodeInfosByName[ii].trs.scale[2];
        inMemoryObjects[ii-1].spin=nodeInfosByName[ii].isSpining;
        inMemoryObjects[ii-1].speed=nodeInfosByName[ii].speed;
      }
    }

    loadNewObject(0,1);

    let anotherNewObj = {
      //arrayOfObjects: [],
      //selectedObj: null,
      selectedName: numberOfObjects,
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
      scale: 1
    }
    inMemoryObjects.push(anotherNewObj);

    for(ii=1;ii<=numberOfObjects;ii++){
      nodeInfosByName[ii].trs.translation[0]=inMemoryObjects[ii-1].positionX;
      nodeInfosByName[ii].trs.translation[1]=inMemoryObjects[ii-1].positionY;
      nodeInfosByName[ii].trs.translation[2]=inMemoryObjects[ii-1].positionZ;
      nodeInfosByName[ii].trs.rotation[0]=inMemoryObjects[ii-1].rotateX;
      nodeInfosByName[ii].trs.rotation[1]=inMemoryObjects[ii-1].rotateY;
      nodeInfosByName[ii].trs.rotation[2]=inMemoryObjects[ii-1].rotateZ;
      nodeInfosByName[ii].trs.scale[0]=inMemoryObjects[ii-1].scaleX;
      nodeInfosByName[ii].trs.scale[1]=inMemoryObjects[ii-1].scaleY;
      nodeInfosByName[ii].trs.scale[2]=inMemoryObjects[ii-1].scaleZ;
      nodeInfosByName[ii].isSpining=inMemoryObjects[ii-1].spin;
     nodeInfosByName[ii].speed=inMemoryObjects[ii-1].speed;
    }
  },
  ['Add TNT Crate']:function(){
    

    if(numberOfObjects>0){
      for(ii=1;ii<=numberOfObjects;ii++){
        inMemoryObjects[ii-1].positionX=nodeInfosByName[ii].trs.translation[0];
        inMemoryObjects[ii-1].positionY=nodeInfosByName[ii].trs.translation[1];
        inMemoryObjects[ii-1].positionZ=nodeInfosByName[ii].trs.translation[2];
        inMemoryObjects[ii-1].rotateX=nodeInfosByName[ii].trs.rotation[0];
        inMemoryObjects[ii-1].rotateY=nodeInfosByName[ii].trs.rotation[1]
        inMemoryObjects[ii-1].rotateZ=nodeInfosByName[ii].trs.rotation[2]
        inMemoryObjects[ii-1].scaleX=nodeInfosByName[ii].trs.scale[0];
        inMemoryObjects[ii-1].scaleY=nodeInfosByName[ii].trs.scale[1];
        inMemoryObjects[ii-1].scaleZ=nodeInfosByName[ii].trs.scale[2];
        inMemoryObjects[ii-1].spin=nodeInfosByName[ii].isSpining;
        inMemoryObjects[ii-1].speed=nodeInfosByName[ii].speed;
      }
    }

    loadNewObject(0,2);

    let anotherNewObj = {
      //arrayOfObjects: [],
      //selectedObj: null,
      selectedName: numberOfObjects,
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
      scale: 1
    }
    inMemoryObjects.push(anotherNewObj);

    for(ii=1;ii<=numberOfObjects;ii++){
      nodeInfosByName[ii].trs.translation[0]=inMemoryObjects[ii-1].positionX;
      nodeInfosByName[ii].trs.translation[1]=inMemoryObjects[ii-1].positionY;
      nodeInfosByName[ii].trs.translation[2]=inMemoryObjects[ii-1].positionZ;
      nodeInfosByName[ii].trs.rotation[0]=inMemoryObjects[ii-1].rotateX;
      nodeInfosByName[ii].trs.rotation[1]=inMemoryObjects[ii-1].rotateY;
      nodeInfosByName[ii].trs.rotation[2]=inMemoryObjects[ii-1].rotateZ;
      nodeInfosByName[ii].trs.scale[0]=inMemoryObjects[ii-1].scaleX;
      nodeInfosByName[ii].trs.scale[1]=inMemoryObjects[ii-1].scaleY;
      nodeInfosByName[ii].trs.scale[2]=inMemoryObjects[ii-1].scaleZ;
      nodeInfosByName[ii].isSpining=inMemoryObjects[ii-1].spin;
     nodeInfosByName[ii].speed=inMemoryObjects[ii-1].speed;
    }

  },
  ['Add Life Crate']:function(){
    

    if(numberOfObjects>0){
      for(ii=1;ii<=numberOfObjects;ii++){
        inMemoryObjects[ii-1].positionX=nodeInfosByName[ii].trs.translation[0];
        inMemoryObjects[ii-1].positionY=nodeInfosByName[ii].trs.translation[1];
        inMemoryObjects[ii-1].positionZ=nodeInfosByName[ii].trs.translation[2];
        inMemoryObjects[ii-1].rotateX=nodeInfosByName[ii].trs.rotation[0];
        inMemoryObjects[ii-1].rotateY=nodeInfosByName[ii].trs.rotation[1]
        inMemoryObjects[ii-1].rotateZ=nodeInfosByName[ii].trs.rotation[2]
        inMemoryObjects[ii-1].scaleX=nodeInfosByName[ii].trs.scale[0];
        inMemoryObjects[ii-1].scaleY=nodeInfosByName[ii].trs.scale[1];
        inMemoryObjects[ii-1].scaleZ=nodeInfosByName[ii].trs.scale[2];
        inMemoryObjects[ii-1].spin=nodeInfosByName[ii].isSpining;
        inMemoryObjects[ii-1].speed=nodeInfosByName[ii].speed;
      }
    }

    loadNewObject(0,3);

    let anotherNewObj = {
      //arrayOfObjects: [],
      //selectedObj: null,
      selectedName: numberOfObjects,
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
      scale: 1
    }
    inMemoryObjects.push(anotherNewObj);

    for(ii=1;ii<=numberOfObjects;ii++){
      nodeInfosByName[ii].trs.translation[0]=inMemoryObjects[ii-1].positionX;
      nodeInfosByName[ii].trs.translation[1]=inMemoryObjects[ii-1].positionY;
      nodeInfosByName[ii].trs.translation[2]=inMemoryObjects[ii-1].positionZ;
      nodeInfosByName[ii].trs.rotation[0]=inMemoryObjects[ii-1].rotateX;
      nodeInfosByName[ii].trs.rotation[1]=inMemoryObjects[ii-1].rotateY;
      nodeInfosByName[ii].trs.rotation[2]=inMemoryObjects[ii-1].rotateZ;
      nodeInfosByName[ii].trs.scale[0]=inMemoryObjects[ii-1].scaleX;
      nodeInfosByName[ii].trs.scale[1]=inMemoryObjects[ii-1].scaleY;
      nodeInfosByName[ii].trs.scale[2]=inMemoryObjects[ii-1].scaleZ;
      nodeInfosByName[ii].isSpining=inMemoryObjects[ii-1].spin;
     nodeInfosByName[ii].speed=inMemoryObjects[ii-1].speed;
    }
  },
  ['Add Rock Block']:function(){
    

    if(numberOfObjects>0){
      for(ii=1;ii<=numberOfObjects;ii++){
        inMemoryObjects[ii-1].positionX=nodeInfosByName[ii].trs.translation[0];
        inMemoryObjects[ii-1].positionY=nodeInfosByName[ii].trs.translation[1];
        inMemoryObjects[ii-1].positionZ=nodeInfosByName[ii].trs.translation[2];
        inMemoryObjects[ii-1].rotateX=nodeInfosByName[ii].trs.rotation[0];
        inMemoryObjects[ii-1].rotateY=nodeInfosByName[ii].trs.rotation[1]
        inMemoryObjects[ii-1].rotateZ=nodeInfosByName[ii].trs.rotation[2]
        inMemoryObjects[ii-1].scaleX=nodeInfosByName[ii].trs.scale[0];
        inMemoryObjects[ii-1].scaleY=nodeInfosByName[ii].trs.scale[1];
        inMemoryObjects[ii-1].scaleZ=nodeInfosByName[ii].trs.scale[2];
        inMemoryObjects[ii-1].spin=nodeInfosByName[ii].isSpining;
        inMemoryObjects[ii-1].speed=nodeInfosByName[ii].speed;
      }
    }

    loadNewObject(0,6);

    let anotherNewObj = {
      //arrayOfObjects: [],
      //selectedObj: null,
      selectedName: numberOfObjects,
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
      scale: 1
    }
    inMemoryObjects.push(anotherNewObj);

    for(ii=1;ii<=numberOfObjects;ii++){
      nodeInfosByName[ii].trs.translation[0]=inMemoryObjects[ii-1].positionX;
      nodeInfosByName[ii].trs.translation[1]=inMemoryObjects[ii-1].positionY;
      nodeInfosByName[ii].trs.translation[2]=inMemoryObjects[ii-1].positionZ;
      nodeInfosByName[ii].trs.rotation[0]=inMemoryObjects[ii-1].rotateX;
      nodeInfosByName[ii].trs.rotation[1]=inMemoryObjects[ii-1].rotateY;
      nodeInfosByName[ii].trs.rotation[2]=inMemoryObjects[ii-1].rotateZ;
      nodeInfosByName[ii].trs.scale[0]=inMemoryObjects[ii-1].scaleX;
      nodeInfosByName[ii].trs.scale[1]=inMemoryObjects[ii-1].scaleY;
      nodeInfosByName[ii].trs.scale[2]=inMemoryObjects[ii-1].scaleZ;
      nodeInfosByName[ii].isSpining=inMemoryObjects[ii-1].spin;
     nodeInfosByName[ii].speed=inMemoryObjects[ii-1].speed;
    }
  },
  ['Add 4 side dice']:function(){
    
    if(numberOfObjects>0){
      for(ii=1;ii<=numberOfObjects;ii++){
        inMemoryObjects[ii-1].positionX=nodeInfosByName[ii].trs.translation[0];
        inMemoryObjects[ii-1].positionY=nodeInfosByName[ii].trs.translation[1];
        inMemoryObjects[ii-1].positionZ=nodeInfosByName[ii].trs.translation[2];
        inMemoryObjects[ii-1].rotateX=nodeInfosByName[ii].trs.rotation[0];
        inMemoryObjects[ii-1].rotateY=nodeInfosByName[ii].trs.rotation[1]
        inMemoryObjects[ii-1].rotateZ=nodeInfosByName[ii].trs.rotation[2]
        inMemoryObjects[ii-1].scaleX=nodeInfosByName[ii].trs.scale[0];
        inMemoryObjects[ii-1].scaleY=nodeInfosByName[ii].trs.scale[1];
        inMemoryObjects[ii-1].scaleZ=nodeInfosByName[ii].trs.scale[2];
        inMemoryObjects[ii-1].spin=nodeInfosByName[ii].isSpining;
        inMemoryObjects[ii-1].speed=nodeInfosByName[ii].speed;
      }
    }

    loadNewObject(1,4);

    let anotherNewObj = {
      //arrayOfObjects: [],
      //selectedObj: null,
      selectedName: numberOfObjects,
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
      scale: 1
    }
    inMemoryObjects.push(anotherNewObj);

    for(ii=1;ii<=numberOfObjects;ii++){
      nodeInfosByName[ii].trs.translation[0]=inMemoryObjects[ii-1].positionX;
      nodeInfosByName[ii].trs.translation[1]=inMemoryObjects[ii-1].positionY;
      nodeInfosByName[ii].trs.translation[2]=inMemoryObjects[ii-1].positionZ;
      nodeInfosByName[ii].trs.rotation[0]=inMemoryObjects[ii-1].rotateX;
      nodeInfosByName[ii].trs.rotation[1]=inMemoryObjects[ii-1].rotateY;
      nodeInfosByName[ii].trs.rotation[2]=inMemoryObjects[ii-1].rotateZ;
      nodeInfosByName[ii].trs.scale[0]=inMemoryObjects[ii-1].scaleX;
      nodeInfosByName[ii].trs.scale[1]=inMemoryObjects[ii-1].scaleY;
      nodeInfosByName[ii].trs.scale[2]=inMemoryObjects[ii-1].scaleZ;
      nodeInfosByName[ii].isSpining=inMemoryObjects[ii-1].spin;
     nodeInfosByName[ii].speed=inMemoryObjects[ii-1].speed;
    }
  },
 /* 'Load car':function(){
    loadNewObject();
  },*/
  ['Add triangule']:function(){
    

    if(numberOfObjects>0){
      for(ii=1;ii<=numberOfObjects;ii++){
        inMemoryObjects[ii-1].positionX=nodeInfosByName[ii].trs.translation[0];
        inMemoryObjects[ii-1].positionY=nodeInfosByName[ii].trs.translation[1];
        inMemoryObjects[ii-1].positionZ=nodeInfosByName[ii].trs.translation[2];
        inMemoryObjects[ii-1].rotateX=nodeInfosByName[ii].trs.rotation[0];
        inMemoryObjects[ii-1].rotateY=nodeInfosByName[ii].trs.rotation[1]
        inMemoryObjects[ii-1].rotateZ=nodeInfosByName[ii].trs.rotation[2]
        inMemoryObjects[ii-1].scaleX=nodeInfosByName[ii].trs.scale[0];
        inMemoryObjects[ii-1].scaleY=nodeInfosByName[ii].trs.scale[1];
        inMemoryObjects[ii-1].scaleZ=nodeInfosByName[ii].trs.scale[2];
        inMemoryObjects[ii-1].spin=nodeInfosByName[ii].isSpining;
        inMemoryObjects[ii-1].speed=nodeInfosByName[ii].speed;
      }
    }

    loadNewObject(2,5);

    let anotherNewObj = {
      //arrayOfObjects: [],
      //selectedObj: null,
      selectedName: numberOfObjects,
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
      scale: 1
    }
    inMemoryObjects.push(anotherNewObj);

    for(ii=1;ii<=numberOfObjects;ii++){
      nodeInfosByName[ii].trs.translation[0]=inMemoryObjects[ii-1].positionX;
      nodeInfosByName[ii].trs.translation[1]=inMemoryObjects[ii-1].positionY;
      nodeInfosByName[ii].trs.translation[2]=inMemoryObjects[ii-1].positionZ;
      nodeInfosByName[ii].trs.rotation[0]=inMemoryObjects[ii-1].rotateX;
      nodeInfosByName[ii].trs.rotation[1]=inMemoryObjects[ii-1].rotateY;
      nodeInfosByName[ii].trs.rotation[2]=inMemoryObjects[ii-1].rotateZ;
      nodeInfosByName[ii].trs.scale[0]=inMemoryObjects[ii-1].scaleX;
      nodeInfosByName[ii].trs.scale[1]=inMemoryObjects[ii-1].scaleY;
      nodeInfosByName[ii].trs.scale[2]=inMemoryObjects[ii-1].scaleZ;
      nodeInfosByName[ii].isSpining=inMemoryObjects[ii-1].spin;
     nodeInfosByName[ii].speed=inMemoryObjects[ii-1].speed;
    }
  },
  ["Random Texture"]:function(){
    x=randInt(0,6);
    nodeInfosByName[objectControl.selectedObj].node.drawInfo.uniforms.u_texture=myTexturesArray[x];
  }
}


const interfaceGUI = () => {
  gui = new dat.GUI();


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
  

  var manipObjFolder = gui.addFolder('Manipulate Objects');
  objIndex = manipObjFolder.add(objectControl,"selectedName",objectControl.arrayOfObjects);
    //manipObjFolder.add(objectControl,"tudogira");
  objIsSpining = manipObjFolder.add(objectControl,"spin");
  objSpinSpeed = manipObjFolder.add(objectControl,"speed", 0, 6, 0.1);
  lookTexture = manipObjFolder.add(objectControl,"texture",tex);
  manipObjFolder.add(objectControl,"Random Texture")
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
    objectControl.speed = nodeInfosByName[x].speed;
    objectControl.spin = nodeInfosByName[x].isSpining;
    objectControl.texture = nodeInfosByName[x].node.drawInfo.uniforms.u_texture;

    gui.destroy();
    interfaceGUI();
  })

  objIsSpining.onChange(function(value){
      nodeInfosByName[objectControl.selectedObj].isSpining = value;
      //console.log(nodeInfosByName[objectControl.selectedObj].isSpining+','+objectControl.selectedObj);
  })

  objSpinSpeed.onChange(function(value){
    nodeInfosByName[objectControl.selectedObj].speed=value;
  })

  const manipScene = gui.addFolder('Manipulate Scene')
    manipScene.add(objectControl,"Add Wood Crate");
    manipScene.add(objectControl,"Add Nitro Crate");
    manipScene.add(objectControl,"Add TNT Crate");
    manipScene.add(objectControl,"Add Life Crate");
    manipScene.add(objectControl,"Add Rock Block");
    manipScene.add(objectControl,"Add 4 side dice");
    //manipScene.add(sceneControl,"Load car");
    manipScene.add(objectControl,"Add triangule");


  const manipCamera = gui.addFolder('Manipulate Cameras')
    manipCamera.add(cameraControl,"selectedCamera",cameraControl.arrayOfCameras).onChange(function(value){
      cameraControl.cameraPosX=myCameras[value-1].posX;
      cameraControl.cameraPosY=myCameras[value-1].posY;
      cameraControl.cameraPosZ=myCameras[value-1].posZ;
      gui.destroy();
      interfaceGUI();
    })

    manipCamera.add(cameraControl,"cameraPosX",-50, 50,0.1).onChange(function(value){
      myCameras[cameraControl.selectedCamera-1].posX=value;
    })
    manipCamera.add(cameraControl,"cameraPosY",-50, 50, 0.1).onChange(function(value){
      myCameras[cameraControl.selectedCamera-1].posY=value;
    })
    manipCamera.add(cameraControl,"cameraPosZ",-50,50,0.1).onChange(function(value){
      myCameras[cameraControl.selectedCamera-1].posZ=value;
    })
    manipCamera.add(cameraControl,"Adicionar Camera");

}

