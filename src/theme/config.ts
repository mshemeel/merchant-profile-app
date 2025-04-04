import { createConfig } from "@gluestack-ui/themed";
import { config as gluestackConfig } from "@gluestack-ui/config";

export const config = createConfig({
  ...gluestackConfig,
  tokens: {
    ...gluestackConfig.tokens,
    colors: {
      ...gluestackConfig.tokens.colors,
      primary50: "#E9F1F8",
      primary100: "#C7DCF0",
      primary200: "#A5C7E7",
      primary300: "#83B2DE",
      primary400: "#4F8ED1",
      primary500: "#216EAF", // Primary Brand Color
      primary600: "#1B5C95",
      primary700: "#15487A",
      primary800: "#103460",
      primary900: "#0B2046",
      
      secondary50: "#FBE8EC",
      secondary100: "#F5C5CF",
      secondary200: "#EFA2B2",
      secondary300: "#E97F95",
      secondary400: "#E5577D",
      secondary500: "#E12E56", // Accent Color
      secondary600: "#C42249",
      secondary700: "#A71B3D",
      secondary800: "#891531",
      secondary900: "#6C1025",
    },
  },
  aliases: {
    ...gluestackConfig.aliases
  }
});

// Export type for components props
export type AppConfig = typeof config; 