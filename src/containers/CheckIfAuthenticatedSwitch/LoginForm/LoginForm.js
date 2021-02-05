/* eslint-disable react/jsx-one-expression-per-line */
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
} from '@material-ui/core';

const LoginForm = (props) => {
  const useStyles = makeStyles(theme => ({
    logo: {
      maxWidth: '100%',
      maxHeight: '10vh',
      margin: '10vh 0 15vh 0',
    },
    formHeight: {
      height: '80vh',
      maxWidth: '700px',
      maxHeight: '700px',
      margin: 'auto',
    },
    formTitle: {
      textAlign: 'center',
    },
    secondWord: {
      color: theme.palette.secondary.main,
    },
    guestBtn: {
      marginBottom: '1.5rem',
    },
    textingArtwork: {
      width: '100%',
      position: 'absolute',
      bottom: '0',
      right: '0',
    },
    gridFormContainer: {
      height: '100%',
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
          <Grid container justify="center" alignItems="center" className={classes.gridFormContainer}>
            <Grid item md={10}>
              <form>
                <fieldset>
                  <Grid container justify="space-evenly" alignItems="center" className={classes.formHeight}>
                    <Grid item xs={12}>
                      <Typography className={classes.formTitle} variant="h1" component="legend">
                        SIGN <span className={classes.secondWord}> IN </span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
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
                    </Grid>
                    <Grid item xs={12}>
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
                    </Grid>
                    <Grid item xs={12}>
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
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                      <Typography variant="subtitle1">Or Sign In as a Guest</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth margin="normal">
                        <Button
                          className={classes.guestBtn}
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
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth margin="normal">
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
                    </Grid>
                  </Grid>
                </fieldset>
              </form>
            </Grid>
          </Grid>
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
