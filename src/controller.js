import * as dat from 'dat.gui';
import {Player} from './player.js';
import {Visualiser} from './visualiser.js';
import {mapMode} from './options.js';
export {Controller};

function Controller(config) {
  const ctrl = this;
  config = config || {};
  const hasPlayer = config.player instanceof Player;
  const hasVisualiser = config.visualiser instanceof Visualiser;
  if (!hasVisualiser || !hasPlayer) {
    return;
  }
  ctrl.player = config.player;
  ctrl.visualiser = config.visualiser;
  ctrl.init();
  return ctrl;
}

Controller.prototype.init = function() {
  const ctrl = this;
  ctrl.initGui();
  ctrl.initPlaybar();
};

Controller.prototype.initGui = function() {
  const ctrl = this;
  const gui = new dat.GUI();
  const visHeight = ctrl.visualiser.height;
  const visWidth = ctrl.visualiser.width;
  const oV = ctrl.visualiser.getOptions();
  const oP = ctrl.player.getOptions();

  /**
   * Player folder
   */
  const gPlayer = gui.addFolder('Player');
  gPlayer.open();
  const gPlayerPlaybackRate = gPlayer.add(oP, 'playbackRate', 0.01, 2);
  gPlayer.add(oP, 'smoothing', 0, 1);

  /**
   * Visualiser folder
   */
  const gVis = gui.addFolder('Visualiser');
  gVis.addColor(oV, 'backColor');
  gVis.add(oV, 'backAlpha', 0, 1);
  gVis.add(oV, 'scaleFactor', 0.8, 1.2);
  gVis.add(oV, 'gravity', -20, 20);
  gVis.add(oV, 'rotateSpeed', -0.5, 0.5);
  const gVisMode = gVis.add(oV, 'mode', ['polar', 'rainbow', 'grid']);
  const gVisPolar = gVis.addFolder('polar mode');
  gVisPolar.close();
  gVisPolar.addColor(oV, 'polarColor');
  gVisPolar.add(oV, 'polarColorAuto');
  gVisPolar.add(oV, 'polarAmplitude', 0, 2);
  gVisPolar.add(oV, 'polarBaseRadius', 0, 300);
  gVisPolar.add(oV, 'polarLineWidth', 0, 5);
  const gVisRainbow = gVis.addFolder('rainbow mode');
  gVisRainbow.add(oV, 'rainbowWidthFactor', 5, 10);
  gVisRainbow.add(oV, 'rainbowOffsetX', -visWidth / 2, visWidth / 2);
  gVisRainbow.add(oV, 'rainbowOffsetY', -visHeight / 2, visHeight / 2);
  const gVisGrid = gVis.addFolder('grid mode');
  gVisGrid.add(oV, 'gridAmplitude', 0, 3);
  gVisGrid.add(oV, 'gridRows', 4, 40).step(1);
  gVisGrid.add(oV, 'gridPerspective', 0, 1);
  gVisGrid.add(oV, 'gridSpacing', 5, 50);
  gVisPolar.hide();
  gVisPolar.close();
  gVisGrid.hide();
  gVisGrid.close();

  ctrl.gui = gui;

  /**
   * Events
   */
  gPlayerPlaybackRate.onFinishChange(function(value) {
    ctrl.player.setPlaybackRate(value);
  });
  gVisMode.onFinishChange(function(mode) {
    var res = mapMode[mode];
    var player = ctrl.player;
    for (var n in res) {
      player.setOption(n, res[n]);
    }
    gVisPolar.hide();
    gVisRainbow.hide();
    gVisGrid.hide();
    if (mode === 'polar') {
      gVisPolar.show();
      gVisPolar.open();
    } else if (mode === 'grid') {
      gVisGrid.show();
      gVisGrid.open();
    } else {
      gVisRainbow.show();
      gVisRainbow.open();
    }
    player.updateMode();
    player.updateBufferSize();
  });
};

Controller.prototype.initPlaybar = function() {
  const ctrl = this;

  var bar = document.createElement('div');
  bar.className = 'playbar';

  var btnPlay = document.createElement('button');
  btnPlay.className = 'playbar-btn';
  btnPlay.innerHTML = '&#9654;'; // play triangle
  btnPlay.title = 'Play / Pause';

  var btnUpload = document.createElement('button');
  btnUpload.className = 'playbar-btn';
  btnUpload.innerHTML = '&#8682;'; // upload arrow
  btnUpload.title = 'Load audio file';

  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'audio/*';
  fileInput.style.display = 'none';

  bar.appendChild(btnPlay);
  bar.appendChild(btnUpload);
  bar.appendChild(fileInput);
  document.body.appendChild(bar);

  function updatePlayBtn() {
    if (ctrl.player.isPlaying()) {
      btnPlay.innerHTML = '&#9646;&#9646;'; // pause
      btnPlay.classList.add('playing');
    } else {
      btnPlay.innerHTML = '&#9654;'; // play
      btnPlay.classList.remove('playing');
    }
  }

  btnPlay.addEventListener('click', function() {
    ctrl.player.toggle();
    updatePlayBtn();
  });

  btnUpload.addEventListener('click', function() {
    fileInput.click();
  });

  fileInput.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (file) {
      ctrl.player.loadFile(file);
      ctrl.player.play();
      updatePlayBtn();
    }
    fileInput.value = '';
  });

  ctrl._btnPlay = btnPlay;
  ctrl._updatePlayBtn = updatePlayBtn;
};
