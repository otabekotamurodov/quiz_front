export const MOTION_CONFIGS = {
  layout: true,
  animate: { opacity: 1, scale: 1, marginTop: 0, rotate: 0 },
  initial: { opacity: 0, scale: 1, marginTop: 10, rotate: "-2deg" },
  exit: { opacity: 0, scale: 0.5 },
} as const;
