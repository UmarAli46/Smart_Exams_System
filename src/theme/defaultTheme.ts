import type { ThemeOptions } from "@mui/material/styles";
import { DEFAULT_THEME_DARK, DEFAULT_THEME_LIGHT } from "../constants/themeConstant";
import { createCustomTheme } from "./createTheme";

export const getDefaultTheme = (mode: 'light' | 'dark'): ThemeOptions => {
  const base = mode === "dark" ? DEFAULT_THEME_DARK : DEFAULT_THEME_LIGHT;
  return createCustomTheme(base, mode);
};
