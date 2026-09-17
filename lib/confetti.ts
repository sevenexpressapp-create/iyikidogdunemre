import confetti, { type Options } from "canvas-confetti";

export const PARTY = ["#f3c77b", "#ff7a93", "#b8a4ff", "#7fdcc1", "#fbf3e4"];

const base: Options = { colors: PARTY, disableForReducedMotion: true, zIndex: 80 };

export function burst(options: Options = {}) {
  void confetti({ ...base, ...options });
}

export function cannons() {
  burst({ particleCount: 90, angle: 60, spread: 62, startVelocity: 62, origin: { x: 0, y: 0.8 } });
  burst({ particleCount: 90, angle: 120, spread: 62, startVelocity: 62, origin: { x: 1, y: 0.8 } });
}

export function celebrate(duration = 2600) {
  const end = Date.now() + duration;
  const id = window.setInterval(() => {
    if (Date.now() > end) {
      window.clearInterval(id);
      return;
    }
    burst({
      particleCount: 38,
      startVelocity: 30,
      spread: 360,
      ticks: 75,
      scalar: 0.9,
      origin: { x: 0.12 + Math.random() * 0.76, y: 0.12 + Math.random() * 0.35 },
    });
  }, 260);
}

export function emojiRain(emojis: string[], scalar = 2.2) {
  const shapes = emojis.map((text) => confetti.shapeFromText({ text, scalar }));
  for (let i = 0; i < 5; i++) {
    window.setTimeout(() => {
      burst({
        shapes,
        scalar,
        particleCount: 14,
        spread: 170,
        startVelocity: 16,
        gravity: 0.7,
        ticks: 280,
        flat: true,
        origin: { x: 0.1 + Math.random() * 0.8, y: -0.05 },
      });
    }, i * 200);
  }
}

export function hearts(gold = false) {
  const shapes = (gold ? ["✨", "💛"] : ["❤️", "🤍"]).map((text) =>
    confetti.shapeFromText({ text, scalar: 1.6 })
  );
  burst({ shapes, scalar: 1.6, particleCount: gold ? 40 : 22, spread: 100, startVelocity: 28, ticks: 160, flat: true, origin: { x: 0.5, y: 0.45 } });
}
