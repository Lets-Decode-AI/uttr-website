// One stroke icon set for the whole site: 16 px grid, 1.6 px round strokes.
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 16, children, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowDown = (p: P) => (
  <Icon {...p}>
    <path d="M8 2.5v10.5M3.5 8.5 8 13l4.5-4.5" />
  </Icon>
);

export const ArrowOut = (p: P) => (
  <Icon {...p}>
    <path d="M5 11 11 5M6 4.5h5.5V10" />
  </Icon>
);

export const ArrowRight = (p: P) => (
  <Icon {...p}>
    <path d="M2.5 8h10.5M8.5 3.5 13 8l-4.5 4.5" />
  </Icon>
);

export const Check = (p: P) => (
  <Icon {...p}>
    <path d="m3 8.5 3 3 7-7" />
  </Icon>
);

export const Chevron = (p: P) => (
  <Icon {...p}>
    <path d="m4 6 4 4 4-4" />
  </Icon>
);

export const Laptop = (p: P) => (
  <Icon {...p}>
    <rect x="2.5" y="3" width="11" height="7.5" rx="1.2" />
    <path d="M1 13h14" />
  </Icon>
);

export const Cloud = (p: P) => (
  <Icon {...p}>
    <path d="M4.5 12.5h7a3 3 0 0 0 .3-6 4 4 0 0 0-7.6-.9A3.5 3.5 0 0 0 4.5 12.5Z" />
  </Icon>
);

export const GitHub = ({ size = 16, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" {...rest}>
    <path
      fill="currentColor"
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
    />
  </svg>
);
