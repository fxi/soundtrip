

const radios = {
  piano : 'http://pianosolo.streamguys.net/live',
  experimental: 'http://electro-music.com:8506/;stream/1',
  intense: 'http://electro-music.com:8504/;stream/1',
  noodle: 'http://electro-music.com:8508/;stream/1',
  classical: 'http://stream.srg-ssr.ch/m/rsc_fr/mp3_128',
  psy: 'https://hirschmilch.de:7001/chill.mp3',
};

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
  rainbowWidthFactor: 0.08,
  rainbowOffsetX: 0,
  rainbowOffsetY: 0
};
const player = {
  url: radios.experimental,
  mode: mapMode[visualiser.mode].mode,
  bufferSize: mapMode[visualiser.mode].bufferSize,
  smoothing: mapMode[visualiser.mode].smoothing || 0.2,
  playbackRate : 1,
  play : false
};


export {radios, player, visualiser, mapMode};
