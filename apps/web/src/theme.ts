export interface Theme {
  palette: "warm" | "cool" | "sage" | "blossom";
  density: "compact" | "cozy" | "spacious";
  bento: boolean;
  illustrations: boolean;
  font: "grotesk" | "serif" | "rounded";
}

export const DEFAULT_THEME: Theme = {
  palette: "warm",
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
  "--line": string;
  "--line-soft": string;
  "--sage": string;
  "--sage-deep": string;
  "--peach": string;
  "--peach-deep": string;
  "--coral": string;
  "--coral-deep": string;
  "--lilac": string;
  "--lilac-deep": string;
  "--butter": string;
  "--plum": string;
  "--near-black": string;
}

/**
 * `warm` adalah palet default Muslim Hebat. Nilainya harus sama dengan `:root`
 * di styles.css — applyTheme() menimpa custom property di runtime.
 */
export const PALETTES: Record<Theme["palette"], Palette> = {
  warm: {
    "--bg": "#FAF7F2",
    "--bg-soft": "#FFF6F5",
    "--ink": "#1E2A44",
    "--ink-soft": "#7C395B",
    "--paper": "#FFFFFF",
    "--line": "rgba(30, 42, 68, 0.16)",
    "--line-soft": "rgba(30, 42, 68, 0.08)",
    "--sage": "#9FAB72",
    "--sage-deep": "#7C395B",
    "--peach": "#FFF6F5",
    "--peach-deep": "#7C395B",
    "--coral": "#FF7A65",
    "--coral-deep": "#7C395B",
    "--lilac": "#FFF6F5",
    "--lilac-deep": "#7C395B",
    "--butter": "#FAF7F2",
    "--plum": "#7C395B",
    "--near-black": "#0E0E0F",
  },
  cool: {
    "--bg": "#F4F5F3",
    "--bg-soft": "#EAEBE8",
    "--ink": "#1A1A18",
    "--ink-soft": "#7A7C7A",
    "--paper": "#F4F5F3",
    "--line": "rgba(26, 26, 24, 0.14)",
    "--line-soft": "rgba(26, 26, 24, 0.08)",
    "--sage": "#C4D4D0",
    "--sage-deep": "#68867F",
    "--peach": "#E8D2C6",
    "--peach-deep": "#A9836C",
    "--coral": "#E9A498",
    "--coral-deep": "#B15F52",
    "--lilac": "#D2CEDA",
    "--lilac-deep": "#7E798C",
    "--butter": "#E8DEBE",
    "--plum": "#7E798C",
    "--near-black": "#0E0E0F",
  },
  sage: {
    "--bg": "#F5F2E9",
    "--bg-soft": "#ECE7DA",
    "--ink": "#1E211C",
    "--ink-soft": "#797B70",
    "--paper": "#F5F2E9",
    "--line": "rgba(30, 33, 28, 0.14)",
    "--line-soft": "rgba(30, 33, 28, 0.08)",
    "--sage": "#C8D6B8",
    "--sage-deep": "#6C8156",
    "--peach": "#EFDCC2",
    "--peach-deep": "#AE8B60",
    "--coral": "#E7A597",
    "--coral-deep": "#AF6252",
    "--lilac": "#D3CDD8",
    "--lilac-deep": "#7C7688",
    "--butter": "#EBDDAE",
    "--plum": "#7C7688",
    "--near-black": "#0E0E0F",
  },
  blossom: {
    "--bg": "#FCF6F1",
    "--bg-soft": "#F5EBE3",
    "--ink": "#211A19",
    "--ink-soft": "#827570",
    "--paper": "#FCF6F1",
    "--line": "rgba(33, 26, 25, 0.14)",
    "--line-soft": "rgba(33, 26, 25, 0.08)",
    "--sage": "#C8D8C6",
    "--sage-deep": "#6E8A6C",
    "--peach": "#F4D5C6",
    "--peach-deep": "#B5806A",
    "--coral": "#F0A395",
    "--coral-deep": "#B65D4E",
    "--lilac": "#DCCFDA",
    "--lilac-deep": "#8A7889",
    "--butter": "#F0E0BA",
    "--plum": "#8A7889",
    "--near-black": "#0E0E0F",
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
