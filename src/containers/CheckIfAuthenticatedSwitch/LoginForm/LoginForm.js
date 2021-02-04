import React from 'react';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Grid,
  Button,
  makeStyles,
  Typography,
  Divider,
  Container,
} from '@material-ui/core';

const LoginForm = (props) => {
  const useStyles = makeStyles(theme => ({
    logo: {
      maxWidth: '100%',
      maxHeight: '10vh',
      margin: '10vh 0 15vh 0',
    },
    formContainer: {
      maxWidth: '50%',
    },
    textingArtwork: {
      width: '100%',
      position: 'absolute',
      bottom: '0',
      right: '0',
    },
    gridContainer: {
      height: '100vh',
    },
    desktopRightColum: {
      position: 'relative',
      background: theme.palette.primary.dark,
      border: 0,
      borderRadius: '15px',
    },
  }));

  const classes = useStyles();
  return (
    <main>
      <Grid container justify="center" className={classes.gridContainer}>
        <Grid item md={9}>
          <Container className={classes.formContainer}>
            <form>
              <fieldset>
                <Typography variant="h1" component="legend">SIGN IN</Typography>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel htmlFor="userNameID">Username</InputLabel>
                  <OutlinedInput
                    id="userNameID"
                    inputProps={{
                      'aria-label': 'Username text input field', type: 'text', name: 'userNameID', required: true,
                    }}
                    label="Username"
                  />
                </FormControl>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel htmlFor="passwordID">Password</InputLabel>
                  <OutlinedInput
                    id="passwordID"
                    inputProps={{
                      'aria-label': 'password text input field', type: 'password', name: 'passwordID', required: true,
                    }}
                    label="Password"
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <Button
                    aria-label="Submit Login information button"
                    type="submit"
                    value="Log in"
                    color="secondary"
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={(e) => {
                      props.checkName(e, document.getElementById('userNameID'), document.getElementById('passwordID'));
                    }}
                  >
                    SIGN IN
                  </Button>
                  <Divider />
                  <Typography variant="subtitle1">Or Sign In as a Guest</Typography>
                  <Button
                    aria-label="Sign In as a Guest"
                    type="submit"
                    value="Guest"
                    color="secondary"
                    variant="outlined"
                    size="large"
                    fullWidth
                    onClick={(e) => {
                      console.log('guest btn clicked');
                    }}
                  >
                    GUEST SIGN IN
                  </Button>
                  <Button
                    aria-label="Register For Account button"
                    type="submit"
                    value="Register"
                    color="primary.dark"
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={(e) => {
                      props.checkForNewUser(e, document.getElementById('userNameID'), document.getElementById('passwordID'));
                    }}
                  >
                    Not a Member? Sign Up
                  </Button>
                </FormControl>
              </fieldset>
            </form>
          </Container>
        </Grid>
        <Grid item md={3} className={classes.desktopRightColum}>
          <img src="../../../logolarge.svg" alt="Unanimity Messenger Logo. Harmony through words." className={classes.logo} />
          <img src="../../../textingDrawing.svg" alt="Women texting on a phone" className={classes.textingArtwork} />
        </Grid>
      </Grid>
    </main>
  );
};

export default LoginForm;
