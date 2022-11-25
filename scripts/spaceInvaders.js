var numberOfObjects;
var cameraCounter;
var lightCounter;
var newObjectVAO;
var newObjectBufferInfo;
var objectsToDraw;
var objects;
var listOfObjId;
var nodeInfosByName;
var gl,programInfo;
var sceneDescription;
var scene;
var ii;
var tex;
var bufferInfoArray;
var vaoArray;
var then;
var enemyCounter;
var arrayOfObjects;

var palette = {
  corLuz: [255, 255, 255], // RGB array
  corCubo: [255, 255, 255], // RGB array
  corSpec: [255, 255, 255], // RGB array
};

var arrLuz = [
  new Luz([4, 0, 0], [255, 255, 255], [255, 255, 255], 300),
  new Luz([-4, 0, 0], [255, 255, 255], [255, 255, 255], 300),
  new Luz([5, 4, 8], [255, 255, 255], [255, 255, 255], 300),
];

function makeNode(nodeDescription) {
  //console.log('A');

  //console.log(nodeDescription.name);

  var trs  = new TRS();
  var node = new Node(trs);

  nodeInfosByName[nodeDescription.name] = {
    trs: trs,
    origin: nodeDescription.originalPosition,
    node: node,
    isSpining: false,
    speed: 3,
  };

  trs.translation = nodeDescription.translation || trs.translation;
  if (nodeDescription.draw !== false) {
        node.drawInfo = {
        uniforms: {
          //u_colorMult: [1, 1, 1, 1],
          u_texture: tex[nodeDescription.texture],
          u_matrix: m4.identity(),
        },
        programInfo: programInfo,
        bufferInfo: nodeDescription.bufferInfo,
        vertexArray: nodeDescription.vao,
      };
      objectsToDraw.push(node.drawInfo);
      objects.push(node);
  }
  makeNodes(nodeDescription.children).forEach(function(child) {
    child.setParent(node);
  });
  return node;
}

function makeNodes(nodeDescriptions) {
  return nodeDescriptions ? nodeDescriptions.map(makeNode) : [];
}


//Calcula as baricentricas dos arrays
const calculateBarycentric = (length) => {
  const n = length / 6;
  const barycentric = [];
  for (let i = 0; i < n; i++) barycentric.push(1, 0, 0, 0, 1, 0, 0, 0, 1);
  return barycentric;
};

//funcao que carrega um novo objeto atraves do arquivo ===============================
function loadNewObject(objShape,objTexture){
  
  //limpa o console para ver os dados
  //console.clear()
  
  

  //monta um objeto novo para ser inserido na cena
  var newObj = {
    name: ``,
    //objID: numberOfObjects,
    translation: [0, 0, 0],
    //rotation: [0, 0, 0],
    //scale: [1, 1, 1],
    children: [],
    //carrega a textura do array de texturas
    texture: objTexture,
    //carega bufferInfo e Vao dos respectivos arrays
    bufferInfo: bufferInfoArray[objShape],
    vao: vaoArray[objShape],
  }

  if(objShape==3){
    if(objTexture=="cam"){
      newObj.name=`cam${cameraCounter}`;
      newObj.translation = [0,5,20];
    }
    if(objTexture=="lamp"){
      newObj.name=`light${lightCounter}`
      newObj.translation = [0,5,0];
    }
  }else{
    numberOfObjects++;
    newObj.name=`${numberOfObjects}`;
    objectControl.arrayOfObjects.push(newObj.name);
  }

  

  //Printa o conteudo do objeto
  console.log('Inserindo novo objeto na cena! Dados do objeto:');
  console.log(newObj);

  //insere o objeto na cena
  addObjectToScene(newObj);
}

//insere o objeto na cena e recria a cena ==================================
function addObjectToScene(obj){

  //Coloca o objeto como "filho da origem"
  sceneDescription.children.push(obj);

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};

  //recria a cena com o novo objeto
  //console.log('antes:'+scene);
  scene = makeNode(sceneDescription);
  gui.destroy();
  gui=null;
  //console.log('depois:'+scene);

  console.log('_______Situação atual dos arrays_______');
  console.log('nodeInfosByName');
  console.log(nodeInfosByName);
  
  console.log('ObjectsToDraw:');
  console.log(objectsToDraw);
  
  console.log('Objects:');
  console.log(objects);
  
  console.log('sceneDescription');
  console.log(sceneDescription);
}


//==================================================================================
function loadTextures(){
  console.log('Loading textures...')

  //Carrega todas as texturas das URLS para dentro da variavel tex
  tex = twgl.createTextures(gl, {crate:{src:"/textures/woodcrate.png"},
                                nitro:{src:"/textures/nitro.png"},
                                tnt:{src:"/textures/tnt.jpg"},
                                life:{src:"/textures/life.jpeg"},
                                d4dice:{src:"/textures/d4.jpg"},
                                illuminati:{src:"/textures/illuminati.jpg"},
                                rock:{src:"/textures/rocks.jpg"},
                                lamp:{src:"/textures/lamp.png"},
                                cam:{src:"/textures/cam.png"}});

  //seta um array de texturas para serem acessadas pelo seus indices
  
  textureNames = ['crate','nitro','tnt','life','d4dice','illuminati','rock','lamp','cam'];

}
//========================================================================
function loadObjBufferInfoAndVao(){
  console.log('Loading Obj Infos')

  let objectData;

  //armazena todas as URLS das descrições dos objetos
  let urls =["./objects/cube.json",
            "./objects/triPyramid.json",
            "./objects/triangule.json",
            "./objects/smallCube.json"
          ]

  let request = new XMLHttpRequest();

  //realiza o request SINCRONO para todas as urls (PS: Pode demorar se tiver muitos itens)
  urls.forEach(function(url){
    //realiza o GET do arquivo (false = força que seja sincrono - estava tendo problemas com leitura assincrona)
    request.open("GET",url,false);
    request.send(null);
    //se encontrou o arquivo, copia os dados que estao em formato texto e realiza o parse para JSON Object
    if (request.status === 200) {
      //copia dos dados em formato texto
      let data=request.response;
      //realiza o PARSE para formato JSON
      //objectData cointem os dados (buffers e ID) do objeto a ser carregado
      objectData = JSON.parse(data);
      //console.log(objectData);
  }
  else
  {
    console.log("ERRO NA LEITURA DE ARQUIVO");
    return;
  }

  //console.log(objectData);

  //calcula as normais e baricentricas de cada objeto adicionado
  objectData.arrays.normals = calculateNormal(objectData.arrays.position,objectData.arrays.indices);
  objectData.arrays.barycentric = calculateBarycentric(objectData.arrays.position.length);

  //cria os buffers através do array no objeto recebido
  newObjectBufferInfo = twgl.createBufferInfoFromArrays(gl,objectData.arrays)
  //cria o VAO baseado nos buffers
  newObjectVAO = twgl.createVAOFromBufferInfo(gl, programInfo, newObjectBufferInfo);
  
  //Insere bufferInfos e VAOS nos respectivos arrays 
  bufferInfoArray.push(newObjectBufferInfo);
  vaoArray.push(newObjectVAO);
})
}
//==========================================================================

function insereInimigosNaCena(qtd){
var j;

    for(j=1;j<=qtd;j++){
        for(i=1;i<=qtd;i++){
            let newObj = {
                name: `${numberOfObjects}`,
                //objID: numberOfObjects,
                translation: [i*4, j*4, 0],
                originalPosition: [i*4, j*4, 0],
                //rotation: [0, 0, 0],
                //scale: [1, 1, 1],
                children: [],
                //carrega a textura do array de texturas
                texture: 'nitro',
                //carega bufferInfo e Vao dos respectivos arrays
                bufferInfo: bufferInfoArray[0],
                vao: vaoArray[0],
            }
            numberOfObjects++;
            newObj.name=`${numberOfObjects}`;
            arrayOfObjects.push(newObj.name);
            sceneDescription.children.push(newObj);
    
    
            newObj = {
                name: `${numberOfObjects}`,
                //objID: numberOfObjects,
                translation: [-i*4, j*4, 0],
                originalPosition: [-i*4, j*4, 0],
                //rotation: [0, 0, 0],
                //scale: [1, 1, 1],
                children: [],
                //carrega a textura do array de texturas
                texture: 'nitro',
                //carega bufferInfo e Vao dos respectivos arrays
                bufferInfo: bufferInfoArray[0],
                vao: vaoArray[0],
            }
            numberOfObjects++;
            newObj.name=`${numberOfObjects}`;
            arrayOfObjects.push(newObj.name);
            sceneDescription.children.push(newObj);
              }
    }
}

function main() {

//"use strict";

  //1º passo:
  //Cria contexto WEBGL e Programa (Vertex Shader + Fragment Shadder)
  gl = makeGlContext();
  programInfo = makeProgram(gl);
  
  //cameraGUI();
  //blueGUI();
  //greenGUI();
  
  then=0;
  numberOfObjects = 0;
  cameraCounter = 0;
  lightCounter=0;
  objectsToDraw = [];
  objects = [];
  arrayOfObjects = [];
  //listOfObjId=[];
  nodeInfosByName = {};
  bufferInfoArray = [];
  vaoArray = [];
  enemyCounter=2;

  
  //Carrega as meshs dos objetos
  loadObjBufferInfoAndVao();
  //console.log('objBufferInfo´s');
  //console.log(bufferInfoArray);
  //console.log('objVAO´s');
  //console.log(vaoArray);
  
  //Carrega todas as texturas
  loadTextures();
  //console.log('All Textures');
  //console.log(textureNames);


  //Insere manualmente a primeira luz
  /*
  lightCounter++;
  let newLight ={

    name:`light${lightCounter}`,
    index: lightCounter,
    selectedLight: 1,
    posX: 0,
    posY: 5,
    posZ: 0,
    color: [255,255,255],
    specular: [255,255,255],
    shininess:300,
  }
  myLights.push(newLight);
  lightControl.arrayOfLights.push(newLight.index);
  */

  //insere manuelamente a primeira camera
  cameraCounter++;
  let newCamera = {
    name:`cam${cameraCounter}`,
    posX:0,
    posY:4,
    posZ:20,
    lookAtX: 0,
    lookAtY: 0,
    lookAtZ: 0,
    upX:0,
    upY:1,
    upZ:0,
  }
  myCameras.push(newCamera);
  cameraControl.arrayOfCameras.push(cameraCounter);

  
  // cria a cena em formato de arvore
  sceneDescription =
    {
      name: "origin",
      index: numberOfObjects,
      translation: [0,0,0],
      rotation: [0,0,0],
      scale: [0,0,0],
      draw: false,
      children: [
        {
            name: `cam${cameraCounter}`,
            index:cameraCounter,
            draw: true,
            translation: [cameraControl.posX, cameraControl.posY, cameraControl.posZ],
            texture: "cam",
            bufferInfo: bufferInfoArray[3],
            vao: vaoArray[3],
            children: [],
        },
        {
          name: `player`,
          index:1,
          draw: true,
          translation: [0, -7, 0],
          texture: "life",
          bufferInfo: bufferInfoArray[0],
          vao: vaoArray[0],
          children: [],
        },
        {
            name: `2`,
            index:2,
            draw: true,
            translation: [0, 3, 0],
            texture: "nitro",
            bufferInfo: bufferInfoArray[0],
            vao: vaoArray[0],
            children: [],
        },    
      ],
    };

  //Carrega interface
  if(gui == null){
    interfaceGUI();
  }
  
  //Cria cena inicial apenas com a origem nela

  //insereInimigosNaCena(enemyCounter);

  scene = makeNode(sceneDescription);


  //Configura FOV
  var fieldOfViewRadians = degToRad(60);

  console.log('_______Situação atual dos arrays_______');
  console.log('nodeInfosByName');
  console.log(nodeInfosByName);
  
  console.log('ObjectsToDraw:');
  console.log(objectsToDraw);
  
  console.log('Objects:');
  console.log(objects);
  
  console.log('sceneDescription');
  console.log(sceneDescription);

  var modifier = 0.75;

  const bodyElement = document.querySelector("body");

    
    //var fRotationRadians = degToRad(uiObj.rotation.y);
    bodyElement.addEventListener("keydown", gameAction , false );
    //bodyElement.addEventListener("keypress", cFunction , false );
  
    function gameAction(event){
      switch(event.key){
          case 'a': nodeInfosByName['player'].trs.translation[0]-=modifier;
          break;
          case 'A': nodeInfosByName['player'].trs.translation[0]-=modifier;
          break;
          case '4': nodeInfosByName['player'].trs.translation[0]-=modifier;
          break;
          case 'd': nodeInfosByName['player'].trs.translation[0]+=modifier;
          break;
          case 'D': nodeInfosByName['player'].trs.translation[0]+=modifier;
          break;
          case '6': nodeInfosByName['player'].trs.translation[0]+=modifier;
          break;
          case 'w': nodeInfosByName['player'].trs.translation[1]+=modifier;
          break;
          case 'W': nodeInfosByName['player'].trs.translation[1]+=modifier;
          break;
          case '8': nodeInfosByName['player'].trs.translation[1]+=modifier;
          break;
          case 's': nodeInfosByName['player'].trs.translation[1]-=modifier;
          break;
          case 'S': nodeInfosByName['player'].trs.translation[1]-=modifier;
          break;
          case '5': nodeInfosByName['player'].trs.translation[1]-=modifier;
          break;
          }   
    }



  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(time) {
    time *= 0.001;
    if(gui == null){
      interfaceGUI();
    }
    

    twgl.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 200);

    // Compute the camera's matrix using look at.
    var cameraPosition = [cameraControl.posX, cameraControl.posY, cameraControl.posZ];
    var target = [cameraControl.lookAtX, cameraControl.lookAtY, cameraControl.lookAtZ];
    var up = [cameraControl.upX, cameraControl.upY, cameraControl.upZ];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    if(sceneDescription.children.length!=0){//verifica se a cena não esta vazia


      var deltaTime = time - then;
      then = time;
      var adjust;
      var speed = 3;
      var c = time * speed;
      //console.log(deltaTime);
      //console.log(time);

      adjust = Math.sin(c);
      //console.log(adjust);

      for(ii=1;ii<=numberOfObjects;ii++)
      {
        //console.log(nodeInfosByName[ii].isSpining);

        nodeInfosByName[ii].trs.translation[0]=nodeInfosByName[ii].origin[0]+(adjust*2);
        //nodeInfosByName[ii].trs.translation[1]=nodeInfosByName[ii].trs.translation[1]+(adjust);
      }



        if(objectControl.isObjectSelected && objectControl.selectedObj!=null){//meu objeto esta selecionado?  
          if(objectControl.spin){//meu objeto esta marcado para girar sozinho?
            //nodeInfosByName[objectControl.selectedObj].trs.rotation[1]= (time*objectControl.speed)*objectControl.spin;
          }
          else//se nao esta eu giro ele na mao
          {
            nodeInfosByName[objectControl.selectedObj].trs.rotation[1]= objectControl.rotateY;
          }
          nodeInfosByName[objectControl.selectedObj].trs.translation= [objectControl.positionX,objectControl.positionY,objectControl.positionZ];
          nodeInfosByName[objectControl.selectedObj].trs.rotation[0]= objectControl.rotateX;
          nodeInfosByName[objectControl.selectedObj].trs.rotation[2]= objectControl.rotateZ;
          nodeInfosByName[objectControl.selectedObj].trs.scale= [objectControl.scaleX,objectControl.scaleY,objectControl.scaleZ];       
    }


  
      // Update all world matrices in the scene graph
      scene.updateWorldMatrix();
  
      // Compute all the matrices for rendering
      objects.forEach(function(object) {
        
        object.drawInfo.uniforms.u_matrix = m4.multiply(
          viewProjectionMatrix,
          object.worldMatrix
        );

        
        object.drawInfo.uniforms.u_world = object.worldMatrix;
    
        object.drawInfo.uniforms.u_worldInverseTranspose = m4.transpose(
          m4.inverse(object.worldMatrix)
        );
    
        object.drawInfo.uniforms.u_viewWorldPosition = cameraPosition;
    
      });
      
      // ------ Draw the objects --------
      twgl.drawObjectList(gl, objectsToDraw);
    }   

    requestAnimationFrame(drawScene);
  }
}

main();