import { birthday } from "@/data/birthday";

// Nota frekansları (Hz)
const N = {
  F2: 87.31, G2: 98.0, C3: 130.81, A3: 220.0, B3: 246.94, C4: 261.63, D4: 293.66,
  E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33,
  E5: 659.25, F5: 698.46, G5: 783.99, C6: 1046.5, E6: 1318.51, G6: 1567.98, C7: 2093.0,
};

// "İyi ki doğdun" melodisi (Happy Birthday, kamu malı) — 3/4, süreler vuruş cinsinden
const MELODY: Array<[number, number]> = [
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1], [N.G4, 1], [N.C5, 1], [N.B4, 2],
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1], [N.G4, 1], [N.D5, 1], [N.C5, 2],
  [N.G4, 0.75], [N.G4, 0.25], [N.G5, 1], [N.E5, 1], [N.C5, 1], [N.B4, 1], [N.A4, 1],
  [N.F5, 0.75], [N.F5, 0.25], [N.E5, 1], [N.C5, 1], [N.D5, 1], [N.C5, 3],
];

type Chord = { bass: number; upper: number[] };
const C: Chord = { bass: N.C3, upper: [N.E4, N.G4] };
const G: Chord = { bass: N.G2, upper: [N.B3, N.D4] };
const F: Chord = { bass: N.F2, upper: [N.A3, N.C4] };
const G7: Chord = { bass: N.G2, upper: [N.B3, N.F4] };
// İlk vuruş ön vuruş; sonra 8 ölçü × 3 vuruş
const BARS: Chord[] = [C, G, G, C, C, F, C, C];

const BEAT = 0.46;
const SONG_SECONDS = 25 * BEAT;
const GAP = 2.2;
const MUSIC_VOL = 0.34;

class BirthdayAudio {
  private ctx: AudioContext;
  private music: GainNode;
  private sfx: GainNode;
  private loopGain: GainNode | null = null;
  private timer: number | null = null;
  private nextStart = 0;
  private el: HTMLAudioElement | null = null;
  playing = false;

  constructor(src?: string) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();

    // iOS: sessiz anahtarı açıkken de çalsın
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session) session.type = "playback";

    const ctx = this.ctx;
    const comp = ctx.createDynamicsCompressor();
    comp.connect(ctx.destination);

    this.music = ctx.createGain();
    this.music.gain.value = MUSIC_VOL;
    this.music.connect(comp);

    // Yumuşak yankı — müzik kutusu hissi
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.27;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.3;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2600;
    const wet = ctx.createGain();
    wet.gain.value = 0.32;
    this.music.connect(delay);
    delay.connect(tone);
    tone.connect(feedback);
    feedback.connect(delay);
    tone.connect(wet);
    wet.connect(comp);

    this.sfx = ctx.createGain();
    this.sfx.gain.value = 0.55;
    this.sfx.connect(comp);

    if (src) {
      this.el = new Audio(src);
      this.el.loop = true;
      this.el.volume = 0.6;
    }
  }

  private tone(freq: number, t: number, vel: number, out: AudioNode, decay = 1.6) {
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    g.connect(out);
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = freq;
    o.connect(g);
    o.start(t);
    o.stop(t + decay + 0.05);

    // Parlak "tın" üst harmoniği
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.0001, t);
    g2.gain.exponentialRampToValueAtTime(vel * 0.28, t + 0.004);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + Math.min(decay, 0.6));
    g2.connect(out);
    const o2 = ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.value = freq * 2;
    o2.connect(g2);
    o2.start(t);
    o2.stop(t + 0.65);
  }

  private scheduleSong(t0: number, out: AudioNode) {
    let beat = 0;
    for (const [freq, dur] of MELODY) {
      this.tone(freq, t0 + beat * BEAT, 0.5, out, 1.8);
      beat += dur;
    }
    BARS.forEach((chord, k) => {
      const t = t0 + (1 + k * 3) * BEAT;
      this.tone(chord.bass, t, 0.34, out, 2.2);
      if (k === BARS.length - 1) {
        chord.upper.forEach((f) => this.tone(f, t, 0.16, out, 2.8));
        return;
      }
      const last = k === 6 ? G7 : chord;
      chord.upper.forEach((f) => this.tone(f, t + BEAT, 0.12, out, 0.9));
      last.upper.forEach((f) => this.tone(f, t + 2 * BEAT, 0.12, out, 0.9));
    });
  }

  private tick() {
    if (!this.loopGain) return;
    while (this.nextStart < this.ctx.currentTime + 1.5) {
      this.scheduleSong(this.nextStart, this.loopGain);
      this.nextStart += SONG_SECONDS + GAP;
    }
  }

  play() {
    void this.ctx.resume();
    if (this.playing) return;
    this.playing = true;
    if (this.el) {
      this.el.play().catch(() => {});
      return;
    }
    this.loopGain = this.ctx.createGain();
    this.loopGain.connect(this.music);
    this.nextStart = this.ctx.currentTime + 0.15;
    this.tick();
    this.timer = window.setInterval(() => this.tick(), 400);
  }

  pause() {
    if (!this.playing) return;
    this.playing = false;
    if (this.el) {
      this.el.pause();
      return;
    }
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null;
    const lg = this.loopGain;
    this.loopGain = null;
    if (lg) {
      lg.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      window.setTimeout(() => lg.disconnect(), 500);
    }
  }

  /** Mikrofon dinlerken müziği kıs */
  duck(on: boolean) {
    if (this.el) {
      this.el.volume = on ? 0.05 : 0.6;
      return;
    }
    this.music.gain.setTargetAtTime(on ? 0.02 : MUSIC_VOL, this.ctx.currentTime, 0.1);
  }

  private noise(seconds: number) {
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    return src;
  }

  pop() {
    void this.ctx.resume();
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const src = this.noise(0.12);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1700;
    bp.Q.value = 0.7;
    const g = ctx.createGain();
    g.gain.value = 1.1;
    src.connect(bp);
    bp.connect(g);
    g.connect(this.sfx);
    src.start(t);

    const o = ctx.createOscillator();
    const og = ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(620, t);
    o.frequency.exponentialRampToValueAtTime(110, t + 0.09);
    og.gain.setValueAtTime(0.35, t);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    o.connect(og);
    og.connect(this.sfx);
    o.start(t);
    o.stop(t + 0.12);
  }

  puff() {
    void this.ctx.resume();
    const ctx = this.ctx;
    const src = this.noise(0.4);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.value = 0.7;
    src.connect(lp);
    lp.connect(g);
    g.connect(this.sfx);
    src.start();
  }

  chime() {
    void this.ctx.resume();
    const t = this.ctx.currentTime;
    [N.C6, N.E6, N.G6, N.C7].forEach((f, i) => this.tone(f, t + i * 0.09, 0.22, this.sfx, 1.4));
  }

  sparkle() {
    void this.ctx.resume();
    const t = this.ctx.currentTime;
    [N.G6, N.E6, N.C7].forEach((f, i) => this.tone(f, t + i * 0.06, 0.12, this.sfx, 0.9));
  }
}

let instance: BirthdayAudio | null = null;

/** Yalnızca kullanıcı etkileşiminden sonra (tıklama vb.) çağır */
export function getAudio() {
  if (!instance) instance = new BirthdayAudio(birthday.musicSrc || undefined);
  return instance;
}
