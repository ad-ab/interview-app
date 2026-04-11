interface ThemeIconProps {
  /** Degrees to rotate the half-moon. See `THEME_OPTIONS` for canonical values. */
  rotation: number;
  size?: number;
}

/**
 * Shared half-moon SVG used by both the TopBar theme switcher and the
 * Settings page Color Theme tile. Rotation communicates the theme:
 * 0° = light, 180° = dark, 60° = system.
 */
export default function ThemeIcon({ rotation, size = 20 }: ThemeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      style={{ transform: `rotate(${rotation}deg)`, flexShrink: 0 }}
      aria-hidden="true"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10m0-2V4a8 8 0 1 1 0 16" />
    </svg>
  );
}
