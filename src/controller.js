import * as dat from 'dat.gui';
import {Player} from './player.js';
import {Visualiser} from './visualiser.js';
import {mapMode, radios} from './options.js';
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
  const gui = new dat.GUI();
  const visHeight = ctrl.visualiser.height;
  const visWidth = ctrl.visualiser.width;
  const oV = ctrl.visualiser.getOptions();
  const oP = ctrl.player.getOptions();
  /**
   * Build GUI
   */
  const gPlayer = gui.addFolder('Player');
  gPlayer.open();
  const gPlayerUrl = gPlayer.add(oP, 'url', radios);
  const gPlayerPlay = gPlayer.add(oP, 'play');
  const gPlayerPlaybackRate = gPlayer.add(oP,'playbackRate',0.01, 2);
  gPlayer.add(oP, 'smoothing', 0, 1);
  const gVis = gui.addFolder('Visualiser');
  gVis.addColor(oV, 'backColor');
  gVis.add(oV, 'backAlpha', 0, 1);
  gVis.add(oV, 'scaleFactor', 0.8, 1.2);
  gVis.add(oV, 'gravity', -20, 20);
  gVis.add(oV, 'rotateSpeed', -0.5, 0.5);
  const gVisMode = gVis.add(oV, 'mode', ['polar', 'rainbow']);
  const gVisPolar = gVis.addFolder('polar mode');
  gVisPolar.close();
  gVisPolar.addColor(oV, 'polarColor');
  gVisPolar.add(oV,'polarColorAuto');
  gVisPolar.add(oV, 'polarBaseRadius', 0, 300);
  gVisPolar.add(oV, 'polarLineWidth', 0, 5);
  const gVisRainbow = gVis.addFolder('rainbow rainbow mode');
  gVisRainbow.add(oV, 'rainbowWidthFactor', -1, 1);
  gVisRainbow.add(oV, 'rainbowOffsetX', -visWidth / 2, visWidth / 2);
  gVisRainbow.add(oV, 'rainbowOffsetY', -visHeight / 2, visHeight / 2);
  gVisPolar.hide();
  gVisPolar.close();
  //gui.close();
  ctrl.gui = gui;
  /**
   * Events
   */

  gPlayerUrl.onFinishChange(() => {
    var player = ctrl.player;
    player.pause();
    player.updateAll();
    player.play();
  });
  gPlayerPlay.onFinishChange((enable)=>{
      ctrl.player.play(enable);
  });
  gPlayerPlaybackRate.onFinishChange((value)=>{
      ctrl.player.setPlaybackRate(value);
  });
  gVisMode.onFinishChange((mode) => {
    var res = mapMode[mode];
    var player = ctrl.player;
    for (var n in res) {
      player.setOption(n, res[n]);
    }
    if (mode === 'polar') {
      gVisPolar.show();
      gVisPolar.open();
      gVisRainbow.hide();
    } else {
      gVisRainbow.show();
      gVisRainbow.open();
      gVisPolar.hide();
    }
    player.updateAll();
  });
};

Controller.prototype.savetoclipboard = function() {
  objecttostate(this.opt);
  const eltemp = document.createelement('input');
  const href = window.location.href;
  document.body.appendchild(eltemp);
  eltemp.value = href;
  eltemp.select();
  document.execcommand('copy');
  document.body.removechild(eltemp);
  alert('copied in clipboard !');
};


