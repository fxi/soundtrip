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
  },
  grid: {
    mode: 'fft',
    bufferSize: 32,
    smoothing: 0.85
  }
};
const visualiser = {
  backColor: [15,15,15],
  polarColor: [129, 129, 129],
  polarColorAuto: true,
  mode: 'polar',
  backAlpha: 0.0002,
  scaleFactor: 1.02,
  gravity: 1,
  rotateSpeed: 0.005,
  fadeAlpha: 0.005,
  polarLineWidth: 1,
  polarAmplitude: 0.4,
  polarBaseRadius: 100,
  rainbowWidthFactor: 8,
  rainbowOffsetX: 0,
  rainbowOffsetY: 0,
  gridRows: 20,
  gridAmplitude: 1,
  gridPerspective: 0.6,
  gridSpacing: 20
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
