var numberOfObjects;
var myObjectVAO;
var myObjectBufferInfo;
var objectsToDraw;
var objects;
var listOfObjId;
var nodeInfosByName;
var gl,programInfo;
var sceneDescription;
var scene;

function makeNode(nodeDescription) {
  var trs  = new TRS();
  var node = new Node(trs);

  nodeInfosByName[nodeDescription.name] = {
    trs: trs,
    node: node,
  };
  trs.translation = nodeDescription.translation || trs.translation;
  if (nodeDescription.draw !== false) {
        node.drawInfo = {
        uniforms: {
          u_colorMult: [1, 1, 1, 1],
          //u_matrix: m4.identity(),
        },
        programInfo: programInfo,
        bufferInfo: myObjectBufferInfo,
        vertexArray: myObjectVAO,
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

const calculateBarycentric = (length) => {
  const n = length / 6;
  const barycentric = [];
  for (let i = 0; i < n; i++) barycentric.push(1, 0, 0, 0, 1, 0, 0, 0, 1);
  return barycentric;
};

//funcao que carrega um novo objeto atraves do arquivo
function loadNewObject(value){
  var objectData;
  numberOfObjects++;

  //Cria um request para leitura de arquivo
  const request = new XMLHttpRequest();
  //URL do arquivo solicitado
  let url = "";
  switch(value){
    case 1:
      url = "./objects/d6dice.json";
      break;
    case 2:
      url = "./objects/d4dice.json";
      break;
    case 3:
      url = "./objects/car.json";
      break;
  }

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
    objectData.objID= `${numberOfObjects}`;
    listOfObjId.push(objectData.objID);
  }
  else
  {
    console.log("ERRO NA LEITURA DE ARQUIVO");
    return;
  }

  //Printa o conteudo do objeto
  console.log('New OBJ data:');
  console.log(objectData);






  //cria os buffers através do array no objeto recebido
  myObjectBufferInfo = twgl.createBufferInfoFromArrays(gl,objectData.arrays)
  //cria o VAO baseado nos buffers
  myObjectVAO = twgl.createVAOFromBufferInfo(gl, programInfo, myObjectBufferInfo);

  var newObj = {
    name: `${numberOfObjects}`,
    objID: numberOfObjects,
    translation: [0, 0, 0],
    children: [],
    bufferInfo: myObjectBufferInfo,
    vao: myObjectVAO,
  }

  //insere o objeto na cena
  addObjectToScene(newObj);

  console.log('nodeInfosByName');
  console.log(nodeInfosByName);

  console.log('ObjectsToDraw:');
  console.log(objectsToDraw);

  console.log('Objects:');
  console.log(objects);

  console.log('sceneDescription');
  console.log(sceneDescription);
}

//insere o objeto na cena e recria a cena
function addObjectToScene(obj){

  sceneDescription.children.push(obj);

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};

  scene = makeNode(sceneDescription);
}


function main() {

"use strict";

  //1º passo:
  //Cria contexto WEBGL e Programa (Vertex Shader + Fragment Shadder)
  gl = makeGlContext();
  programInfo = makeProgram(gl);
  
  //cameraGUI();
  //blueGUI();
  //greenGUI();
  

  numberOfObjects = 0;
  objectsToDraw = [];
  objects = [];
  listOfObjId=[];
  nodeInfosByName = {};
  




  // cria a cena em formato de arvore
  sceneDescription =
    {
      name: "origin",
      draw: false,
      children: [],
    };


  scene = makeNode(sceneDescription);
  //console.log("tipo: "+typeof(nodeInfosByName));

  loadNewObject(1);
  

  //addObjectToScene();
  
  //criar lista de objetos e lista de objetos para desenhar (alguns podem não ser desenhados)
  //cada objeto será um nodo da scena, a origem será um nodo também


   //Configura FOV
  var fieldOfViewRadians = degToRad(60);
 
  interfaceGUI();
  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(time) {
    time *= 0.001;
    

    twgl.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 200);

    // Compute the camera's matrix using look at.
    var cameraPosition = [cameraControl.cameraPosX, cameraControl.cameraPosY, cameraControl.cameraPosZ];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
  

    if(objectControl.spin){
      nodeInfosByName[objectControl.selectedObj].trs.rotation[1]= (time*objectControl.speed)*objectControl.spin;
    }
    else
    {
      nodeInfosByName[objectControl.selectedObj].trs.rotation[1]= objectControl.rotateY;
    }


    //controla a animação e velocidade de rotação dos objetos
    



    nodeInfosByName[objectControl.selectedObj].trs.translation= [objectControl.positionX,objectControl.positionY,objectControl.positionZ];
    nodeInfosByName[objectControl.selectedObj].trs.rotation[0]= objectControl.rotateX;
    nodeInfosByName[objectControl.selectedObj].trs.rotation[2]= objectControl.rotateZ;
    nodeInfosByName[objectControl.selectedObj].trs.scale= [objectControl.scale,objectControl.scale,objectControl.scale];


    // Update all world matrices in the scene graph
    scene.updateWorldMatrix();

    // Compute all the matrices for rendering
    objects.forEach(function(object) {
        object.drawInfo.uniforms.u_matrix = m4.multiply(viewProjectionMatrix, object.worldMatrix);
    });

    
   
    
    // ------ Draw the objects --------
    twgl.drawObjectList(gl, objectsToDraw);

    requestAnimationFrame(drawScene);
  }
}

main();