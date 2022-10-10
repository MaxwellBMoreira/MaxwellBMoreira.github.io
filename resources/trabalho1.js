function main() {

"use strict";

  //1º passo:
  //Cria contexto WEBGL e Programa (Vertex Shader + Fragment Shadder)
  const {gl, programInfo} = makeGLContextAndProgram();


  
  //Cria um request para leitura de arquivo
  const request = new XMLHttpRequest();
  //URL do arquivo solicitado
  const url = "./objects/quad.json";
  //realiza o GET do arquivo (false = força que seja sincrono - estava tendo problemas com leitura assincrona)
  request.open("GET",url,false);
  request.send(null);
  //se encontrou o arquivo, copia os dados que estao em formato texto e realiza o parse para JSON Object
  if (request.status === 200) {
    //copia dos dados em formato texto
    let data=request.response;
    //realiza o PARSE para formato JSON
    //meuObjeto é o objeto que será utilizado
    var meuObjeto = JSON.parse(data);
  }
  else
  {
    console.log("ERRO NA LEITURA DE ARQUIVO");
    return;
  }

  //Printa o conteudo do objeto
  console.log("ObjectID: "+meuObjeto.objID);
  console.log("Position: "+meuObjeto.arrays.position.data);
  console.log("UV Coord: "+meuObjeto.arrays.texcoord.data);
  console.log("Indices: "+meuObjeto.arrays.indices.data);
  console.log("Colors: "+meuObjeto.arrays.color.data);

  //cria os buffers através do array no objeto recebido
  var myObjectBufferInfo = twgl.createBufferInfoFromArrays(gl,meuObjeto.arrays)
  //cria o VAO baseado nos buffers
  var myObjectVAO = twgl.createVAOFromBufferInfo(gl, programInfo, myObjectBufferInfo);


  var objectsToDraw = [];
  var objects = [];
  var nodeInfosByName = {};



  // cria a cena em formato de arvore
  var sceneDescription =
    {
      name: "origin",
      draw: false,
      children: [
        {
          name: "red",
        },
        {
          name: "green",
        },
        {
          name: "blue",
        }
      ],
    };

  function makeNode(nodeDescription) {
    var trs  = new TRS();
    var node = new Node(trs);
    var actualName = nodeDescription.name;

    nodeInfosByName[nodeDescription.name] = {
      trs: trs,
      node: node,
    };
    trs.translation = nodeDescription.translation || trs.translation;
    if (nodeDescription.draw !== false) {
          node.drawInfo = {
          uniforms: {
            u_colorMult: [0, 0, 0, 1],
            u_matrix: m4.identity(),
          },
          programInfo: programInfo,
          bufferInfo: myObjectBufferInfo,
          vertexArray: myObjectVAO,
        };
        switch(actualName){
          case 'red':
            node.drawInfo.uniforms.u_colorMult = [1, 0, 0, 1];
            break;
          case 'green':
            node.drawInfo.uniforms.u_colorMult = [0, 1, 0, 1];
            break;
          case 'blue':
            node.drawInfo.uniforms.u_colorMult = [0, 0, 1, 1];
            break;
        }
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

  var scene = makeNode(sceneDescription);
  
  //criar lista de objetos e lista de objetos para desenhar (alguns podem não ser desenhados)
  //cada objeto será um nodo da scena, a origem será um nodo também

  cameraGUI();
  blueGUI();
  greenGUI();
  redGUI();


   //Configura FOV
   var fieldOfViewRadians = degToRad(60);

  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(time) {
    time *= 0.001;

    twgl.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    //gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix =
        m4.perspective(fieldOfViewRadians, aspect, 1, 200);

    // Compute the camera's matrix using look at.
    var cameraPosition = [cameraControl.cameraPosX, cameraControl.cameraPosY, cameraControl.cameraPosZ];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    
    //controla a animação e velocidade de rotação dos objetos
    nodeInfosByName["red"].trs.rotation[1]= (time*redControl.speed)*redControl.animate;
    nodeInfosByName["green"].trs.rotation[1]= (time*greenControl.speed)*greenControl.animate;
    nodeInfosByName["blue"].trs.rotation[1]= (time*blueControl.speed)*blueControl.animate;


    nodeInfosByName["red"].trs.translation= [redControl.positionX,redControl.positionY,redControl.positionZ];
    nodeInfosByName["green"].trs.translation= [greenControl.positionX,greenControl.positionY,greenControl.positionZ];
    nodeInfosByName["blue"].trs.translation= [blueControl.positionX,blueControl.positionY,blueControl.positionZ];

    nodeInfosByName["red"].trs.scale= [redControl.scale,redControl.scale,redControl.scale];
    nodeInfosByName["green"].trs.scale= [greenControl.scale,greenControl.scale,greenControl.scale];
    nodeInfosByName["blue"].trs.scale= [blueControl.scale,blueControl.scale,blueControl.scale];


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