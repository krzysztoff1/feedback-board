import type { BoardTheme } from "./board-theme.schema";

interface ConvertThemeToCssStringProps {
  readonly theme: BoardTheme;
  readonly selector?: string;
}

export const convertThemeToCssString = ({
  theme,
  selector = "body",
}: ConvertThemeToCssStringProps) => {
  let css = `${selector} {\n`;

  for (const [key, value] of Object.entries(theme.cssVars.light)) {
    css += `  --${key}: ${value};\n`;
  }

  css += "}\n\n";
  css += selector === "body" ? `body.dark {\n` : `.dark ${selector} {\n`;

  for (const [key, value] of Object.entries(theme.cssVars.dark)) {
    css += `  --${key}: ${value};\n`;
  }

  css += "}\n";

  return css;
};
