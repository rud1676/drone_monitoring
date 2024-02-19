import React, { ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false;
    sm: false;
    md: false;
    lg: false;
    xl: false;
    desktop: true;
  }
}

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          font-family: 'Noto Sans KR', sans-serif;
          height:100%;
        }
      `,
    },
    MuiButtonBase: {
      defaultProps: {
        // disableTouchRipple: true,
      },
    },
  },
  breakpoints: {
    values: {
      desktop: 1090,
    },
  },
});

interface AuxProps {
  children: ReactNode;
}

const AppContainer = ({ children }: AuxProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppContainer;
