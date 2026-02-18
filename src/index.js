/* jshint esversion:6 */
import './style.css';
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
    options: {}
  });

  /**
   * Player
   */
  var player = new Player({
    options: {}
  });

  /**
   * Wire data: visualiser pulls from player when playing
   */
  visualiser.setDataSource(function() {
    if (player.isPlaying()) {
      return player.getData();
    }
    return null;
  });

  /**
   * Start the always-running render loop
   */
  visualiser.start();

  /**
   * Controller
   */
  window.controller = new Controller({
    player: player,
    visualiser: visualiser
  });

  /**
   * Listeners
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
