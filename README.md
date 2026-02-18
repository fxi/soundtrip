# SoundTrip

Audio visualiser with three rendering modes, built with the Web Audio API and Canvas 2D.

![Animated gif of soundtrip](experiments_soundtrip.gif)

## Modes

- **Rainbow** — FFT frequency bars with a progressive color spectrum
- **Polar** — Waveform plotted in polar coordinates as a pulsing circle
- **Grid** — A perspective mesh displaced by FFT frequency data

## Usage

Play the bundled track or upload your own audio file. Use the dat.gui panel to tweak parameters (amplitude, colors, scale, rotation, etc.).

## Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

Output goes to `dist/`.
