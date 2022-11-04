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

var vts = `#version 300 es
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec2 a_texcoord;

// A matrix to transform the positions by
uniform mat4 u_matrix;

// a varying to pass the texture coordinates to the fragment shader
out vec2 v_texcoord;

// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
`;//vertex TEXTURE shader

var vTs2 = `#version 300 es
uniform mat4 u_worldViewProjection;

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_matrix;

out vec4 v_position;
out vec2 v_texCoord;

void main() {
  v_texCoord = a_texcoord;
  gl_Position = u_worldViewProjection * a_position;
}
`;//another textures vertex shader

var fs = `#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec4 v_color;

uniform vec4 u_colorMult;

out vec4 outColor;

void main() {
   outColor = v_color * u_colorMult;
}
`;

var fts= `#version 300 es

precision highp float;

// Passed in from the vertex shader.
in vec2 v_texcoord;

// The texture.
uniform sampler2D u_texture;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  outColor = texture(u_texture, v_texcoord);
}
`;//fragment TEXTURE shader

var fTs2= `#version 300 es
precision mediump float;

in vec4 v_position;
in vec2 v_texCoord;

uniform vec4 u_diffuseMult;
uniform sampler2D u_diffuse;

void main() {
  vec4 diffuseColor = texture2D(u_diffuse, v_texCoord) * u_diffuseMult;
  if (diffuseColor.a < 0.1) {
    discard;
  }
  gl_FragColor = diffuseColor;
}
`;//fragment TEXTURE shader



function makeGlContext(){
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }
  return gl;
}

function makeProgram(gl){
  twgl.setAttributePrefix("a_");
  var programInfo = twgl.createProgramInfo(gl, [vts, fts]);

return programInfo;
}
