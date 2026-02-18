/* jshint esversion:6 */
import {Base} from './base.js';
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
  vis.width = config.with || window.innerWidth;
  vis.height = config.height || window.innerHeight;
  vis.x = 0;
  vis.y = 0;
  vis.i = 0;
  vis.idColor = 0;
  vis.rainbowVerticesPrevious = [];
  vis.ctx = vis.elCanvas.getContext('2d');
  vis.ctxBack = vis.elCanvasBack.getContext('2d');
  vis.colors = [];
  vis.ascending = true;
  vis.setSize();
  vis.clear();
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
 * Draw background effect
 */
Visualiser.prototype.drawBackground = function() {
  const vis = this;

  /*
   * reset matrix transform
   */
  vis.ctxBack.setTransform(1, 0, 0, 1, 0, 0);

  /*
   * set center, scale and rotate
   */
  vis.ctxBack.translate(vis.center.x, vis.center.y);
  vis.ctxBack.rotate(vis.opt.rotateSpeed);
  vis.ctxBack.scale(vis.opt.scaleFactor, vis.opt.scaleFactor);
  vis.ctxBack.translate(0, vis.opt.gravity);
  vis.ctxBack.translate(-vis.center.x, -vis.center.y);

  /*
   * draw current canvas on background
   */
  vis.ctxBack.drawImage(vis.elCanvas, 0, 0);

  /*
   * Add fading
   */
  vis.ctxBack.fillStyle = hex2rgba(vis.opt.backColor, vis.opt.backAlpha);
  vis.ctxBack.fillRect(0, 0, vis.width, vis.height);

  /*
   * Draw resulting background in main canvas
   */
  vis.ctx.drawImage(vis.elCanvasBack, 0, 0);
};

/**
 * Draw
 */

Visualiser.prototype.draw = function(data, options) {
  const vis = this;
  if (!data) {
    return;
  }
  vis.i++;
  if (vis.opt.mode === 'polar') {
    vis.drawPolar(data, options);
  } else {
    vis.drawRainbow(data, options);
  }
  vis.drawBackground();
};

Visualiser.prototype.drawRainbow = function(data) {
  const vis = this;
  const wf = vis.opt.rainbowWidthFactor;
  const ox = vis.opt.rainbowOffsetX;
  const oy = vis.opt.rainbowOffsetY;
  data = data.map((v) => Math.round(200 - Math.abs(v)) * wf);
  const dx = data.reduce((a, v) => v + a, 0) / 2;
  const x = this.x + ox;
  const y = this.y + oy;
  const vertices = [];
  let x1 = 0;
  let x2 = 0;

  let c = ''; //color
  let l = data.length;
  let pX = x;

  data.forEach((w) => {
    x1 = pX;
    x2 = x1 + w;
    vertices.push({
      x1: x1 -dx,
      x2: x2 -dx,
      y1: y,
      y2: y
    });
    pX = x2;
  });
  const hasPrevious = vis.rainbowVerticesPrevious.length === vertices.length;
  vis.ctx.translate(vis.center.x,vis.center.y);
  vis.ctx.rotate(0.01);
 
  if (hasPrevious) {
    let vn = {};
    vis.rainbowVerticesPrevious.forEach((vp, i) => {
      vn = vertices[i];
      c = 'hsl(' + (i / (l - 1)) * 360 + ', 100%, 50%)';
      vis.ctx.fillStyle = c;
      vis.ctx.strokeStyle = c;
      vis.ctx.beginPath();
      /**
       *  LEFT SIDE (rotate clockwise )
       *  old (x1,y1) <--- (x2,y2)
       *                      ^
       *                      |
       *  new (x1,y1) ---> (x2,y2)
       */
      vis.ctx.moveTo(vn.x1, vn.y1);
      vis.ctx.lineTo(vn.x2, vn.y2);
      vis.ctx.save();
      /**
      * Apply change made to the canvas
      * to align with old points
      */
      vis.ctx.translate(vis.center.x, vis.center.y);
      vis.ctx.rotate(vis.opt.rotateSpeed);
      vis.ctx.scale(vis.opt.scaleFactor, vis.opt.scaleFactor);
      vis.ctx.translate(0, vis.opt.gravity);
      vis.ctx.translate(-vis.center.x, -vis.center.y);
      /**
      * Line to the top part of the polygon
      */
      vis.ctx.lineTo(vp.x2, vp.y2);
      vis.ctx.lineTo(vp.x1, vp.y1);
      vis.ctx.restore();
      /**
      * Fill the polygon
      */
      vis.ctx.stroke();
      vis.ctx.fill();
    });
  }

  vis.ctx.translate(-vis.center.x, -vis.center.y);
  vis.ctx.rotate(-0.01);

    vis.rainbowVerticesPrevious = vertices;
};

Visualiser.prototype.drawPolar = function(data) {
  const vis = this;
  let x = 0;
  let y = 0;
  let r = vis.opt.polarBaseRadius; // radius base
  let j = 0;
  let l = data.length * 2; // double data length for mirror
  let a = (2 * Math.PI) / (l - 1); // angle in radian
  let theta = 0;
  let vd = 0;
  let v = 0;
  if (vis.opt.polarColorAuto) {
    vis.ctx.strokeStyle = vis.nextColor();
  } else {
    vis.ctx.strokeStyle = hex2rgba(vis.opt.polarColor, 1);
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
    vd = r * (v + 1);
    x = vd * Math.cos(theta) + vis.x;
    y = vd * Math.sin(theta) + vis.y;
    vis.ctx.lineTo(x, y);
  }
  vis.ctx.stroke();
};
function hex2rgba(hex, opacity) {
  const r = parseInt(hex[0], 16);
  const g = parseInt(hex[1], 16);
  const b = parseInt(hex[2], 16);
  return `rgba(${r},${g},${b},${opacity})`;
}
