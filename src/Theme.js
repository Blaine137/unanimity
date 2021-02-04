import { createMuiTheme } from '@material-ui/core/styles';

export const LightTheme = createMuiTheme({
  palette: {
    text: {
      primary: 'rgb(26, 35, 59)',
      secondary: 'rgb(108, 129, 150)',
    },
    primary: {
      main: '#FFF',
      dark: 'rgb(243, 246, 255)',
    },
    secondary: {
      main: 'rgb(0, 0, 255)',
    },
  },
  MuiTypography: {
    variantMapping: {
      body1: 'p',
    },
  },
});
// Headers
LightTheme.typography.h1 = {
  fontSize: '2rem',
  color: '#05386B',
};
LightTheme.typography.h2 = {
  fontSize: '1rem',
  color: '#05386B',
};

// more typography
LightTheme.typography.subtitle1 = {
  fontSize: '.75rem',
  margin: '1rem .5rem',
  fontWeight: 'normal',
  color: LightTheme.palette.text.secondary,
};
LightTheme.typography.body1 = {
  fontSize: '1rem',
};

export const DarkTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#F6F6F6',
    },
    secondary: {
      main: '#F6F6F6',
    },
  },
  MuiTypography: {
    variantMapping: {
      body1: 'p',
    },
  },
});
// Headers
DarkTheme.typography.h1 = {
  fontSize: 'calc(1rem + 5vmin)',
  color: '#F6F6F6',
};
DarkTheme.typography.h2 = {
  fontSize: 'calc(1rem + 4vmin)',
  color: '#F6F6F6',
};
DarkTheme.typography.h3 = {
  fontSize: 'calc(1rem + 3vmin)',
  color: '#F6F6F6',
};
DarkTheme.typography.h4 = {
  fontSize: 'calc(1rem + 2vmin)',
  color: '#F6F6F6',
};
DarkTheme.typography.h5 = {
  fontSize: 'calc(1rem + 1vmin)',
  color: '#F6F6F6',
};

// more typography
DarkTheme.typography.subtitle1 = {
  fontSize: 'calc(1rem + 1vmin)',
  margin: '1rem .5rem',
  fontWeight: 'normal',
  color: '#F6F6F6',
};
DarkTheme.typography.body1 = {
  fontSize: 'calc(.75rem + .5vmin)',
  color: '#F6F6F6',
};
