/* eslint-disable no-else-return */
/* eslint-disable prefer-const */
import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import * as passwordHash from 'password-hash';
import { connect } from 'react-redux';
import { motion } from 'framer-motion';
import Messenger from '../Messenger/Messenger';
import LoginForm from './LoginForm/LoginForm';
import axios from '../../axios';
import { setAuthentication, setAuthenticatedUserID, setAuthenticatedUsername } from '../../redux/actions';

const mapStateToProps = (state) => ({
  isAuthenticated: state.authentication.isAuthenticated,
  authenticatedUserID: state.authentication.authenticatedUserID,
  authenticatedUsername: state.authentication.authenticatedUsername,
});

const mapDispatchToProps = {
  setAuthentication,
  setAuthenticatedUserID,
  setAuthenticatedUsername,
};

const CheckIfAuthenticatedSwitch = (props) => {
  const [loginFormSubmissionCount, setLoginFormSubmissionCount] = useState(1);
  const [loginFormDisabledTime, setLoginFormDisabledTime] = useState(null);
  let [isUsernameError, setIsUsernameError] = useState(false);
  let [usernameErrorFeedback, setUsernameErrorFeedback] = useState('');
  let [isPasswordError, setIsPasswordError] = useState(false);
  let [passwordErrorFeedback, setPasswordErrorFeedback] = useState('');

  /**
  * If the user has submitted the form more than ten times. Make them wait ten seconds to resubmit and alert them to wait ten seconds.
  * Returns true if they should be allowed to submit the form. returns false if they are spamming the form.
  */
  const throttleLoginFormSpam = () => {
    setLoginFormSubmissionCount(loginFormSubmissionCount + 1);
    if (loginFormSubmissionCount >= 10) {
      if (loginFormDisabledTime === null) {
        setLoginFormDisabledTime(Date.now());
      }
      const currentTime = Date.now();
      if (currentTime >= (loginFormDisabledTime + 10000)) {
        setLoginFormDisabledTime(currentTime);
        return true;
      }
      setIsPasswordError(true);
      setIsUsernameError(true);
      setUsernameErrorFeedback('You must wait ten seconds before resubmitting the form.');
      setPasswordErrorFeedback('You must wait ten seconds before resubmitting the form.');
      return false;
    }
    return true;
  };

  /** sets users information in all location across the database */
  // eslint-disable-next-line consistent-return
  const registerUserInDatabase = async (newUser, newPassword, newUserID) => {
    let sanitizedNewUserName = DOMPurify.sanitize(newUser);
    sanitizedNewUserName = sanitizedNewUserName.replace(/[^\w]/g, '');
    let sanitizedNewPassword = DOMPurify.sanitize(newPassword);
    sanitizedNewPassword = sanitizedNewPassword.replace(/[^\w^!?$]/g, '');
    let sanitizedNewUserID = DOMPurify.sanitize(newUserID);
    sanitizedNewUserID = sanitizedNewUserID.replace(/[^\w!?$]/g, '');
    const newCompleteUser = {
      password: passwordHash.generate(sanitizedNewPassword),
      userID: sanitizedNewUserID,
      userName: sanitizedNewUserName,
    };
    // sets new users in users
    axios.put(`users/u${sanitizedNewUserID}.json`, newCompleteUser)
      // eslint-disable-next-line no-console
      .catch((error) => console.log('registerUserInDatabase user/u Error', error));

    // -----adds user to userIDByUsername-----

    const userIDByUsername = {};
    // set property of object name to sanitizedNewUserName and then set the value of the property to sanitizedNewUserID
    userIDByUsername[sanitizedNewUserName] = sanitizedNewUserID;
    // axios get old usernames and ID
    try {
      let oldUserIDByUsername = await axios.get('userIDByUsername.json');
      oldUserIDByUsername = oldUserIDByUsername.data;
      const combinedUserIDByUsername = { ...oldUserIDByUsername, ...userIDByUsername };
      // eslint-disable-next-line radix
      let updatedNextUserID = parseInt(sanitizedNewUserID);
      // eslint-disable-next-line no-plusplus
      updatedNextUserID++;
      // sets nextUserId to correct ID
      combinedUserIDByUsername.nextUserID = updatedNextUserID;
      // update db to latest version
      axios.put('userIDByUsername.json', combinedUserIDByUsername);
    } catch (error) {
      return 300;
    }
    // -----end of adds user to userIDByUsername-----

    // -----start add to usersChatRooms in DB-----
    // ucr stands for UserChatRoom
    const newUCR = {
      chatRooms: [],
      userID: sanitizedNewUserID,
    };
    axios.put(`usersChatRooms/ucr${sanitizedNewUserID}.json`, newUCR);
    // -----end of add to usersChatRooms in DB-----

    // inform user that account was created
    const accountCreatedSuccessMessage = DOMPurify.sanitize(`Your account has been created! Username: '${sanitizedNewUserName}'`);
    let sanitizedAccountCreatedSuccessMessage = accountCreatedSuccessMessage.replace(/[^\w\s!?$]/g, '');
    sanitizedAccountCreatedSuccessMessage = DOMPurify.sanitize(sanitizedAccountCreatedSuccessMessage);
    setIsPasswordError(false);
    setIsUsernameError(false);
    setUsernameErrorFeedback(sanitizedAccountCreatedSuccessMessage);
    setPasswordErrorFeedback(sanitizedAccountCreatedSuccessMessage);
  };

  /**
   * Checks the length of the username and password field.
   * Notifies the user if the username or password is too short or too long.
   * The parameters taken in may or may not be sanitized.
   */
  const validateSignUpValues = (newUserName, newPassword, confirmPassword) => {
    /** Reset form errors */
    setIsPasswordError(false);
    setIsUsernameError(false);
    setUsernameErrorFeedback('');
    setPasswordErrorFeedback('');

    /** checks username and password lengths */
    if ((newUserName.length > 10 && newPassword.length > 20) || (!newUserName && !newPassword) || (newUserName.length < 5 && newPassword.length < 5)) {
      setIsPasswordError(true);
      setIsUsernameError(true);
      setUsernameErrorFeedback('Username must be between five(5) and ten(10) characters.');
      setPasswordErrorFeedback('Password must be between five(5) and twenty(20) characters.');
      return false;
    } else if (newUserName.length > 10) {
      setIsUsernameError(true);
      setUsernameErrorFeedback('Username must be less than ten(10) characters.');
      return false;
    } else if (newPassword.length > 20) {
      setIsPasswordError(true);
      setPasswordErrorFeedback('Password must be less than twenty(20) characters.');
      return false;
    } else if (newUserName.length < 5 || !newUserName) {
      setIsUsernameError(true);
      setUsernameErrorFeedback('Username must be five(5) characters long.');
      return false;
    } else if (newPassword.length < 5 || !newPassword) {
      setIsPasswordError(true);
      setPasswordErrorFeedback('Password must be five(5) characters long.');
      return false;
    } else if (newPassword !== confirmPassword) {
      setIsPasswordError(true);
      setPasswordErrorFeedback('Password do not match');
      return false;
    } else {
      return true;
    }
  };

  /**
   * See if the username has already been registered with an account
   * If the username is available it will call the registerUserInDatabase
   */
  const checkIfUserAlreadyExists = async (event, newUser, newPassword, confirmPassword) => {
    event.preventDefault();
    const newUserValue = newUser.value;
    const newPasswordValue = newPassword.value;
    const confirmPasswordValue = confirmPassword.value;
    let newUserID = null;
    let sanitizedNewUserName = DOMPurify.sanitize(newUserValue);
    sanitizedNewUserName = sanitizedNewUserName.replace(/[^\w]/g, '');
    sanitizedNewUserName = sanitizedNewUserName.toLowerCase();
    let sanitizedNewPassword = DOMPurify.sanitize(newPasswordValue);
    sanitizedNewPassword = sanitizedNewPassword.replace(/[^\w^!?$]/g, '');
    let sanitizedConfirmPassword = DOMPurify.sanitize(confirmPasswordValue);
    sanitizedConfirmPassword = sanitizedConfirmPassword.replace(/[^\w^!?$]/g, '');

    if (throttleLoginFormSpam()) {
      /** If the data is valid */
      if (validateSignUpValues(sanitizedNewUserName, sanitizedNewPassword, sanitizedConfirmPassword)) {
        try {
          const nextUserID = await axios.get('userIDByUsername/nextUserID.json');
          newUserID = nextUserID.data;
          // try to get the username they are wanting to register as
          const newUserName = await axios.get(`userIDByUsername/${sanitizedNewUserName}.json`);
          if (!newUserName.data) {
            // create user if the username is not taken
            registerUserInDatabase(sanitizedNewUserName, sanitizedNewPassword, newUserID);
          } else {
            setIsUsernameError(true);
            setUsernameErrorFeedback('Username is already taken!');
          }
        } catch (error) {
          setIsUsernameError(true);
          setUsernameErrorFeedback('Failed to add username to the database. Please try agin.');
        }
      }
    }
  };

  /**
   * Compares hashed checkPassword to password on the database.
   * If correct will set authentication value.
   * if false will notify the user.
   */
  // eslint-disable-next-line consistent-return
  const checkPasswordForUserIDAndLogin = async (checkUsername, checkUserID, checkPassword) => {
    let sanitizedUsername = DOMPurify.sanitize(checkUsername);
    sanitizedUsername = sanitizedUsername.replace(/[^\w]/g, '');
    let sanitizedUserID = DOMPurify.sanitize(checkUserID);
    sanitizedUserID = sanitizedUserID.replace(/[^\w]/g, '');
    let sanitizedPassword = DOMPurify.sanitize(checkPassword);
    sanitizedPassword = sanitizedPassword.replace(/[^\w^!?$]/g, '');

    try {
      let hashedPassword = await axios.get(`users/u${sanitizedUserID}/password.json`);
      hashedPassword = hashedPassword.data;
      if (passwordHash.verify(sanitizedPassword, hashedPassword)) {
        /** Set form feedback to not error */
        setIsPasswordError(false);
        setIsUsernameError(false);
        setUsernameErrorFeedback('');
        setPasswordErrorFeedback('');
        /** Log In user */
        props.setAuthenticatedUserID(sanitizedUserID);
        props.setAuthenticatedUsername(sanitizedUsername);
        setTimeout(() => { props.setAuthentication(true); }, 200);
      } else {
        // pwd was wrong so set authenticated to false to make sure it failed. and set username and userID to null
        props.setAuthenticatedUserID(null);
        props.setAuthenticatedUsername(null);
        props.setAuthentication(false);
        /** Update from feedback */
        setIsPasswordError(true);
        setIsUsernameError(true);
        setUsernameErrorFeedback('Incorrect username or password.');
        setPasswordErrorFeedback('Incorrect username or password.');
      }
    } catch {
      /** Update from feedback */
      setIsPasswordError(true);
      setIsUsernameError(true);
      setUsernameErrorFeedback('Incorrect username or password.');
      setPasswordErrorFeedback('Incorrect username or password.');
      return 300;
    }
  };

  /**
   * Makes sure username exists and then get the userID for that user.
   * Calls check password passing the username, userID, and password.
   * if username dose not exist it will notify the user.
   */
  // eslint-disable-next-line consistent-return
  const checkUserNameForLogin = async (authValues, userNameElement, passwordElement) => {
    if (authValues) { authValues.preventDefault(); }
    const username = userNameElement.value || userNameElement;
    const password = passwordElement.value || passwordElement;
    let userID = null;
    let sanitizedUsername = DOMPurify.sanitize(username);
    sanitizedUsername = sanitizedUsername.replace(/[^\w]/g, '');
    // make usernames non-caseSensitive
    sanitizedUsername = sanitizedUsername.toLowerCase();
    let sanitizedPassword = DOMPurify.sanitize(password);
    sanitizedPassword = sanitizedPassword.replace(/[^\w^!?$]/g, '');

    if (sanitizedUsername && throttleLoginFormSpam()) {
      // get userId by sanitizedUsername
      try {
        userID = await axios.get(`userIDByUsername/${sanitizedUsername}.json`);
        userID = userID.data;
        if (!userID) {
          setIsPasswordError(true);
          setIsUsernameError(true);
          setUsernameErrorFeedback('Incorrect username or password.');
          setPasswordErrorFeedback('Incorrect username or password.');
        } else {
          // now that we know the sanitizedUsername exists and we have the userID for that sanitizedUsername check the password
          // eslint-disable-next-line no-lonely-if
          if (sanitizedPassword) { checkPasswordForUserIDAndLogin(sanitizedUsername, userID, sanitizedPassword); }
        }
      } catch (error) {
        return 300;
      }
    }
  };

  /**
   * If authenticated show the messenger page.
   * If user is not authenticated then shows the login form.
   */
  const ShowLoginFormOrMessenger = () => {
    if (props.isAuthenticated) {
      // messenger has its own <main></main>
      return (
        <Messenger
          showHideCustomAlert={props.showHideCustomAlert}
          isAuthenticated={props.isAuthenticated}
          setAuthentication={props.setAuthentication}
          authenticatedUserID={props.authenticatedUserID}
          setAuthenticatedUserID={props.setAuthenticatedUserID}
          authenticatedUsername={props.authenticatedUsername}
          setAuthenticatedUsername={props.setAuthenticatedUsername}
        />
      );
    }
    return (
      <main>
        <LoginForm
          isUsernameError={isUsernameError}
          usernameErrorFeedback={usernameErrorFeedback}
          isPasswordError={isPasswordError}
          passwordErrorFeedback={passwordErrorFeedback}
          checkName={checkUserNameForLogin}
          checkForNewUser={checkIfUserAlreadyExists}
          validateSignUpValues={validateSignUpValues}
        />
      </main>
    );
  };

  return (
    <>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={props.pageAnimationVariants}
        transition={props.pageTransition}
      >
        { /* messenger is set by ifAuthenticated(). is either the Messenger component or the login screen */}
        {ShowLoginFormOrMessenger()}
      </motion.div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckIfAuthenticatedSwitch);
