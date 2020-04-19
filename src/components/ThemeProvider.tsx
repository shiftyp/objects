import React from "react";
import { ThemeProvider as InnerThemeProvider } from "emotion-theming";
import theme from "@rebass/preset";

export const ThemeProvider: React.FC = ({ children }) => (
  <InnerThemeProvider theme={theme}>{children}</InnerThemeProvider>
);
