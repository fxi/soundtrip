/* jshint esversion:6 */
import './style.css';
//import {SoundCloud} from './soundcloud.js';
import {Visualiser} from './visualiser.js';
import {Player} from './player.js';
import {Controller} from './controller.js';

var elCanvas = document.getElementById('anim');

init();

function init() {
  /**
   * Sound visualiser
   */
  var visualiser = new Visualiser({
    elCanvas: elCanvas,
    width: window.innerWidth,
    height: window.innerHeight,
    options : {}
  });

  /**
   * Player
   */
  var player = new Player({
    onData: visualiser.draw.bind(visualiser),
    options : {}
  });

  /**
  * Controller
  */
  window.controller = new Controller({
    player : player,
    visualiser : visualiser
  });


  /**
  * Listener
  */

  elCanvas.addEventListener('mousemove', function(e) {
    visualiser.setPosition({
      x: e.clientX,
      y: e.clientY
    });
  });

  elCanvas.addEventListener('mouseleave', function() {
    visualiser.setPosition({
      x: elCanvas.width / 2,
      y: elCanvas.height / 2
    });
  });

  window.addEventListener('resize', function() {
    visualiser.setSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  });
}
