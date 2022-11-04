var numberOfObjects;
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
var myTexturesArray;
var newObjTexture;

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
          u_texture: nodeDescription.texture,
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
  console.log("!!!!!!!!!!!!!!!");
  console.log(nodeDescriptions);
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
  //console.clear();

  //Cria um request para leitura de arquivo
  const request = new XMLHttpRequest();
  //URL do arquivo solicitado
  let url = "";
  switch(value){
    case 1:
      url = "./objects/d6dice.json";
      break;
    case 2:
      url = "./objects/d6dice.json";
      break;
    case 3:
      url = "./objects/d6dice.json";
      break;
    case 4:
      url = "./objects/d6dice.json";
      break;
    case 5:
      url = "./objects/d4dice.json";
      break;
    case 6:
      url = "./objects/car.json";
      break;
    case 7:
      url = "./objects/triangule.json";
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

  objectData.arrays.normals = calculateNormal(objectData.arrays.position,objectData.arrays.indices);
  objectData.arrays.barycentric = calculateBarycentric(objectData.arrays.position.length);

  //cria os buffers através do array no objeto recebido
  newObjectBufferInfo = twgl.createBufferInfoFromArrays(gl,objectData.arrays)
  //cria o VAO baseado nos buffers
  newObjectVAO = twgl.createVAOFromBufferInfo(gl, programInfo, newObjectBufferInfo);
  newObjTexture = myTexturesArray[value];


  var newObj = {
    name: `${numberOfObjects}`,
    objID: numberOfObjects,
    translation: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    children: [],
    texture: myTexturesArray[value-1],
    bufferInfo: newObjectBufferInfo,
    vao: newObjectVAO,
  }
 
  //loadTextures(value);

    //Printa o conteudo do objeto
    console.log('=====New OBJ data:========');
    console.log(newObj);

  //insere o objeto na cena
  addObjectToScene(newObj);
}

//insere o objeto na cena e recria a cena
function addObjectToScene(obj,value){

  sceneDescription.children.push(obj);

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};

  scene = makeNode(sceneDescription,value);

  console.log('====OBJETO INSERIDO NA CENA - CENA ATUAL');
  console.log('nodeInfosByName');
  console.log(nodeInfosByName);
  
  console.log('ObjectsToDraw:');
  console.log(objectsToDraw);
  
  console.log('Objects:');
  console.log(objects);
  
  console.log('sceneDescription');
  console.log(sceneDescription);
}

/*function loadTextures(value){

  console.log('=====CARREGANDO TEXTURAS====');
  var texture = gl.createTexture();

  // use texture unit 0
  gl.activeTexture(gl.TEXTURE0 + 0);

  // bind to the TEXTURE_2D bind point of texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  // Asynchronously load an image
  var image = new Image();
  switch(value){
    case 1:
      image.src = "/textures/woodcrate.png";
      break;
    case 2:
      image.src = "/textures/nitro.png";
      break;
    case 3:
      image.src = "/textures/tnt.jpg";
      break;
    case 4:
      image.src = "/textures/life.jpeg";
      break;
  }
  
  image.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    console.log(texture);
  });
}*/

function loadTextures2(){
  console.log('CARREGANDO VARIOS TEXTURAS');

  tex = twgl.createTextures(gl, {crate:{src:"/textures/woodcrate.png"},
                                nitro:{src:"/textures/nitro.png"},
                                tnt:{src:"/textures/tnt.jpg"},
                                life:{src:"/textures/life.jpeg"}});

  myTexturesArray =[
    tex.crate,
    tex.nitro,
    tex.tnt,
    tex.life
  ]
  console.log("printa carai!")
  console.log(tex.crate.src);
  console.log(tex.tnt.src);
  console.log(myTexturesArray);

}

function main() {

"use strict";

var x = 0;
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
  myTexturesArray = [];
  




  // cria a cena em formato de arvore
  sceneDescription =
    {
      name: "origin",
      draw: false,
      children: [],
    };


  scene = makeNode(sceneDescription);
  //console.log("tipo: "+typeof(nodeInfosByName));

  //loadNewObject(1);
  

  //addObjectToScene();
  
  //criar lista de objetos e lista de objetos para desenhar (alguns podem não ser desenhados)
  //cada objeto será um nodo da scena, a origem será um nodo também


   //Configura FOV
  var fieldOfViewRadians = degToRad(60);
 
  interfaceGUI();
  console.log(sceneDescription);
  //loadTextures(1);
  loadTextures2();
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
  

    if(sceneDescription.children.length!=0){//Verifica se a cena não esta vazia
      if(objectControl.tudogira){
        for(ii=1;ii<=numberOfObjects;ii++){
          nodeInfosByName[ii].trs.rotation[1]= (time*objectControl.speed)*objectControl.tudogira;
        }

      }else{
        if(objectControl.spin){
          nodeInfosByName[objectControl.selectedObj].trs.rotation[1]= (time*objectControl.speed)*objectControl.spin;
        }
        else
        {
          nodeInfosByName[objectControl.selectedObj].trs.rotation[1]= objectControl.rotateY;
        }
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
          //twgl.setTextureFromElement(gl, tex.crate, canvas);
      });

     
  
      

      if(x==0){
        console.log(objectsToDraw);
        x=1;
      }
      // ------ Draw the objects --------
      twgl.drawObjectList(gl, objectsToDraw);
    }
    

    requestAnimationFrame(drawScene);
  }
}

main();