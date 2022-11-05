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
var bufferInfoArray;
var vaoArray;

function makeNode(nodeDescription) {
  //console.log('A');

  console.log(nodeDescription.name);

  var trs  = new TRS();
  var node = new Node(trs);

  nodeInfosByName[nodeDescription.name] = {
    trs: trs,
    node: node,
    isSpining: false,
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
  console.clear()

  numberOfObjects++;

  //monta um objeto novo para ser inserido na cena
  var newObj = {
    name: `${numberOfObjects}`,
    objID: numberOfObjects,
    translation: [0, 0, 0],
    //rotation: [0, 0, 0],
    //scale: [1, 1, 1],
    children: [],
    //carrega a textura do array de texturas
    texture: myTexturesArray[objTexture],
    //carega bufferInfo e Vao dos respectivos arrays
    bufferInfo: bufferInfoArray[objShape],
    vao: vaoArray[objShape],
  }

  objectControl.arrayOfObjects.push(newObj.name);

  //Printa o conteudo do objeto
  console.log('Inserindo novo objeto na cena! Dados do objeto:');
  console.log(newObj);

  //insere o objeto na cena
  addObjectToScene(newObj);
}

function loadNewObject2(objShape,objTexture){
  
  //limpa o console para ver os dados
  console.clear()

  numberOfObjects++;

  //monta um objeto novo para ser inserido na cena
  var newObj = {
    name: `${numberOfObjects}`,
    objID: numberOfObjects,
    translation: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    children: [],
    //carrega a textura do array de texturas
    texture: myTexturesArray[objTexture],
    //carega bufferInfo e Vao dos respectivos arrays
    bufferInfo: bufferInfoArray[objShape],
    vao: vaoArray[objShape],
  }

  objectControl.arrayOfObjects.push(newObj.name);
  gui.destroy();
  interfaceGUI();
 
  //Printa o conteudo do objeto
  console.log('Inserindo novo objeto na cena! Dados do objeto:');
  console.log(newObj);

  //insere o objeto na cena
  //addObjectToScene(newObj);
  sceneDescription.children.push(obj);
  scene = makeNode(sceneDescription);
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
                                d4:{src:"/textures/d4.jpg"},
                                tri:{src:"/textures/tri.jpg"}});

  //seta um array de texturas para serem acessadas pelo seus indices
  myTexturesArray =[
    tex.crate,
    tex.nitro,
    tex.tnt,
    tex.life,
    tex.d4,
    tex.tri
  ]
}
//========================================================================
function loadObjBufferInfoAndVao(){
  console.log('Loading Obj Infos')

  let objectData;

  //armazena todas as URLS das descrições dos objetos
  let urls =["./objects/cube.json",
            "./objects/triPyramid.json",
            "./objects/triangule.json"
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
function main() {

//"use strict";

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
  bufferInfoArray = [];
  vaoArray = [];
  




  // cria a cena em formato de arvore
  sceneDescription =
    {
      name: "origin",
      translation: [0,0,0],
      rotation: [0,0,0],
      scale: [0,0,0],
      draw: false,
      children: [],
    };

  //Cria cena inicial apenas com a origem nela
  scene = makeNode(sceneDescription);

  //Configura FOV
  var fieldOfViewRadians = degToRad(60);
  //Carrega interface
  if(gui == null){
    interfaceGUI();
  }

 
  //Carrega as meshs dos objetos
  loadObjBufferInfoAndVao();
  console.log('objBufferInfo´s');
  console.log(bufferInfoArray);
  console.log('objVAO´s');
  console.log(vaoArray);
  
  //Carrega todas as texturas
  loadTextures();
  console.log('All Textures');
  console.log(myTexturesArray);



  console.log(sceneDescription);



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
    var cameraPosition = [cameraControl.cameraPosX, cameraControl.cameraPosY, cameraControl.cameraPosZ];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
  
    var fRotationRadians = degToRad(uiObj.rotation.y);

    if(sceneDescription.children.length!=0){//verifica se a cena não esta vazia


      /*if(objectControl.tudogira){
        for(ii=1;ii<=numberOfObjects;ii++){
          nodeInfosByName[ii].trs.rotation[1]= (time*objectControl.speed)*objectControl.tudogira;
        }
      }*/


      if(objectControl.isObjectSelected){//meu objeto esta selecionado?  
            if(objectControl.spin){//meu objeto esta marcado para girar sozinho?
              nodeInfosByName[objectControl.selectedObj].trs.rotation[1]= (time*objectControl.speed)*objectControl.spin;
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
          object.drawInfo.uniforms.u_matrix = m4.multiply(viewProjectionMatrix, object.worldMatrix);

          //object.drawInfo.uniforms.u_world = m4.multiply(object.worldMatrix, m4.yRotation(fRotationRadians));

          //object.drawInfo.uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(object.worldMatrix));
          
          //object.drawInfo.uniforms.u_viewWorldPosition = cameraPosition;
          //twgl.setTextureFromElement(gl, tex.crate, canvas);
      });

     
  
      
      // ------ Draw the objects --------
      twgl.drawObjectList(gl, objectsToDraw);
    }
    

    requestAnimationFrame(drawScene);
  }
}

main();