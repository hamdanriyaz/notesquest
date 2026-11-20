let ctx: AudioContext | null = null;
let muted = false;
export const setMuted = (m: boolean) => { muted = m; };
export const isMuted = () => muted;
function ac() { if (!ctx) ctx = new AudioContext(); if (ctx.state === "suspended") ctx.resume(); return ctx; }
function tone(freq: number, dur: number, type: OscillatorType = "square", vol = 0.15, slide?: number, delay = 0) {
  if (muted || typeof window === "undefined") return;
  const c = ac(); const t = c.currentTime + delay;
  const o = c.createOscillator(); const g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur);
}
function noise(dur: number, vol = 0.2) {
  if (muted || typeof window === "undefined") return;
  const c = ac(); const b = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const s = c.createBufferSource(); const g = c.createGain(); g.gain.value = vol; s.buffer = b; s.connect(g).connect(c.destination); s.start();
}
export const sfx = {
  hit: () => { tone(900, 0.15, "sawtooth", 0.12, 120); noise(0.12, 0.15); },
  crit: () => { tone(1200, 0.25, "sawtooth", 0.15, 80); tone(600, 0.3, "square", 0.1, 60, 0.05); noise(0.25, 0.2); },
  shield: () => { noise(0.35, 0.3); tone(300, 0.4, "triangle", 0.15, 60); },
  recharge: () => [440, 660, 880].forEach((f, i) => tone(f, 0.12, "triangle", 0.12, undefined, i * 0.07)),
  siren: () => { for (let i = 0; i < 3; i++) tone(500, 0.35, "sawtooth", 0.1, 900, i * 0.4); },
  victory: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.2, "square", 0.1, undefined, i * 0.13)),
  lose: () => [400, 300, 200, 120].forEach((f, i) => tone(f, 0.3, "triangle", 0.15, undefined, i * 0.2)),
  laser: () => tone(1400, 0.35, "sawtooth", 0.1, 200),
  roar: () => { tone(90, 0.5, "sawtooth", 0.18, 50); noise(0.4, 0.15); },
  impact: () => { tone(80, 0.4, "sine", 0.35, 30); noise(0.3, 0.35); },
  wasted: () => { [55, 82.4, 110, 130.8].forEach((f) => tone(f, 2.8, "sawtooth", 0.08, f * 0.7)); noise(0.6, 0.2); },
  passed: () => [392, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i === 6 ? 0.8 : 0.18, "square", 0.1, undefined, i * 0.14)),
  click: () => tone(700, 0.05, "square", 0.06),
  tick: () => tone(1500, 0.04, "square", 0.05),
  combo: (n: number) => tone(500 + n * 120, 0.12, "triangle", 0.1, 900 + n * 150),
  whoosh: () => { noise(0.4, 0.12); tone(200, 0.4, "sine", 0.08, 900); },
  wave: () => [330, 494].forEach((f, i) => tone(f, 0.1, "square", 0.07, undefined, i * 0.08)),
  hover: () => tone(1100, 0.025, "sine", 0.03),
  coin: () => [988, 1319].forEach((f, i) => tone(f, i ? 0.25 : 0.08, "square", 0.08, undefined, i * 0.08)),
};

// ---- 80s synthwave background loop ----
let musicTimer: ReturnType<typeof setInterval> | null = null;
let step = 0;
let fast = false;
const BASS = [55, 55, 65.4, 65.4, 49, 49, 73.4, 61.7]; // A, C, G, D-ish roots
const ARP = [0, 7, 12, 7];
function musicStep() {
  if (muted) return;
  const root = BASS[Math.floor(step / 8) % BASS.length]!;
  const len = fast ? 0.1 : 0.16;
  tone(root * 2, len * 0.9, "sawtooth", 0.05);
  if (step % 2 === 0) tone(root * 4 * Math.pow(2, ARP[(step / 2) % 4]! / 12), len * 1.6, "triangle", 0.035);
  if (step % 4 === 0) tone(110, 0.12, "sine", 0.12, 40); // kick
  if (step % 8 === 4) noise(0.08, 0.06); // snare
  step++;
}
export function startMusic() {
  if (typeof window === "undefined" || musicTimer) return;
  step = 0;
  musicTimer = setInterval(musicStep, fast ? 110 : 170);
}
export function stopMusic() { if (musicTimer) clearInterval(musicTimer); musicTimer = null; }
export function setMusicBoss(boss: boolean) {
  if (fast === boss) return;
  fast = boss;
  if (musicTimer) { clearInterval(musicTimer); musicTimer = setInterval(musicStep, fast ? 110 : 170); }
}
export const sfxSpecial = () => { [262, 392, 523, 784, 1047].forEach((f, i) => tone(f, 0.3, "sawtooth", 0.12, f * 2, i * 0.06)); noise(0.6, 0.3); };
export const sfxLoot = () => [880, 1175, 1568].forEach((f, i) => tone(f, 0.1, "square", 0.08, undefined, i * 0.06));
