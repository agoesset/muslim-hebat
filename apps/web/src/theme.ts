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
}

/**
 * `warm` adalah palet default: warna persis oatter.shop
 * (cream #FAF6ED, ink #1A1A18, secondary #7C7A70) dengan aksen versi muted
 * supaya tetap menyatu dengan cream. Nilainya harus sama dengan `:root`
 * di styles.css — applyTheme() menimpa custom property di runtime.
 */
export const PALETTES: Record<Theme["palette"], Palette> = {
  warm: {
    "--bg": "#FAF6ED",
    "--bg-soft": "#F3EEE2",
    "--ink": "#1A1A18",
    "--ink-soft": "#7C7A70",
    "--paper": "#FAF6ED",
    "--line": "rgba(26, 26, 24, 0.14)",
    "--line-soft": "rgba(26, 26, 24, 0.08)",
    "--sage": "#C6D8C4",
    "--sage-deep": "#6D8A6B",
    "--peach": "#F2D6BE",
    "--peach-deep": "#B5825A",
    "--coral": "#F0A794",
    "--coral-deep": "#B75F49",
    "--lilac": "#D9CFDD",
    "--lilac-deep": "#857A90",
    "--butter": "#EFE1B4",
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
