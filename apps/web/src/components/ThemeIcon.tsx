import { Contrast } from "@carbon/react/icons";

interface ThemeIconProps {
  /** Degrees to rotate the half-moon. See `THEME_OPTIONS` for canonical values. */
  rotation: number;
  size?: number;
}

export default function ThemeIcon({ rotation, size = 20 }: ThemeIconProps) {
  return (
    <Contrast
      width={size}
      height={size}
      style={{ transform: `rotate(${rotation}deg)` }}
    />
  );
}
