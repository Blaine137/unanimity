import { createMuiTheme } from '@material-ui/core/styles';

// eslint-disable-next-line import/prefer-default-export
export const LightTheme = createMuiTheme({
  palette: {
    text: {
      primary: 'rgb(26, 35, 59)',
      secondary: 'rgb(108, 129, 150)',
    },
    primary: {
      light: 'rgb(243, 246, 255)',
      main: 'rgb(26, 35, 59)',
    },
    secondary: {
      main: 'rgb(0, 0, 255)',
    },
    background: {
      default: '#FFF',
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
  fontSize: '.90rem',
  fontWeight: 'normal',
  color: LightTheme.palette.text.secondary,
};
LightTheme.typography.subtitle2 = {
  fontSize: '.90rem',
  fontWeight: 'normal',
  color: LightTheme.palette.text.primary,
};
LightTheme.typography.body1 = {
  fontSize: '1rem',
};
