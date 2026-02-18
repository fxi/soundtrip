/* jshint esversion:6 */
import {Base} from './base.js';
import {onNextFrame} from './utils.js';
import {visualiser as options_visualiser} from './options.js';
export {Visualiser};

function Visualiser(config) {
  const vis = this;
  vis.setOptionsDefault(options_visualiser);
  vis.setOptions(config.options);
  vis.init(config);
  return vis;
}

Visualiser.prototype = Object.create(Base.prototype);

Visualiser.prototype.init = function(config) {
  const vis = this;
  vis.elCanvas = config.elCanvas;
  vis.elCanvasBack = document.createElement('canvas');
  vis.width = config.width || window.innerWidth;
  vis.height = config.height || window.innerHeight;
  vis.x = vis.width / 2;
  vis.y = vis.height / 2;
  vis.i = 0;
  vis.rainbowVerticesPrevious = [];
  vis.ctx = vis.elCanvas.getContext('2d');
  vis.ctxBack = vis.elCanvasBack.getContext('2d');
  vis._getData = null;
  vis.setSize();
  vis.clear();
};

/**
 * Set data source callback.
 * Called each frame; should return Float32Array or null.
 */
Visualiser.prototype.setDataSource = function(fn) {
  this._getData = fn;
};

/**
 * Start the always-running render loop
 */
Visualiser.prototype.start = function() {
  const vis = this;
  vis._running = true;
  vis._loop();
};

Visualiser.prototype._loop = function() {
  const vis = this;
  if (!vis._running) {
    return;
  }
  var data = vis._getData ? vis._getData() : null;
  vis.draw(data);
  onNextFrame(vis._loop.bind(vis));
};

Visualiser.prototype.setWidth = function(w) {
  const vis = this;
  vis.width = w;
  vis.elCanvas.width = vis.width;
  vis.elCanvasBack.width = vis.width;
  vis.updateCenter();
};

Visualiser.prototype.setHeight = function(h) {
  const vis = this;
  vis.height = h;
  vis.elCanvas.height = vis.height;
  vis.elCanvasBack.height = vis.height;
  vis.updateCenter();
};

Visualiser.prototype.setSize = function(opt) {
  opt = opt || {};
  const vis = this;
  vis.setWidth(opt.width || vis.width || vis.elCanvas.width);
  vis.setHeight(opt.height || vis.height || vis.elCanvas.height);
};

/**
 * Clear context
 */
Visualiser.prototype.clear = function() {
  const vis = this;
  vis.ctx.setTransform(1, 0, 0, 1, 0, 0);
  vis.ctx.fillStyle = 'black';
  vis.ctx.fillRect(0, 0, vis.width, vis.height);
};

/**
 * Next hsl color
 */
Visualiser.prototype.nextColor = function() {
  const vis = this;
  return 'hsl(' + (vis.i % 360) + ', 95%, 50%)';
};

Visualiser.prototype.updateCenter = function() {
  const vis = this;
  vis.center = {
    x: vis.width / 2,
    y: vis.height / 2
  };
};

Visualiser.prototype.setPosition = function(pos) {
  const vis = this;
  vis.pos = pos;
  vis.x = pos.x;
  vis.y = pos.y;
};

/**
 * Draw background effect — always runs, creating the
 * rotate/scale/fade trail on existing pixels
 */
Visualiser.prototype.drawBackground = function() {
  const vis = this;

  vis.ctxBack.setTransform(1, 0, 0, 1, 0, 0);

  vis.ctxBack.translate(vis.center.x, vis.center.y);
  vis.ctxBack.rotate(vis.opt.rotateSpeed);
  vis.ctxBack.scale(vis.opt.scaleFactor, vis.opt.scaleFactor);
  vis.ctxBack.translate(0, vis.opt.gravity);
  vis.ctxBack.translate(-vis.center.x, -vis.center.y);

  vis.ctxBack.drawImage(vis.elCanvas, 0, 0);

  vis.ctxBack.fillStyle = toRgba(vis.opt.backColor, vis.opt.backAlpha);
  vis.ctxBack.fillRect(0, 0, vis.width, vis.height);

  vis.ctx.drawImage(vis.elCanvasBack, 0, 0);
};

/**
 * Draw one frame.
 * data may be null (paused) — background still transforms.
 */
Visualiser.prototype.draw = function(data) {
  const vis = this;
  vis.i++;
  if (data) {
    if (vis.opt.mode === 'polar') {
      vis.drawPolar(data);
    } else {
      vis.drawRainbow(data);
    }
  }
  vis.drawBackground();
};

Visualiser.prototype.drawRainbow = function(data) {
  const vis = this;
  const wf = 10 - vis.opt.rainbowWidthFactor;
  const ox = vis.opt.rainbowOffsetX;
  const oy = vis.opt.rainbowOffsetY;
  const x = vis.x + ox;
  const y = vis.y + oy;
  const ws = data.map(function(v) {
    return Math.max(0, Math.round(100 - Math.abs(v))) / wf;
  });
  const dx = ws.reduce(function(a, v) { return v + a; }, 0) / 2;
  const l = ws.length;
  const vertices = [];
  let pX = 0;

  ws.forEach(function(w) {
    if (!isFinite(w)) {
      return vertices.push({x1: x, y1: y, x2: x, y2: y});
    }
    const x1 = x + pX - dx;
    const x2 = x1 + w;
    pX = pX + w;
    return vertices.push({x1: x1, y1: y, x2: x2, y2: y});
  });

  if (vis.rainbowVerticesPrevious.length === vertices.length) {
    let vn = {};
    vis.rainbowVerticesPrevious.forEach(function(vp, i) {
      vn = vertices[i];
      const c = 'hsl(' + (i / l) * 300 + ', 100%, 50%)';
      vis.ctx.fillStyle = c;
      vis.ctx.strokeStyle = c;
      vis.ctx.beginPath();
      vis.ctx.moveTo(vn.x1, vn.y1);
      vis.ctx.lineTo(vn.x2, vn.y2);
      vis.ctx.save();
      vis.ctx.translate(vis.center.x, vis.center.y);
      vis.ctx.rotate(vis.opt.rotateSpeed);
      vis.ctx.scale(vis.opt.scaleFactor, vis.opt.scaleFactor);
      vis.ctx.translate(0, vis.opt.gravity);
      vis.ctx.translate(-vis.center.x, -vis.center.y);
      vis.ctx.lineTo(vp.x2, vp.y2);
      vis.ctx.lineTo(vp.x1, vp.y1);
      vis.ctx.restore();
      vis.ctx.stroke();
      vis.ctx.fill();
    });
  }
  vis.rainbowVerticesPrevious = vertices;
};

Visualiser.prototype.drawPolar = function(data) {
  const vis = this;
  let x = 0;
  let y = 0;
  const r = vis.opt.polarBaseRadius;
  let j = 0;
  const l = data.length * 2;
  const a = (2 * Math.PI) / (l - 1);
  let theta = 0;
  let vd = 0;
  let v = 0;
  if (vis.opt.polarColorAuto) {
    vis.ctx.strokeStyle = vis.nextColor();
  } else {
    vis.ctx.strokeStyle = toRgba(vis.opt.polarColor, 1);
  }
  vis.ctx.lineWidth = vis.opt.polarLineWidth;
  vis.ctx.beginPath();
  for (let i = 0; i < l; i++) {
    if (i >= l / 2) {
      j = l - i;
    } else {
      j = i;
    }
    v = data[j];
    theta = a * i + Math.PI / 2;
    vd = r * (1 + v * vis.opt.polarAmplitude);
    x = vd * Math.cos(theta) + vis.x;
    y = vd * Math.sin(theta) + vis.y;
    vis.ctx.lineTo(x, y);
  }
  vis.ctx.stroke();
};

function toRgba(color, opacity) {
  return 'rgba(' + Math.round(color[0]) + ',' + Math.round(color[1]) + ',' + Math.round(color[2]) + ',' + opacity + ')';
}
