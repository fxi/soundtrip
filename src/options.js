const defaultTrack = './guitar_rig_sv.mp3';

const mapMode = {
  polar: {
    mode: 'wave',
    bufferSize: 512,
  },
  rainbow: {
    mode: 'fft',
    bufferSize: 32,
    smoothing: 0.85
  }
};
const visualiser = {
  backColor: [200, 200, 200],
  polarColor: [10, 10, 10],
  polarColorAuto: false,
  mode: 'rainbow',
  backAlpha: 0.05,
  scaleFactor: 1.02,
  gravity: 0,
  rotateSpeed: 0.005,
  fadeAlpha: 0.005,
  polarLineWidth: 1,
  polarBaseRadius: 250,
  rainbowWidthFactor: 8,
  rainbowOffsetX: 0,
  rainbowOffsetY: 0
};
const player = {
  url: defaultTrack,
  mode: mapMode[visualiser.mode].mode,
  bufferSize: mapMode[visualiser.mode].bufferSize,
  smoothing: mapMode[visualiser.mode].smoothing || 0.2,
  playbackRate: 1,
  play: false
};

export {defaultTrack, player, visualiser, mapMode};
