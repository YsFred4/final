  'use strict';

  // Global variables that are set and used
  // across the application
  let gl;

  // GLSL programs
  let wireframe_program = null;
  let phong_program = null;
  let texture_program = null;
  let cur_program = null;
  
  // VAOs for the objects
  var wfCube = null;
  var wfCylinder = null;
  var wfCone = null;
  var wfSphere = null;

  var phongCube = null;
  var phongCylinder = null;
  var phongCone = null;
  var phongSphere = null;

  var textureCube = null;
  var textureCylinder = null;
  var textureCone = null;
  var textureSphere = null;

  // textures
  var worldTexture = null;

  // rotation
  var anglesReset = [0.0, 0.0, 0.0];
  var angles = [0.0, 0.0, 0.0];
  var angleInc = 5.0;

  // Shader choice
  //let cur_shader = 'wireframe';
  let cur_shader = 'phong';
  //let cur_shader = 'texture';
  

//
// create shapes and VAOs for objects.
// Note that you will need to bindVAO separately for each object / program based
// upon the vertex attributes found in each program
//
function createShapes() {
    
    // Wireframe
    //cube
    wfCube = new Cube (5,5);
    wfCube.VAO = bindVAO (wfCube, wireframe_program, true, false, false);
    
    //sphere
    wfSphere = new Sphere (20,20);
    wfSphere.VAO = bindVAO (wfSphere, wireframe_program, true, false, false);
    
    // cylinder
    wfCylinder = new Cylinder (20,20);
    wfCylinder.VAO = bindVAO (wfCylinder, wireframe_program, true, false, false);
    
    // cone
    wfCone = new Cone (20,20);
    wfCone.VAO = bindVAO (wfCone, wireframe_program, true, false, false);
    
    // Phong
    //cube
    phongCube = new Cube (5,5);
    phongCube.VAO = bindVAO (phongCube, phong_program, false, true, false);
    
    //sphere
    phongSphere = new Sphere (100,100);
    phongSphere.VAO = bindVAO (phongSphere, phong_program, false, true, false);
    
    // cylinder
    phongCylinder = new Cylinder (20,20);
    phongCylinder.VAO = bindVAO (phongCylinder, phong_program, false, true, false);
    
    // cone
    phongCone = new Cone (20,20);
    phongCone.VAO = bindVAO (phongCone, phong_program, false, true, false);
    
    // Texture
    setUpTextures();
    
    //cube
    textureCube = new Cube (5,5);
    textureCube.VAO = bindVAO (textureCube, texture_program, false, false, true);
    
    //sphere
    textureSphere = new Sphere (100,100);
    textureSphere.VAO = bindVAO (textureSphere, texture_program, false, false, true);
    
    // cylinder
    textureCylinder = new Cylinder (20,20);
    textureCylinder.VAO = bindVAO (textureCylinder, texture_program, false, false, true);
    
    // cone
    textureCone = new Cone (20,20);
    textureCone.VAO = bindVAO (textureCone, texture_program, false, false, true);
}


//
// Here you set up your camera position, orientation, and projection
// Remember that your projection and view matrices are sent to the vertex shader
// as uniforms, using whatever name you supply in the shaders
//
function setUpCamera(program) {
    
    gl.useProgram (program);
    
    // set up your projection
    let projMatrix = glMatrix.mat4.create();
    //glMatrix.mat4.perspective(projMatrix, 45.0, 1.0, 1.0, 300.0);
    glMatrix.mat4.ortho(projMatrix, -4, 4, -4, 4, 1.0, 300.0);
    gl.uniformMatrix4fv (program.uProjT, false, projMatrix);

    
    // set up your view
    let viewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(viewMatrix, [0.0, -10.0, 10.0], [0, 0, 0], [0, 1, 0]);
    gl.uniformMatrix4fv (program.uViewT, false, viewMatrix);
}


//
// load up the textures you will use in the shader(s)
// The setup for the globe texture is done for you
// Any additional images that you include will need to
// set up as well.
//
function setUpTextures(){
    
    // flip Y for WebGL
    gl.pixelStorei (gl.UNPACK_FLIP_Y_WEBGL, true);
    
    // get some texture space from the gpu
    worldTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, worldTexture);
    
    // load the actual image
    var worldImage = document.getElementById ('world-texture')
    worldImage.crossOrigin = "";
        
    // bind the texture so we can perform operations on it
    gl.bindTexture (gl.TEXTURE_2D, worldTexture);
        
    // load the texture data
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, worldImage.width, worldImage.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, worldImage);
        
    // set texturing parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}

//
//  This function draws all of the shapes required for your scene
//
    function drawShapes() {
    
        if (cur_shader == 'wireframe' ) {
            setUpCamera (wireframe_program);
            drawWireframe ();
        }
        if (cur_shader == 'phong') {
            setUpCamera (phong_program);
            drawPhong();
        }
        
        if (cur_shader == 'texture') {
            setUpCamera (texture_program);
            drawTexture();
        }
    }

    function drawTexture () {
    
        let program = texture_program;
        gl.useProgram (program);
   
        // same rotation for all
        gl.uniform3fv (program.uTheta, new Float32Array(angles));
        
        // set up texture uniform & other uniforms that you might
        // have added to the shader
        gl.activeTexture (gl.TEXTURE0);
        gl.bindTexture (gl.TEXTURE_2D, worldTexture);
        gl.uniform1i (program.uTheTexture, 0);
    
        // draw the cube
        gl.bindVertexArray(textureCube.VAO);
        gl.uniform3fv (program.uMTrans, [-3.0,0.0,0.0]);
        gl.drawElements(gl.TRIANGLES, textureCube.indices.length, gl.UNSIGNED_SHORT, 0);
    
        // draw the sphere
        gl.bindVertexArray(textureSphere.VAO);
        gl.uniform3fv (program.uMTrans, [-1.0,0.0,0.0]);
        gl.drawElements(gl.TRIANGLES, textureSphere.indices.length, gl.UNSIGNED_SHORT, 0);
    
        // draw the cylinder
        gl.bindVertexArray(textureCylinder.VAO);
        gl.uniform3fv (program.uMTrans, [1.0,0.0,0.0]);
        gl.drawElements(gl.TRIANGLES, textureCylinder.indices.length, gl.UNSIGNED_SHORT, 0);
    
        // draw the cone
        gl.bindVertexArray(textureCone.VAO);
        gl.uniform3fv (program.uMTrans, [3.0,0.0,0.0]);
        gl.drawElements(gl.TRIANGLES, textureCone.indices.length, gl.UNSIGNED_SHORT, 0);
      
}
    
    function drawWireframe () {
        
            let program = wireframe_program;
            gl.useProgram (program);
       
            // same rotation for all
            gl.uniform3fv (program.uTheta, new Float32Array(angles));
        
            // draw the cube
            gl.bindVertexArray(wfCube.VAO);
            gl.uniform3fv (program.uMTrans, [-3.0,0.0,0.0]);
            gl.drawElements(gl.TRIANGLES, wfCube.indices.length, gl.UNSIGNED_SHORT, 0);
        
            // draw the sphere
            gl.bindVertexArray(wfSphere.VAO);
            gl.uniform3fv (program.uMTrans, [-1.0,0.0,0.0]);
            gl.drawElements(gl.TRIANGLES, wfSphere.indices.length, gl.UNSIGNED_SHORT, 0);
        
            // draw the cylinder
            gl.bindVertexArray(wfCylinder.VAO);
            gl.uniform3fv (program.uMTrans, [1.0,0.0,0.0]);
            gl.drawElements(gl.TRIANGLES, wfCylinder.indices.length, gl.UNSIGNED_SHORT, 0);
        
            // draw the cone
            gl.bindVertexArray(wfCone.VAO);
            gl.uniform3fv (program.uMTrans, [3.0,0.0,0.0]);
            gl.drawElements(gl.TRIANGLES, wfCone.indices.length, gl.UNSIGNED_SHORT, 0);
          
    }

    function drawPhong () {
        
        let program = phong_program;
        gl.useProgram(program);
       
        // same rotation for all
        gl.uniform3fv (program.uTheta, new Float32Array(angles));
        
        // set up the uniforms for the phong model
        let amb = [1.0, 1.0, 1.0];
        let lightPos = [1.0, 0.0, 10.0];
        let lightC = [1.0, 1.0, 1.0];
        let baseC = [1.0, 0.0, 0.0];
        let specC = [1.0, 1.0, 1.0];
        let ka = 0.2;
        let kd = 0.4;
        let ks = 0.4;
        let ke = 6.0;
        
        gl.useProgram (program);
        
        gl.uniform3fv (program.ambientLight, amb);
        gl.uniform3fv (program.lightPosition, lightPos);
        gl.uniform3fv (program.lightColor, lightC);
        gl.uniform3fv (program.baseColor, baseC);
        gl.uniform3fv (program.specHighlightColor, specC);
        
        gl.uniform1f (program.ka, ka);
        gl.uniform1f (program.kd, kd);
        gl.uniform1f (program.ks, ks);
        gl.uniform1f (program.ke, ke);
        
        // set phong parameters for all
        
        // draw the cube
        gl.bindVertexArray(phongCube.VAO);
        gl.uniform3fv (program.uMTrans, [-3.0,0.0,0.0]);
        gl.drawElements(gl.TRIANGLES, phongCube.indices.length, gl.UNSIGNED_SHORT, 0);
        
        // draw the sphere
        gl.bindVertexArray(phongSphere.VAO);
        gl.uniform3fv (program.uMTrans, [-1.0,0.0,0.0]);
        gl.drawElements(gl.TRIANGLES, phongSphere.indices.length, gl.UNSIGNED_SHORT, 0);
        
        // draw the cylinder
        gl.bindVertexArray(phongCylinder.VAO);
        gl.uniform3fv (program.uMTrans, [1.0,0.0,0.0]);
        gl.drawElements(gl.TRIANGLES, phongCylinder.indices.length, gl.UNSIGNED_SHORT, 0);
        
        // draw the cone
        gl.bindVertexArray(phongCone.VAO);
        gl.uniform3fv (program.uMTrans, [3.0,0.0,0.0]);
        gl.drawElements(gl.TRIANGLES, phongCone.indices.length, gl.UNSIGNED_SHORT, 0);
          
    }


  //
  // Use this function to create all the programs that you need
  // You can make use of the auxillary function initProgram
  // which takes the name of a vertex shader and fragment shader
  //
  // Note that after successfully obtaining a program using the initProgram
  // function, you will beed to assign locations of attribute and unifirm variable
  // based on the in variables to the shaders.   This will vary from program
  // to program.
  //
  function initPrograms() {
    
    // wireframe shader
    wireframe_program = initProgram ('wireframe-V', 'wireframe-F');
    addLocations (wireframe_program, true, false, false);
      
    // phong shader
    phong_program = initProgram ('phong-V', 'phong-F');
    addLocations (phong_program, false, true, false);
    phong_program.ambientLight = gl.getUniformLocation (phong_program, 'ambientLight');
    phong_program.lightPosition = gl.getUniformLocation (phong_program, 'lightPosition');
    phong_program.lightColor = gl.getUniformLocation (phong_program, 'lightColor');
    phong_program.baseColor = gl.getUniformLocation (phong_program, 'baseColor');
    phong_program.specHighlightColor = gl.getUniformLocation (phong_program, 'specHighlightColor');
    phong_program.ka = gl.getUniformLocation (phong_program, 'ka');
    phong_program.kd = gl.getUniformLocation (phong_program, 'kd');
    phong_program.ks = gl.getUniformLocation (phong_program, 'ks');
    phong_program.ke = gl.getUniformLocation (phong_program, 'ke');
      
    // texture shader
    texture_program = initProgram ('texture-V', 'texture-F');
    addLocations (texture_program, false, false, true);
    texture_program.uTheTexture = gl.getUniformLocation (texture_program, 'theTexture');
  }

  // addsAttribute and Uniform location to programs
  function addLocations (program, needBary, needNormals, needUV) {
    
    gl.useProgram(program);
    // all programs will need vertex positions
    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
      
    // optional atributes
    if (needBary) program.aBary = gl.getAttribLocation(program, 'aBary');
    if (needNormals) program.aNormal = gl.getAttribLocation(program, 'aNormal');
    if (needUV) program.aUV = gl.getAttribLocation(program, 'aUV');
      
    // all programs will need transformation params
    program.uTheta = gl.getUniformLocation (program, 'theta');
    program.uMTrans = gl.getUniformLocation (program, 'mTrans');
    program.uViewT = gl.getUniformLocation (program, 'viewT');
    program.uProjT = gl.getUniformLocation (program, 'projT');
  }


  // creates a VAO and returns its ID
  function bindVAO (shape, program, needBary, needNormals, needUV) {
      //create and bind VAO
      let theVAO = gl.createVertexArray();
      gl.bindVertexArray(theVAO);
      
      // create and bind vertex buffer
      let myVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aVertexPosition);
      gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
      
      // create and bind bary buffer
      if (needBary) {
          let myBaryBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, myBaryBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.bary), gl.STATIC_DRAW);
          gl.enableVertexAttribArray(program.aBary);
          gl.vertexAttribPointer(program.aBary, 3, gl.FLOAT, false, 0, 0);
      }
      
      // create and bind normal buffer
      if (needNormals) {
          let myNormalBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, myNormalBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.normals), gl.STATIC_DRAW);
          gl.enableVertexAttribArray(program.aNormal);
          gl.vertexAttribPointer(program.aNormal, 3, gl.FLOAT, false, 0, 0);
      }
      
      // create and bind bary buffer
      if (needUV) {
          let myUVBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, myUVBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.uv), gl.STATIC_DRAW);
          gl.enableVertexAttribArray(program.aUV);
          gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, false, 0, 0);
      }
      
      // Setting up the IBO
      let myIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);

      // Clean
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      
      return theVAO;
  }


/////////////////////////////////////////////////////////////////////////////
//
//  You shouldn't have to edit anything below this line...but you can
//  if you find the need
//
/////////////////////////////////////////////////////////////////////////////

// Given an id, extract the content's of a shader script
// from the DOM and return the compiled shader
function getShader(id) {
  const script = document.getElementById(id);
  const shaderString = script.text.trim();

  // Assign shader depending on the type of shader
  let shader;
  if (script.type === 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  else if (script.type === 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }
  else {
    return null;
  }

  // Compile the shader using the supplied shader code
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  // Ensure the shader is valid
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}


  //
  // compiles, loads, links and returns a program (vertex/fragment shader pair)
  //
  // takes in the id of the vertex and fragment shaders (as given in the HTML file)
  // and returns a program object.
  //
  // will return null if something went wrong
  //
  function initProgram(vertex_id, fragment_id) {
    const vertexShader = getShader(vertex_id);
    const fragmentShader = getShader(fragment_id);

    // Create a program
    let program = gl.createProgram();
      
    // Attach the shaders to this program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
      return null;
    }
      
    return program;
  }


  //
  // We call draw to render to our canvas
  //
  function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
    // draw your shapes
    drawShapes();

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  // Entry point to our application
  function init() {
      
    // Retrieve the canvas
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
      return null;
    }

    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);

    // Retrieve a WebGL context
    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error(`There is no WebGL 2.0 context`);
        return null;
      }
      
    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);
      
    // Set the clear color to be black
    gl.clearColor(0, 0, 0, 1);
      
    // some GL initialization
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.clearColor(0.0,0.0,0.0,1.0)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)

    // Read, compile, and link your shaders
    initPrograms();
    
    // create and bind your current object
    createShapes();
    
    // do a draw
    draw();
  }
