/* jshint esversion:6 */
/*
 * See doc at
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
 */
import {Base} from './base.js';
import {onNextFrame, cancelFrame} from './utils.js';
import {player as options_player} from './options.js';

export {Player};

function Player(config) {
  const p = this;
  p.setOptionsDefault(options_player);
  p.setOptions(config.options);
  p.onData = config.onData;
  p.init();
  return p;
}

Player.prototype = Object.create(Base.prototype);

Player.prototype.init = function() {
  const p = this;
  p._playing = false;
  p._idFrame = 0;
  p.elAudio = document.createElement('audio');
  p.elAudio.crossOrigin = 'anonymous';
};

Player.prototype.checkContext = function() {
  const p = this;
  /**
   * Ctx created after user click
   */
  if (!p.ctx) {
    p.ctx = new AudioContext();
    p.source = p.ctx.createMediaElementSource(p.elAudio);
    p.analyser = p.ctx.createAnalyser();
    p.source.connect(p.analyser);
    p.source.connect(p.ctx.destination);
    p.updateAll();
  }
};

Player.prototype.updateAll = function() {
  const p = this;
  p.updateUrl();
  p.updateMode();
  p.updateBufferSize();
};

Player.prototype.updateUrl = function() {
  const p = this;
  const changed = p.elAudio.src !== p.opt.url;
  if (changed) {
    p.elAudio.src = p.opt.url;
  }
};

Player.prototype.updateBufferSize = function() {
  const p = this;
  const changed = p.analyser.fftSize !== p.opt.bufferSize;
  if (changed) {
    p.analyser.fftSize = p.opt.bufferSize * 2;
    p.data = new Float32Array(p.opt.bufferSize);
  }
};

Player.prototype.updateMode = function() {
  const p = this;
  p.opt.mode = p.opt.mode;
};

Player.prototype.getData = function() {
  const p = this;

  const changed = p.analyser.smoothingTimeConstant !== p.opt.smoothing;

  if (changed) {
    p.analyser.smoothingTimeConstant = p.opt.smoothing;
  }
  if (p.opt.mode === 'fft') {
    p.analyser.getFloatFrequencyData(p.data);
  } else {
    p.analyser.getFloatTimeDomainData(p.data);
  }
  return p.data;
};

Player.prototype.play = function(enable) {
  const p = this;
  if (enable === false) {
    p.pause();
  } else if (!p._playing) {
    p.checkContext();
    p.elAudio.play();
    p._playing = true;
    p.render();
  }
};
Player.prototype.pause = function() {
  const p = this;
  if (p._playing) {
    cancelFrame(p._idFrame);
    p.elAudio.pause();
    p._playing = false;
  }
};

Player.prototype.toggle = function() {
  const p = this;
  if (p._playing) {
    p.pause();
  } else {
    p.play();
  }
};

Player.prototype.render = function() {
  const p = this;
  if (!p._playing) {
    return;
  }
  p.onData(p.getData(),p.opt);
  p._idFrame = onNextFrame(p.render.bind(p));
};
Player.prototype.setPlaybackRate = function(value){
  const p = this;
  p.elAudio.playbackRate = value*1;
};


