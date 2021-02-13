/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Grid,
  Button,
  makeStyles,
  Typography,
  Hidden,
} from '@material-ui/core';

/**
 * Form component that will switch back and fourth between login in and sign up.
 * The state and logic for form validation is in checkIfAuthenticated.
 */
const LoginForm = (props) => {
  const [isSignUpFormShowing, setIsSignUpFormShowing] = useState(false);

  const useStyles = makeStyles(theme => ({
    logo: {
      maxWidth: '90%',
      maxHeight: '5vh',
      margin: '2vh 0',
    },
    formSize: {
      height: '80vh',
      maxWidth: '700px',
      maxHeight: '700px',
      margin: 'auto',
    },
    formTitle: {
      textAlign: 'center',
      padding: '0',
    },
    wordHighlight: {
      color: theme.palette.secondary.main,
    },
    guestBtn: {
      marginBottom: '1.5rem',
    },
    textingArtwork: {
      width: '100%',
      maxHeight: '100%',
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
    rightGridColum: {
      position: 'relative',
      background: theme.palette.primary.light,
      border: 0,
      borderRadius: '15px',
      height: '25vh',
    },
    textDividerContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    textDivider: {
      borderBottom: `1px solid ${theme.palette.text.secondary}`,
      width: '25%',
    },
    textDividerContent: {
      width: '50%',
    },
    lightButton: {
      backgroundColor: theme.palette.primary.light,
    },
    [theme.breakpoints.up('md')]: {
      textDivider: {
        width: '30%',
      },
      textDividerContent: {
        width: '40%',
      },
      rightGridColum: {
        height: '100vh',
      },
      logo: {
        maxWidth: '80%',
        maxHeight: '10vh',
        margin: '10vh 0 15vh 0',
      },
      textingArtwork: {
        maxHeight: '70%',
      },
    },
  }));
  const classes = useStyles();

  return (
    <Grid container justify="center" className={classes.gridContainer}>
      <Grid item xs={12} md={7} lg={8} xl={9}>
        <Grid container justify="center" alignItems="center" className={classes.gridFormContainer}>
          <Grid item md={10}>
            <Hidden mdUp>
              <img src="../../../logolarge.svg" alt="Unanimity Messenger Logo. Harmony through words." className={classes.logo} />
            </Hidden>
            <form
              onChange={
                () => {
                  /** If trying to sign up show realtime errors */
                  if (isSignUpFormShowing) {
                    props.validateSignUpValues(document.getElementById('userNameID').value, document.getElementById('passwordID').value);
                  }
                }
              }
            >
              <fieldset>
                <Grid container justify="space-evenly" alignItems="center" className={classes.formSize}>
                  <Grid item xs={12}>
                    <Typography className={classes.formTitle} variant="h1" component="legend">
                      SIGN <span className={classes.wordHighlight}>{isSignUpFormShowing ? 'UP' : 'IN'}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined" margin="normal" error={props.isUsernameError}>
                      <InputLabel htmlFor="userNameID">Username</InputLabel>
                      <OutlinedInput
                        id="userNameID"
                        inputProps={{
                          'aria-label': 'Username text input field', type: 'text', name: 'userNameID', required: true,
                        }}
                        label="Username"
                        aria-describedby="userNameIDError"
                      />
                      <FormHelperText id="userNameIDError">{props.usernameErrorFeedback}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined" margin="normal" error={props.isPasswordError}>
                      <InputLabel htmlFor="passwordID">Password</InputLabel>
                      <OutlinedInput
                        id="passwordID"
                        inputProps={{
                          'aria-label': 'password text input field', type: 'password', name: 'passwordID', required: true,
                        }}
                        label="Password"
                        aria-describedby="passwordError"
                      />
                      <FormHelperText id="passwordError">{props.passwordErrorFeedback}</FormHelperText>
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
                          if (isSignUpFormShowing) {
                            /** sign up form is showing so sign in */
                            props.checkForNewUser(e, document.getElementById('userNameID'), document.getElementById('passwordID'));
                          } else {
                            /** sign in */
                            props.checkName(e, document.getElementById('userNameID'), document.getElementById('passwordID'));
                          }
                        }}
                        disableElevation
                      >
                        SIGN {isSignUpFormShowing ? 'UP' : 'IN'}
                      </Button>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="normal">
                      <div className={classes.textDividerContainer}>
                        <div className={classes.textDivider} />
                        <Typography className={classes.textDividerContent} variant="subtitle1">Or Sign In as a Guest</Typography>
                        <div className={classes.textDivider} />
                      </div>
                    </FormControl>
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
                          props.checkName(e, 'guest', 'guest');
                        }}
                        disableElevation
                      >
                        GUEST SIGN IN
                      </Button>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="normal">
                      <Button
                        className={classes.lightButton}
                        aria-label="Register For Account button"
                        type="submit"
                        value="Register"
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={(e) => { e.preventDefault(); setIsSignUpFormShowing(!isSignUpFormShowing); }}
                        disableElevation
                      >
                        {isSignUpFormShowing ? <>Have a Account? <span className={classes.wordHighlight}>&nbsp; Sign In</span></> : <>Not a Member? <span className={classes.wordHighlight}>&nbsp; Sign Up</span></>}
                      </Button>
                    </FormControl>
                  </Grid>
                </Grid>
              </fieldset>
            </form>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={5} lg={4} xl={3} className={classes.rightGridColum}>
        <Hidden smDown>
          <img src="../../../logolarge.svg" alt="Unanimity Messenger Logo. Harmony through words." className={classes.logo} />
        </Hidden>
        <img src="../../../textingDrawing.svg" alt="Women texting on a phone" className={classes.textingArtwork} />
      </Grid>
    </Grid>
  );
};

export default LoginForm;
