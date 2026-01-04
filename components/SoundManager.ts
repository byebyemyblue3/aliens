
class SoundManager {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playScanHum(duration: number = 0.5) {
    this.init();
    const now = this.ctx!.currentTime;
    const osc1 = this.ctx!.createOscillator();
    const gain1 = this.ctx!.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(40, now);
    osc1.frequency.linearRampToValueAtTime(45, now + duration);
    
    const osc2 = this.ctx!.createOscillator();
    const gain2 = this.ctx!.createGain();
    const filter = this.ctx!.createBiquadFilter();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(80, now);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    filter.Q.setValueAtTime(10, now);

    const lfo = this.ctx!.createOscillator();
    const lfoGain = this.ctx!.createGain();
    lfo.frequency.setValueAtTime(15, now);
    lfoGain.gain.setValueAtTime(0.02, now);
    lfo.connect(lfoGain);
    lfoGain.connect(gain1.gain);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.1, now + 0.05);
    gain1.gain.linearRampToValueAtTime(0, now + duration);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.02, now + 0.05);
    gain2.gain.linearRampToValueAtTime(0, now + duration);

    osc1.connect(gain1);
    gain1.connect(this.ctx!.destination);
    osc2.connect(filter);
    filter.connect(gain2);
    gain2.connect(this.ctx!.destination);
    
    lfo.start(now);
    osc1.start(now);
    osc2.start(now);
    lfo.stop(now + duration);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  playPing() {
    this.init();
    const now = this.ctx!.currentTime;
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    const filter = this.ctx!.createBiquadFilter();
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx!.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playSuccess() {
    this.init();
    const now = this.ctx!.currentTime;
    const sub = this.ctx!.createOscillator();
    const subGain = this.ctx!.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(60, now);
    sub.frequency.exponentialRampToValueAtTime(30, now + 1.5);
    subGain.gain.setValueAtTime(0.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    sub.connect(subGain);
    subGain.connect(this.ctx!.destination);
    
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    const filter = this.ctx!.createBiquadFilter();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 1.0);
    filter.Q.setValueAtTime(5, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx!.destination);
    
    sub.start(now);
    osc.start(now);
    sub.stop(now + 1.5);
    osc.stop(now + 1.2);
  }

  playAlert() {
    this.init();
    const now = this.ctx!.currentTime;
    [1200, 1600, 2000].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      gain.gain.setValueAtTime(0.1, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.3);
    });
  }

  playType() {
    this.init();
    const now = this.ctx!.currentTime;
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    const filter = this.ctx!.createBiquadFilter();
    const bufferSize = this.ctx!.sampleRate * 0.02;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150 + Math.random() * 50, now);
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.Q.setValueAtTime(2, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    noise.connect(filter);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx!.destination);
    noise.start(now);
    osc.start(now);
    osc.stop(now + 0.02);
  }
}

export const sounds = new SoundManager();
