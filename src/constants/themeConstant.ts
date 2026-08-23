export interface ThemeData {
  themeLogoPath?: string;
  colors: {
    primary: { main: string; light: string; dark: string };
    secondary: { main: string; light: string; dark: string };
    error: { main: string; light: string; dark: string };
    warning: { main: string; light: string; dark: string };
    info: { main: string; light: string; dark: string };
    success: { main: string; light: string; dark: string };
    primaryFont: string;
    secondaryFont: string;
    divider: string;
    container: string;
    buttonText: string;
    hover: string;
    hoverOpacity: number;
    status: {
      new: string;
      inPending: string;
      active: string;
      cancelled: string;
      completed: string;
    };
  };
  fonts?: {
    primary: string;
    secondary: string;
  };
}

export const DEFAULT_THEME_LIGHT: ThemeData = {
  themeLogoPath: undefined,
  colors: {
    primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
    secondary: { main: '#9c27b0', light: '#ba68c8', dark: '#7b1fa2' },
    error: { main: '#d32f2f', light: '#ef5350', dark: '#c62828' },
    warning: { main: '#ed6c02', light: '#ff9800', dark: '#e65100' },
    info: { main: '#0288d1', light: '#03a9f4', dark: '#01579b' },
    success: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    primaryFont: '#3C3C3C',
    secondaryFont: '#6F6F6F',
    divider: '#BEBEBE',
    container: '#FFFFFF',
    buttonText: '#FFFFFF',
    hover: '#4E7BFF',
    hoverOpacity: 20,
    status: {
      new: '#9E9E9E',
      inPending: '#1976D2',
      active: '#388E3C',
      cancelled: '#FF6F00',
      completed: '#2E7D32',
    },
  },
  fonts: {
    primary: 'Montserrat, sans-serif',
    secondary: 'Outfit, sans-serif',
  },
};

export const DEFAULT_THEME_DARK: ThemeData = {
  ...DEFAULT_THEME_LIGHT,
  colors: {
    ...DEFAULT_THEME_LIGHT.colors,
    primary: { main: '#90caf9', light: '#e3f2fd', dark: '#42a5f5' },
    secondary: { main: '#ce93d8', light: '#f3e5f5', dark: '#ba68c8' },
    error: { main: '#ffcdd2', light: '#ffebee', dark: '#ef5350' },
    container: '#121212',
    divider: '#374151',
    primaryFont: '#F9FAFB',
    secondaryFont: '#D1D5DB',
    buttonText: '#121212',
  },
};
