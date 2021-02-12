/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import * as passwordHash from 'password-hash';
import { motion } from 'framer-motion';
import {
  FormControl, InputLabel, OutlinedInput, Button, makeStyles, Grid, Typography, FormHelperText,
} from '@material-ui/core';
import axios from '../../../../axios';

/**
* Child component of account settings. Is a form that takes in the current password and a new password to update.
* Handles updating the database to the new password.
*/
const UpdatePasswordForm = (props) => {
  const [oldPassword, setOldPassword] = useState('');
  const [isOldPasswordError, setIsOldPasswordError] = useState(false);
  const [oldPasswordErrorText, setOldPasswordErrorText] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newPasswordErrorText, setNewPasswordErrorText] = useState('');
  const [isNewPasswordError, setIsNewPasswordError] = useState(false);

  const useStyles = makeStyles(theme => ({
    formContainerSize: {
      height: '80vh',
      maxWidth: '700px',
      maxHeight: '500px',
      margin: 'auto',
    },
    formTitle: {
      textAlign: 'center',
      padding: '0',
    },
    wordHighlight: {
      color: theme.palette.secondary.main,
    },
  }));
  const classes = useStyles();

  // Adds new password to database for authenticated user
  const updatePasswordInDatabase = async () => {
    const newHashedPassword = passwordHash.generate(newPassword);
    // Cant not set password field to string because firebase requires to pass object. So we have to pass the entire user object with the updated password property.
    const oldUser = await axios.get(`users/u${props.authUID}.json`)
      .catch((err) => { setIsNewPasswordError(true); setNewPasswordErrorText(`Failed to update password. ${err}`); });
    const updatedUser = { ...oldUser.data };
    updatedUser.password = newHashedPassword;
    axios.put(`users/u${props.authUID}.json`, updatedUser)
      .then((res) => {
        if (res) {
          setIsNewPasswordError(false);
          setNewPasswordErrorText('Password successfully changed!');
        }
      })
      .catch((err) => { setIsNewPasswordError(true); setNewPasswordErrorText(`Failed to update password. ${err}`); });
  };

  /**
   *  Sanitizes and validates the new password.
   *  Then it confirms newPassword and ConfirmNewPassword are the same.
   *  Return True if it passes all checks else it returns false.
  */
  const validateAndConfirmNewPassword = async () => {
    setIsNewPasswordError(false);
    setNewPasswordErrorText('');
    if (newPassword.length < 5) {
      setIsNewPasswordError(true);
      setNewPasswordErrorText('New Password must be at least five(5) characters long.');
      return false;
    }
    if (newPassword.length > 20) {
      setIsNewPasswordError(true);
      setNewPasswordErrorText('New Password can only be twenty(20) characters long.');
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      setIsNewPasswordError(true);
      setNewPasswordErrorText('Passwords do not match.');
      return false;
    }
    return true;
  };

  /**
  * sanitizes all the passwords that are in the state.
  */
  const sanitizePasswordInState = async () => {
    let oldPasswordSanitized = await DOMPurify.sanitize(oldPassword);
    oldPasswordSanitized = await oldPasswordSanitized.replace(/[^\w]/g, '');
    await setOldPassword(oldPasswordSanitized);

    let newPasswordSanitized = await DOMPurify.sanitize(newPassword);
    newPasswordSanitized = await newPasswordSanitized.replace(/[^\w]/g, '');
    await setNewPassword(newPasswordSanitized);

    let confirmNewPasswordSanitized = await DOMPurify.sanitize(confirmNewPassword);
    confirmNewPasswordSanitized = await confirmNewPasswordSanitized.replace(/[^\w]/g, '');
    await setConfirmNewPassword(confirmNewPasswordSanitized);
  };

  /**
  * Calls all the steps needed to update the password in order.
  */
  const updatePasswordOrchestrator = async e => {
    e.preventDefault();
    /** reset error message */
    setIsOldPasswordError(false);
    setOldPasswordErrorText('');

    await sanitizePasswordInState();
    const isPasswordCorrect = await props.checkPasswordInput(oldPassword);
    if (isPasswordCorrect && isPasswordCorrect !== 300) {
      if (await validateAndConfirmNewPassword()) {
        updatePasswordInDatabase();
      }
    } else {
      setIsOldPasswordError(true);
      setOldPasswordErrorText('Incorrect current password.');
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
          scale: 1,
        },
      }}
    >
      <form onSubmit={updatePasswordOrchestrator} onChange={validateAndConfirmNewPassword} onBlur={validateAndConfirmNewPassword}>
        <Grid container justify="space-evenly" alignItems="center" className={classes.formContainerSize}>
          <Grid item xs={12}>
            <Typography className={classes.formTitle} variant="h1" component="legend">
              UPDATE <span className={classes.wordHighlight}> PASSWORD </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" margin="normal" error={isOldPasswordError}>
              <InputLabel htmlFor="oldPassword">
                Old Password
              </InputLabel>
              <OutlinedInput
                id="oldPassword"
                inputProps={{
                  'aria-label': 'Enter your current password', type: 'password', name: 'oldPassword', required: true,
                }}
                label="oldPassword"
                onChange={(e) => setOldPassword(e.target.value)}
                aria-describedby="oldPasswordError"
              />
              <FormHelperText id="oldPasswordError">{oldPasswordErrorText}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" margin="normal" error={isNewPasswordError}>
              <InputLabel htmlFor="newPassword">
                New Password
              </InputLabel>
              <OutlinedInput
                id="newPassword"
                inputProps={{
                  'aria-label': 'Enter your new password', type: 'password', name: 'newPassword', required: true,
                }}
                label="newPassword"
                onChange={(e) => setNewPassword(e.target.value)}
                aria-describedby="newPasswordError"
              />
              <FormHelperText id="newPasswordError">{newPasswordErrorText}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" margin="normal" error={isNewPasswordError}>
              <InputLabel htmlFor="confirmNewPassword">
                Confirm Password
              </InputLabel>
              <OutlinedInput
                id="confirmNewPassword"
                inputProps={{
                  'aria-label': 'confirm your new password', type: 'password', name: 'confirmNewPassword', required: true,
                }}
                label="confirmNewPassword"
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                aria-describedby="confirmNewPasswordError"
              />
              <FormHelperText id="confirmNewPasswordError">{newPasswordErrorText}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              aria-label="Click to proceed updating your password"
              type="submit"
              variant="contained"
              color="secondary"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </motion.div>
  );
};

export default UpdatePasswordForm;
