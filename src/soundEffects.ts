const SOUND_EFFECTS = {
  click: { file: "click_002.ogg", volume: 1 },
  select: { file: "select_003.ogg", volume: 1 },
  correct: { file: "confirmation_003.ogg", volume: 0.65 },
  wrong: { file: "error_004.ogg", volume: 0.55 },
  drop: { file: "drop_002.ogg", volume: 0.5 },
  timeout: { file: "error_004.ogg", volume: 0.6 },
} as const;

export type SoundEffect = keyof typeof SOUND_EFFECTS;

export function playSound(effect: SoundEffect) {
  const config = SOUND_EFFECTS[effect];
  const audio = new Audio(`./sounds/${config.file}`);
  audio.volume = config.volume;
  void audio.play().catch(() => {});
}
