//"use strict";

/*
var vs = `#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}
`;

var fs = `#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec4 v_color;

uniform vec4 u_colorMult;
uniform vec4 u_colorOffset;

out vec4 outColor;

void main() {
   outColor = v_color * u_colorMult + u_colorOffset;
}
`;
*/
 

function main() {
  //1º passo:
  //Cria contexto WEBGL e Programa (Vertex Shader + Fragment Shadder)
  const {gl, programInfo} = makeGLContextAndProgram();

  //2º passo:
  //criar Buffer do objeto e o VAO que tem: (ContextoWebgl,programa,buffer de objeto)
  var cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 4);
  var cubeVAO = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);


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
          bufferInfo: cubeBufferInfo,
          vertexArray: cubeVAO,
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

    gl.enable(gl.CULL_FACE);
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