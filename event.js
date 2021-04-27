  'use strict';

  function gotKey (event) {
      
      var key = event.key;
      
      //  incremental rotation
      if (key == 'x')
          angles[0] -= angleInc;
      else if (key == 'y')
          angles[1] -= angleInc;
      else if (key == 'z')
          angles[2] -= angleInc;
      else if (key == 'X')
          angles[0] += angleInc;
      else if (key == 'Y')
          angles[1] += angleInc;
      else if (key == 'Z')
          angles[2] += angleInc;

      // reset
      else if (key == 'r' || key=='R') {
          angles[0] = anglesReset[0];
          angles[1] = anglesReset[1];
          angles[2] = anglesReset[2];
      }
      
      // Different shaders
      else if (key =='t') {
          cur_shader = 'texture'
      }
      else if (key =='w') {
          cur_shader = 'wireframe'
      }
      else if (key =='p') {
          cur_shader = 'phong'
      }
      
      
      // create a new shape and do a redo a draw
      draw();
  }
  
