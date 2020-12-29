import { createMuiTheme } from '@material-ui/core/styles';

export const LightTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#05386B',
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
//Headers
LightTheme.typography.h1 = {
  fontSize: 'calc(1rem + 5vmin)',
  color: '#05386B'
};
LightTheme.typography.h2 = {
  fontSize: 'calc(1rem + 4vmin)',
  color: '#05386B'
};
LightTheme.typography.h3 = {
  fontSize: 'calc(1rem + 3vmin)',
  color: '#05386B'
};
LightTheme.typography.h4 = {
  fontSize: 'calc(1rem + 2vmin)',
  color: '#05386B'
};
LightTheme.typography.h5 = {
  fontSize: 'calc(1rem + 1vmin)',
  color: '#05386B'
};

//more typography 
LightTheme.typography.subtitle1 = {
  fontSize: 'calc(1rem + 1vmin)',
  margin: '1rem .5rem',
  fontWeight: 'normal',
  color: '#313639'
}
LightTheme.typography.body1 = {
  fontSize: 'calc(.75rem + .5vmin)',
}

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
//Headers
DarkTheme.typography.h1 = {
  fontSize: 'calc(1rem + 5vmin)',
  color: '#F6F6F6'
};
DarkTheme.typography.h2 = {
  fontSize: 'calc(1rem + 4vmin)',
  color: '#F6F6F6'
};
DarkTheme.typography.h3 = {
  fontSize: 'calc(1rem + 3vmin)',
  color: '#F6F6F6'
};
DarkTheme.typography.h4 = {
  fontSize: 'calc(1rem + 2vmin)',
  color: '#F6F6F6'
};
DarkTheme.typography.h5 = {
  fontSize: 'calc(1rem + 1vmin)',
  color: '#F6F6F6'
};

//more typography 
DarkTheme.typography.subtitle1 = {
  fontSize: 'calc(1rem + 1vmin)',
  margin: '1rem .5rem',
  fontWeight: 'normal',
  color: '#F6F6F6'
}
DarkTheme.typography.body1 = {
  fontSize: 'calc(.75rem + .5vmin)',
  color: '#F6F6F6'
}