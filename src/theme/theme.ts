import { GluestackUIProvider, config } from '@gluestack-ui/themed';

// Extend the default theme with our brand colors
export const customTheme = {
  ...config.theme,
  colors: {
    ...config.theme.colors,
    primary: {
      50: "#E9F1F8",
      100: "#C7DCF0",
      200: "#A5C7E7",
      300: "#83B2DE",
      400: "#4F8ED1",
      500: "#216EAF", // Primary Brand Color
      600: "#1B5C95",
      700: "#15487A",
      800: "#103460",
      900: "#0B2046",
    },
    secondary: {
      50: "#FBE8EC",
      100: "#F5C5CF",
      200: "#EFA2B2",
      300: "#E97F95",
      400: "#E5577D",
      500: "#E12E56", // Accent Color
      600: "#C42249",
      700: "#A71B3D",
      800: "#891531",
      900: "#6C1025",
    },
  },
}; 