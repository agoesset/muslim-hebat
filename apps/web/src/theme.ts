export interface Theme {
  palette: "warm" | "cool" | "sage" | "blossom";
  density: "compact" | "cozy" | "spacious";
  bento: boolean;
  illustrations: boolean;
  font: "grotesk" | "serif" | "rounded";
}

export const DEFAULT_THEME: Theme = {
  palette: "cool",
  density: "cozy",
  bento: true,
  illustrations: true,
  font: "grotesk",
};

interface Palette {
  "--bg": string;
  "--bg-soft": string;
  "--ink": string;
  "--ink-soft": string;
  "--paper": string;
  "--sage": string;
  "--sage-deep": string;
  "--peach": string;
  "--peach-deep": string;
  "--coral": string;
  "--coral-deep": string;
  "--lilac": string;
  "--lilac-deep": string;
  "--butter": string;
}

export const PALETTES: Record<Theme["palette"], Palette> = {
  warm: {
    "--bg": "#FBF3E2",
    "--bg-soft": "#F4EAD2",
    "--ink": "#1F3A2D",
    "--ink-soft": "#4A5C50",
    "--paper": "#FFFCF5",
    "--sage": "#B8DDC4",
    "--sage-deep": "#6FA37E",
    "--peach": "#FFD6A5",
    "--peach-deep": "#E5A86A",
    "--coral": "#FFB4A8",
    "--coral-deep": "#D87A6B",
    "--lilac": "#D8CCEF",
    "--lilac-deep": "#9A86C4",
    "--butter": "#F7E4A0",
  },
  cool: {
    "--bg": "#F0F4FF",
    "--bg-soft": "#E2E9FA",
    "--ink": "#2C3858",
    "--ink-soft": "#54607C",
    "--paper": "#FAFBFF",
    "--sage": "#C6E2D6",
    "--sage-deep": "#7FA890",
    "--peach": "#FFD2D7",
    "--peach-deep": "#D88897",
    "--coral": "#FFC0CB",
    "--coral-deep": "#C9758C",
    "--lilac": "#D7C4F5",
    "--lilac-deep": "#8C75BA",
    "--butter": "#FFE9A8",
  },
  sage: {
    "--bg": "#F5F1E8",
    "--bg-soft": "#EAE3D2",
    "--ink": "#2F3D2A",
    "--ink-soft": "#566052",
    "--paper": "#FAF6EC",
    "--sage": "#C5E1A5",
    "--sage-deep": "#6E8F4D",
    "--peach": "#FFE0B2",
    "--peach-deep": "#D9A765",
    "--coral": "#FFADAD",
    "--coral-deep": "#C97A7A",
    "--lilac": "#CFC8E0",
    "--lilac-deep": "#897FAA",
    "--butter": "#F7DE92",
  },
  blossom: {
    "--bg": "#FFFAF0",
    "--bg-soft": "#FFEEDB",
    "--ink": "#3A2A2E",
    "--ink-soft": "#6B575B",
    "--paper": "#FFFDF7",
    "--sage": "#C5E5C1",
    "--sage-deep": "#79A074",
    "--peach": "#FCD5CE",
    "--peach-deep": "#D58779",
    "--coral": "#FFB5A7",
    "--coral-deep": "#D17C68",
    "--lilac": "#A2D2FF",
    "--lilac-deep": "#5A8FC4",
    "--butter": "#FFE9A8",
  },
};

export function applyTheme(theme: Partial<Theme> = DEFAULT_THEME): void {
  const palette = PALETTES[theme.palette ?? DEFAULT_THEME.palette];
  const root = document.documentElement;
  for (const [key, value] of Object.entries(palette)) {
    root.style.setProperty(key, value);
  }
  root.setAttribute("data-density", theme.density ?? DEFAULT_THEME.density);
  root.setAttribute("data-illus", String(theme.illustrations ?? DEFAULT_THEME.illustrations));
  root.setAttribute("data-font", theme.font ?? DEFAULT_THEME.font);
  root.setAttribute("data-bento", String(theme.bento ?? DEFAULT_THEME.bento));
}
