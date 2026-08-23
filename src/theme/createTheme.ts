import type { CSSProperties } from "react";
import type { ThemeOptions } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";

const hexToRgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
};

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      primaryFont: string;
      secondaryFont: string;
      divider: string;
      container: string;
      buttonText: string;
      hover: string;
      hoverOpacity: number;
      cardbackground: string;
      borderRadius: {
        small: string;
        medium: string;
        large: string;
      };
      status: {
        draft: string;
        pending: string;
        approved: string;
        cancelled: string;
        completed: string;
      };
    };
  }

  interface ThemeOptions {
    custom?: {
      primaryFont?: string;
      secondaryFont?: string;
      divider?: string;
      container?: string;
      buttonText?: string;
      hover?: string;
      hoverOpacity?: number;
      cardbackground?: string;
      borderRadius?: {
        small?: string;
        medium?: string;
        large?: string;
      };
      status?: {
        draft?: string;
        pending?: string;
        approved?: string;
        cancelled?: string;
        completed?: string;
      };
    };
  }
}

export const createCustomTheme = (
  themeData: any,
  mode: "light" | "dark"
): ThemeOptions => {
  const { colors } = themeData;
  const hoverOpacity = colors.hoverOpacity || 20;

  const fonts = {
    primary: "Montserrat, sans-serif",
    secondary: "Outfit, sans-serif",
  };

  const borderRadius = {
    small: "8px",
    medium: "12px",
    large: "16px",
  };

  return {
    palette: {
      mode,
      primary: colors.primary,
      secondary: colors.secondary,
      error: colors.error,
      warning: colors.warning,
      info: colors.info,
      success: colors.success,
      background: { default: mode === 'light' ? '#f5f7fa' : '#0d1117', paper: colors.container },
      divider: colors.divider,
      text: { primary: colors.primaryFont, secondary: colors.secondaryFont },
    },
    typography: {
      fontFamily: fonts.primary,
      h1: { fontFamily: fonts.primary, fontSize: "40px", fontWeight: 700 },
      h2: { fontFamily: fonts.primary, fontSize: "32px", fontWeight: 700 },
      h3: { fontFamily: fonts.primary, fontSize: "28px", fontWeight: 600 },
      h4: { fontFamily: fonts.primary, fontSize: "24px", fontWeight: 600 },
      h5: { fontFamily: fonts.primary, fontSize: "20px", fontWeight: 600 },
      h6: { fontFamily: fonts.primary, fontSize: "18px", fontWeight: 600 },
      body1: { fontFamily: fonts.secondary, fontSize: "16px" },
      body2: { fontFamily: fonts.secondary, fontSize: "14px" },
      button: { fontFamily: fonts.secondary, fontSize: "14px", textTransform: "none", fontWeight: 500 },
      caption: { fontFamily: fonts.secondary, fontSize: "12px" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { fontFamily: fonts.secondary, backgroundColor: mode === 'light' ? '#f5f7fa' : '#0d1117' },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: "none",
            borderRadius: borderRadius.medium,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          },
          columnHeader: {
            backgroundColor: colors.primary.main,
            minHeight: "48px !important",
          },
          columnHeaderTitle: {
            color: "white !important",
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: fonts.secondary,
          },
          row: {
            minHeight: "44px !important",
          },
          cell: {
            fontSize: "14px",
            fontFamily: fonts.secondary,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontFamily: fonts.secondary,
            borderRadius: borderRadius.medium,
            fontWeight: 500,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: borderRadius.medium,
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          root: { zIndex: 1400 },
          paper: { borderRadius: borderRadius.large },
        },
      },
      MuiPopover: { styleOverrides: { root: { zIndex: 1500 } } },
      MuiTooltip: { styleOverrides: { popper: { zIndex: 1600 }, tooltip: { borderRadius: borderRadius.small } } },
      MuiCard: { styleOverrides: { root: { borderRadius: borderRadius.large } } },
      MuiPaper: { styleOverrides: { root: { borderRadius: borderRadius.medium } } },
      MuiChip: { styleOverrides: { root: { borderRadius: borderRadius.small, fontFamily: fonts.secondary } } },
    },
    custom: {
      primaryFont: colors.primaryFont,
      secondaryFont: colors.secondaryFont,
      divider: colors.divider,
      container: colors.container,
      buttonText: colors.buttonText,
      hover: colors.hover,
      hoverOpacity,
      cardbackground: colors.container,
      borderRadius,
      status: {
        draft: '#9E9E9E',
        pending: '#1976D2',
        approved: '#388E3C',
        cancelled: '#FF6F00',
        completed: '#2E7D32',
      },
    },
  };
};
