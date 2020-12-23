import { createMuiTheme } from '@material-ui/core/styles';


const Theme = createMuiTheme({
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

Theme.typography.h1 = {
  fontSize: 'calc(1rem + 5vmin)',
};
Theme.typography.h2 = {
  fontSize: 'calc(1rem + 4vmin)',
};
Theme.typography.h3 = {
  fontSize: 'calc(1rem + 3vmin)',
};
Theme.typography.h4 = {
  fontSize: 'calc(1rem + 2vmin)',
};
Theme.typography.h5 = {
  fontSize: 'calc(1rem + 1vmin)',
};
Theme.typography.subtitle1 = {
  fontSize: 'calc(1rem + 1.25vmin)',
}
Theme.typography.body1 = {
  fontSize: 'calc(.75rem + .5vmin)',
}

export default Theme;