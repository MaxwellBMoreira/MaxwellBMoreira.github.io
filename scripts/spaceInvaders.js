/*
Desenvolvido por: Maxwell Burke Moreira
Disciplina de Computação Gráfica
Univeirsidade Federal de Pelotas

maxwellburkemoreira@gmail.com
mbmoreira@inf.ufpel.edu.br
linkedin.com/in/maxwell-moreira-257902181/

*/

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
var enemyRows;
var enemyLines;
var enemyCounter;
var arrayOfObjects;
var maxShot;
var shotCounter;
var shotCounterEnemy;
var gameOver;
var lastShotTime;
var tempoAcumulado;
var listaDeInimigos;

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
    isAlive: true,
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
      node.name=nodeDescription.name;
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
    //objectControl.arrayOfObjects.push(newObj.name);
  }

  

  //Printa o conteudo do objeto
  //console.log('Inserindo novo objeto na cena! Dados do objeto:');
  //console.log(newObj);

  //insere o objeto na cena
  addObjectToScene(newObj);
}

function criarDisparoInimigo(objShape,objTexture,origem){
  
  //limpa o console para ver os dados
  //console.clear()
  
  

  //monta um objeto novo para ser inserido na cena
  var newObj = {
    name: ``,
    //objID: numberOfObjects,
    translation: [origem[0],
                  origem[1],
                  origem[2]-0.5],
    //rotation: [0, 0, 0],
    //scale: [1, 1, 1],
    children: [],
    //carrega a textura do array de texturas
    texture: objTexture,
    //carega bufferInfo e Vao dos respectivos arrays
    bufferInfo: bufferInfoArray[objShape],
    vao: vaoArray[objShape],
  }

    shotCounterEnemy++;
    newObj.name=`enemyShot${shotCounterEnemy}`;
    //objectControl.arrayOfObjects.push(newObj.name);

  

  //Printa o conteudo do objeto
  //console.log('BANG!');
  //console.log(newObj);

  //insere o objeto na cena
  addObjectToScene(newObj);
}


function criarDisparo(objShape,objTexture){
  
  //limpa o console para ver os dados
  //console.clear()
  
  

  //monta um objeto novo para ser inserido na cena
  var newObj = {
    name: ``,
    //objID: numberOfObjects,
    translation: [nodeInfosByName['player'].trs.translation[0],
                  nodeInfosByName['player'].trs.translation[1],
                  nodeInfosByName['player'].trs.translation[2]-0.5],
    //rotation: [0, 0, 0],
    //scale: [1, 1, 1],
    children: [],
    //carrega a textura do array de texturas
    texture: objTexture,
    //carega bufferInfo e Vao dos respectivos arrays
    bufferInfo: bufferInfoArray[objShape],
    vao: vaoArray[objShape],
  }

    shotCounter++;
    newObj.name=`shot${shotCounter}`;
    //objectControl.arrayOfObjects.push(newObj.name);

  

  //Printa o conteudo do objeto
  //console.log('BANG!');
  //console.log(newObj);

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

  scene = makeNode(sceneDescription);

}


//==================================================================================
function loadTextures(){
  console.log('Loading textures...')

  //Carrega todas as texturas das URLS para dentro da variavel tex
  tex = twgl.createTextures(gl, {nitro:{src:"/textures/cratenitro.png"},
                                life:{src:"/textures/vida.jpeg"},
                                cam:{src:"/textures/cam.png"},
                                nave:{src:"/textures/nave1.jpg"},
                                plane:{src:"/textures/crashPlane.png"},
                                wumpa:{src:"/textures/wumpa.png"},
                                cortex:{src:"/textures/cortex.png"}});

  //seta um array de texturas para serem acessadas pelo seus indices
  
  textureNames = ['crate','nitro','tnt','life','d4dice','illuminati','rock','lamp','cam'];

}
//========================================================================
function loadObjBufferInfoAndVao(){
  console.log('Loading Obj Infos')

  let objectData;

  //armazena todas as URLS das descrições dos objetos
  let urls =["./objects/cube.json",
            "./objects/smallCube.json",
            "./objects/shot.json",
            "./objects/nave.json",
            "./objects/bigCube.json",
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
  //console.log(objectData.arrays.normals);
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

function insereInimigosNaCena(rows,lines){
  let j;
  let varI = 0.25;
  let varJ = 1.5;
  let yPos = 20;

  rows=rows/2;
    for(j=1;j<=lines;j++){
        for(i=1;i<=rows;i++){
          numberOfObjects++;  
          let newObj = {
                name: `enemy${numberOfObjects}`,
                //objID: numberOfObjects,
                translation: [i+varI, yPos+varJ, 0],
                originalPosition: [i+varI, yPos+varJ, 0],
                //rotation: [0, 0, 0],
                //scale: [1, 1, 1],
                children: [],
                //carrega a textura do array de texturas
                texture: 'cortex',
                //carega bufferInfo e Vao dos respectivos arrays
                bufferInfo: bufferInfoArray[0],
                vao: vaoArray[0],
            }
            //newObj.name=`${numberOfObjects}`;
            //arrayOfObjects.push(newObj.name);
            listaDeInimigos.push(newObj.name);
            sceneDescription.children.push(newObj);
    
            numberOfObjects++;
            newObj = {
                name: `enemy${numberOfObjects}`,
                //objID: numberOfObjects,
                translation: [-i-varI, yPos+varJ, 0],
                originalPosition: [-i-varI, yPos+varJ, 0],
                //rotation: [0, 0, 0],
                //scale: [1, 1, 1],
                children: [],
                //carrega a textura do array de texturas
                texture: 'cortex',
                //carega bufferInfo e Vao dos respectivos arrays
                bufferInfo: bufferInfoArray[0],
                vao: vaoArray[0],
            }
            //newObj.name=`${numberOfObjects}`;
            //arrayOfObjects.push(newObj.name);
            listaDeInimigos.push(newObj.name);
            sceneDescription.children.push(newObj);
            

            varI = varI + 1.5;
            }
            varI = 0.25;
            varJ= varJ+3;
    }
}

const checkColision2=(obj, shot)=>{

  if(
      (shot[0] < obj[0] + 2)
    &&(shot[0] + 1 > obj[0])
    &&(shot[1] < obj[1]+2)
    &&(1 + shot[1]> obj[1]) 
  ){
    return true;
  }else{
    return false;
  }

}

const checkColisionPlayer=(obj, shot)=>{

  if((shot[0] < obj[0] + 2)
    &&(shot[0] + 2.5 > obj[0])
    &&(shot[1] < obj[1]+2)
    &&(2.5 + shot[1]> obj[1]) 
  ){
    return true;
  }else{
    return false;
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
  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};
  bufferInfoArray = [];
  vaoArray = [];
  maxShot=5;
  shotCounter=0;
  shotCounterEnemy=0;
  enemyRows=10;
  enemyLines=6;
  enemyCounter=enemyLines*enemyRows;
  gameOver=0;
  var isMusicPLaying=0;
  var hitsTaken=0;
  var enemyShotProb=[1,5];
  var hitChance;
  var gameStart=0;
  listaDeInimigos=[];

  tempoAcumulado=0;
  lastShotTime=0;

  var backgroundMusic = new Audio("/audio/crashBandicootLvlOneTheme.mp3");
  backgroundMusic.muted=false;
  backgroundMusic.volume=0.05;

  var enemyHitSound = new Audio("/audio/enemyPlaneHit.wav");
  enemyHitSound.muted=false;
  enemyHitSound.volume=0.01;

  var enemyFallSound = new Audio("/audio/enemyPlaneFall.wav");
  enemyFallSound.muted=false;
  enemyFallSound.volume=0.03;

  var shotSound = new Audio("/audio/shot.wav");
  shotSound.muted=false;
  shotSound.volume=0.03;

  var playerHitSound = new Audio("/audio/playerHit.wav");
  playerHitSound.muted=false;
  playerHitSound.volume=0.05;

  var crystalSound = new Audio("/audio/crystal.mp3");
  crystalSound.muted=false;
  crystalSound.volume=0.15;

  var gameOverSound = new Audio("/audio/gameOver.mp3");
  gameOverSound.muted=false;
  gameOverSound.volume=0.15;


  

  
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
          name: `player`,
          index:1,
          draw: true,
          translation: [0, -7, 0],
          texture: "plane",
          bufferInfo: bufferInfoArray[4],
          vao: vaoArray[4],
          children: [
            {
              name: `life1`,
              index:2,
              draw: true,
              translation: [-1, -3, 0],
              texture: "life",
              bufferInfo: bufferInfoArray[1],
              vao: vaoArray[1],
              children: [],
            },
            {
              name: `life2`,
              index:3,
              draw: true,
              translation: [0, -3, 0],
              texture: "life",
              bufferInfo: bufferInfoArray[1],
              vao: vaoArray[1],
              children: [],
            },
            {
              name: `life3`,
              index:3,
              draw: true,
              translation: [1, -3, 0],
              texture: "life",
              bufferInfo: bufferInfoArray[1],
              vao: vaoArray[1],
              children: [],
            }
          ],
        },
      ],
    };

  //Carrega interface
  if(gui == null){
    interfaceGUI();
  }
  
  //Cria cena inicial apenas com a origem nela
  enemyCounter=enemyRows*enemyLines;
  insereInimigosNaCena(enemyRows,enemyLines);

  scene = makeNode(sceneDescription);


  //Configura FOV
  var fieldOfViewRadians = degToRad(60);

  /*console.log('_______Situação atual dos arrays_______');
  console.log('nodeInfosByName');
  console.log(nodeInfosByName);
  
  console.log('ObjectsToDraw:');
  console.log(objectsToDraw);
  
  console.log('Objects:');
  console.log(objects);
  
  console.log('sceneDescription');
  console.log(sceneDescription);
  */

  var modifier = 0.75;
  var hitCounter=0;

  const bodyElement = document.querySelector("body");

    
    //var fRotationRadians = degToRad(uiObj.rotation.y);
    bodyElement.addEventListener("keydown", gameAction , false );
    //bodyElement.addEventListener("keypress", cFunction , false );
  
    function gameAction(event){

      gameStart=1;
      backgroundMusic.play();
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
          case 'w':
            criarDisparo(1,"wumpa");
            shotSound.play();
          break;
          case 'W':
            criarDisparo(1,"wumpa");
            shotSound.play();
          break;
          case '8': 
            criarDisparo(1,"wumpa");
            shotSound.play();
          break;    
          }   
    }

  alert("Use as teclas A e D para mover, W para atirar. Ou 4 e 6 para mover e 8 para atirar! Pressione qualquer tecla para começar!!");
  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(time) {
    time *= 0.001;

    if(gui == null){
      interfaceGUI();
    }
    //console.clear();
    

    twgl.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 200);

    //console.log(time);
    var deltaTime = time - then;
    then = time;
    var adjustSide;
    var adjustTop;
    var speed = 1.8;
    var c = time * speed;

    adjustSide = Math.sin(c);
    adjustTop = Math.cos(c);
    tempoAcumulado+=deltaTime;
    //console.log(tempoAcumulado);


    // Compute the camera's matrix using look at.
    var cameraPosition = [cameraControl.posX, cameraControl.posY, cameraControl.posZ];
    var target = [cameraControl.lookAtX, cameraControl.lookAtY, cameraControl.lookAtZ];
    var up = [cameraControl.upX, cameraControl.upY, cameraControl.upZ];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    if(sceneDescription.children.length!=0){//verifica se a cena não esta vazia
      if(gameStart==1){
 
      for(ii=1;ii<=numberOfObjects;ii++)
      {
        //console.log(nodeInfosByName[ii].isSpining);
        if(nodeInfosByName[`enemy${ii}`].isAlive==true){ 
          nodeInfosByName[`enemy${ii}`].trs.translation[0]=nodeInfosByName[`enemy${ii}`].origin[0]+(adjustSide*4);
          nodeInfosByName[`enemy${ii}`].trs.translation[1]-=deltaTime;

          hitChance=randInt(0,7000);
          if(hitChance>=enemyShotProb[0]&&hitChance<=enemyShotProb[1]){
            criarDisparoInimigo(1,"nitro",nodeInfosByName[`enemy${ii}`].trs.translation);         
          }


          if(
            (checkColisionPlayer(nodeInfosByName[`enemy${ii}`].trs.translation,nodeInfosByName[`player`].trs.translation))
            ||nodeInfosByName[`enemy${ii}`].trs.translation[1]<nodeInfosByName[`player`].trs.translation[1]-3){
            //alert("GAME OVER");
            playerHitSound.play();
            gameOver=1;
          break;
          }
        }
      }
      //console.log(shotCounter);
      for(i=1;i<=shotCounter;i++){
        if(nodeInfosByName[`shot${i}`]!=null){
          nodeInfosByName[`shot${i}`].trs.translation[1]+=deltaTime*speed*15;
          nodeInfosByName[`shot${i}`].trs.rotation[1]+=deltaTime*speed*5;
          nodeInfosByName[`shot${i}`].trs.rotation[2]-=deltaTime*speed*5;
          //console.log(nodeInfosByName[`shot${i}`].trs.translation[1]);


          for(ii=1;ii<=numberOfObjects;ii++)
          {
            if((nodeInfosByName[`enemy${ii}`].isAlive==true)
            &&(checkColision2(nodeInfosByName[`enemy${ii}`].trs.translation,nodeInfosByName[`shot${i}`].trs.translation))){
              nodeInfosByName[`enemy${ii}`].trs.translation[1]=990;
              nodeInfosByName[`enemy${ii}`].isAlive=false;
              nodeInfosByName[`shot${i}`].trs.translation[1]=999;
              hitCounter++;
              enemyHitSound.play();
              enemyFallSound.play();
              if(hitCounter>=enemyCounter){
                gameOver=1;
              }
              break;
            } 
          }
          
        }
      }

      for(i=1;i<=shotCounterEnemy;i++){
        if(nodeInfosByName[`enemyShot${i}`]!=null){
          nodeInfosByName[`enemyShot${i}`].trs.translation[1]-=deltaTime*speed*5;
          nodeInfosByName[`enemyShot${i}`].trs.rotation[1]+=deltaTime*speed*5;
          nodeInfosByName[`enemyShot${i}`].trs.rotation[2]-=deltaTime*speed*5;
          //console.log(nodeInfosByName[`shot${i}`].trs.translation[1]);

            if((nodeInfosByName[`enemyShot${i}`]!=null)
            &&(checkColisionPlayer(nodeInfosByName[`player`].trs.translation,nodeInfosByName[`enemyShot${i}`].trs.translation))){
              nodeInfosByName[`enemyShot${i}`].trs.translation[1]=-999;
              hitsTaken++;
              nodeInfosByName[`life${hitsTaken}`].trs.translation[2]=999;
              playerHitSound.play();
              if(hitsTaken>=3){
                gameOver=1;
              }
              break;
            } 
        }
      }
      }

      // Update all world matrices in the scene graph
      scene.updateWorldMatrix();
  
      // Compute all the matrices for rendering
      // objects.forEach(function(object) {

      //     object.drawInfo.uniforms.u_lightWorldPosition = [

      //       0,0,10
      //       //nodeInfosByName['player'].trs.translation[0],
      //       //nodeInfosByName['player'].trs.translation[1]+0.5,
      //       //nodeInfosByName['player'].trs.translation[2],
      //     ];
      
      //     object.drawInfo.uniforms.u_lightColor = [
      //       1,1,1
      //     ];
      
      //     object.drawInfo.uniforms.u_specularColor = [
      //      1,1,1
      //     ];
        
      //   object.drawInfo.uniforms.u_worldViewProjection = m4.multiply(
      //     viewProjectionMatrix,
      //     object.worldMatrix
      //   );
  
      //   object.drawInfo.uniforms.u_world = object.worldMatrix;
    
      //   object.drawInfo.uniforms.u_worldInverseTranspose = m4.transpose(
      //     m4.inverse(object.worldMatrix)
      //   );
    
      //   object.drawInfo.uniforms.u_viewWorldPosition = cameraPosition;


      //   object.drawInfo.uniforms.u_shininess = 300;
    
      // });

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
    if(!gameOver){
      requestAnimationFrame(drawScene);
    }else{
      if(hitCounter>=enemyCounter){
        backgroundMusic.pause();
        crystalSound.play();
        alert("You Win!!");
       
      }else{
        backgroundMusic.pause();
        gameOverSound.play();
        alert("You Lost!! Game Over!");
      }
    }
  }
}

main();