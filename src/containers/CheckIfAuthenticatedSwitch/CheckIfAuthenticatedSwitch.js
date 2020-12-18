import React, { useState, Fragment } from 'react';
import Messenger from '../Messenger/Messenger';
import LoginForm from './LoginForm/LoginForm';
import axios from '../../axios';
import DOMPurify from 'dompurify';
import * as passwordHash from 'password-hash'; //import npm pass https://www.npmjs.com/package/password-hash
import { connect } from 'react-redux';
import { setAuthentication, setUserId, setUsername } from '../../redux/actions';
import NavigationRouterLinks from '../../components/NavigationRouterLinks/NavigationRouterLinks';
import { motion } from 'framer-motion';
 
const mapStateToProps = state => {
    return {
        authenticated: state.authentication.authenticated,
        userId: state.authentication.userId,
        username: state.authentication.username
    };
};

const mapDispatchToProps = {
    setAuthentication,
    setUserId,
    setUsername
};

let CheckIfAuthenticatedSwitch = props => {
    const [loginFormSubmissionCount, setLoginFormSubmissionCount] = useState(1);
    const [loginFormDisabledTime, setLoginFormDisabledTime] = useState(null);

    //if the user has submitted the form more than three times. Make them wait ten seconds to resubmit and alert them to wait ten seconds.
    //returns true if they should be allowed to submit the form. returns false if they are spamming the form.
    const throttleLoginFormSpam = () => {
        setLoginFormSubmissionCount(loginFormSubmissionCount + 1);
        if(loginFormSubmissionCount >= 3) {      
            if( loginFormDisabledTime === null ) {                                      
                setLoginFormDisabledTime(Date.now());                         
            }                       
            let currentTime = Date.now();                      
            if(currentTime >= (loginFormDisabledTime + 10000)) {                               
                setLoginFormDisabledTime(currentTime);                                       
                    return true;  
            } else {
                props.showHideCustomAlert("you must wait ten seconds before resubmitting the form.", null);
                return false;
            }
        } else {
            return true;
        }
    }

    const checkIfUserAlreadyExists = async (event, newUser, newPassword) => {    
        event.preventDefault();
        let newUserValue = newUser.value;
        let newPasswordValue = newPassword.value;
        let newUserID = null;
        let sanitizedNewUserName = DOMPurify.sanitize(newUserValue);
        sanitizedNewUserName = sanitizedNewUserName.replace(/[^\w]/g,'');
        sanitizedNewUserName = sanitizedNewUserName.toLowerCase();
        let sanitizedNewPassword = DOMPurify.sanitize(newPasswordValue);
        sanitizedNewPassword = sanitizedNewPassword.replace(/[^\w^!?$]/g,'');
        
        if(throttleLoginFormSpam()) {
            //username a valid length
            if(sanitizedNewUserName.length > 10 || sanitizedNewPassword.length > 20) {
                props.showHideCustomAlert("Username must be less than 10 characters and password must be less than 20.", null);
            } else if(!sanitizedNewUserName || !sanitizedNewPassword || sanitizedNewUserName.length < 5 || sanitizedNewPassword.length < 5) {
                props.showHideCustomAlert("Username and password must be 5 characters long.", null)
            } else {   
                try {
                    let nextUserID = await axios.get('userIDByUsername/nextUserID.json');
                    newUserID = nextUserID.data;
                    //try to get the username they are wanting to register as
                    let newUserName = await axios.get('userIDByUsername/' + sanitizedNewUserName + '.json');
                    if(!newUserName.data) {
                        //create user if the username is not taken
                        registerUserInDatabase(sanitizedNewUserName, sanitizedNewPassword, newUserID); 
                    } else {
                        props.showHideCustomAlert("Username is already taken!", null);
                    }
                } catch(error) {
                    props.showHideCustomAlert("Failed to add username to the database. Please try agin.", null);
                }              
            }
        }
    }

    //sets users in db
    const registerUserInDatabase = async (newUser, newPassword, newUserID) => {
        let sanitizedNewUserName = DOMPurify.sanitize(newUser);
        sanitizedNewUserName = sanitizedNewUserName.replace(/[^\w]/g,'');
        let sanitizedNewPassword = DOMPurify.sanitize(newPassword);
        sanitizedNewPassword = sanitizedNewPassword.replace(/[^\w^!?$]/g,'');
        let sanitizedNewUserID = DOMPurify.sanitize( newUserID ); 
        sanitizedNewUserID = sanitizedNewUserID.replace(/[^\w!?$]/g,'');      
        let newCompleteUser = {
            password: passwordHash.generate(sanitizedNewPassword),
            userID: sanitizedNewUserID,
            userName: sanitizedNewUserName
        };
        //sets new users in users
        axios.put('users/u' + sanitizedNewUserID + '.json' , newCompleteUser)
        .catch(error => console.log('registerUserInDatabase user/u Error', error));  

        //-----adds user to userIDByUsername-----

        let userIDByUsername = {};
        //set property of object name to sanitizedNewUserName and then set the value of the property to sanitizedNewUserID
        userIDByUsername[sanitizedNewUserName] = sanitizedNewUserID;
        //axios get old usernames and ID
        try {
            let oldUserIDByUsername = await axios.get('userIDByUsername.json');
            oldUserIDByUsername = oldUserIDByUsername.data
            let combinedUserIDByUsername = { ...oldUserIDByUsername, ...userIDByUsername };
            let updatedNextUserID = parseInt(sanitizedNewUserID);
            updatedNextUserID++;
            //sets nextUserId to correct ID
            combinedUserIDByUsername.nextUserID = updatedNextUserID;
            //update db to latest version
            axios.put('userIDByUsername.json', combinedUserIDByUsername);
        } catch(error) {
            return 300;
        }
        //-----end of adds user to userIDByUsername-----

        //-----start add to usersChatRooms in DB-----
            //ucr stands for UserChatRoom
            let newUCR = {
                chatRooms: [],
                userID: sanitizedNewUserID
            }
            axios.put('usersChatRooms/ucr' + sanitizedNewUserID + '.json', newUCR);
        //-----end of add to usersChatRooms in DB-----

        //inform user that account was created
        let accountCreatedSuccessMessage = DOMPurify.sanitize("Your account has been created! Username: '" + sanitizedNewUserName + "'");
        let sanitizedAccountCreatedSuccessMessage = accountCreatedSuccessMessage.replace(/[^\w\s!?$]/g,'');
        sanitizedAccountCreatedSuccessMessage = DOMPurify.sanitize(sanitizedAccountCreatedSuccessMessage);
        props.showHideCustomAlert(sanitizedAccountCreatedSuccessMessage, true);
    }
    
    const checkUserNameForLogin = async (authValues, userNameElement, passwordElement) => {
        if(authValues) { authValues.preventDefault(); }
        let username = userNameElement.value || userNameElement;
        let password = passwordElement.value || passwordElement;
        let userID = null;
        let sanitizedUsername = DOMPurify.sanitize(username);
        sanitizedUsername = sanitizedUsername.replace(/[^\w]/g,'');
        //make usernames non-caseSensitive
        sanitizedUsername = sanitizedUsername.toLowerCase();
        let sanitizedPassword = DOMPurify.sanitize(password);
        sanitizedPassword = sanitizedPassword.replace(/[^\w^!?$]/g,'');

        if(sanitizedUsername && throttleLoginFormSpam()) {
            //get userId by sanitizedUsername 
            try {
                userID = await axios.get('userIDByUsername/' + sanitizedUsername + '.json');
                userID = userID.data;
                if(!userID) {
                    props.showHideCustomAlert("Incorrect username or password.", null);
                } else {
                    //now that we know the sanitizedUsername exists and we have the userID for that sanitizedUsername check the password
                    if(sanitizedPassword) { checkPasswordForUserIDAndLogin(sanitizedUsername, userID, sanitizedPassword); }
                }
            } catch(error) {
                return 300;
            }            
        }
    }

    const checkPasswordForUserIDAndLogin = async (checkUsername, checkUserID, checkPassword) => {
       let sanitizedUsername = DOMPurify.sanitize(checkUsername);
       sanitizedUsername = sanitizedUsername.replace(/[^\w]/g,'');
       let sanitizedUserID = DOMPurify.sanitize(checkUserID);
       sanitizedUserID = sanitizedUserID.replace(/[^\w]/g,'');
       let sanitizedPassword = DOMPurify.sanitize(checkPassword);
       sanitizedPassword = sanitizedPassword.replace(/[^\w^!?$]/g,'');
        try {
            let hashedPassword = await axios.get('users/u' + sanitizedUserID + '/password.json');
            hashedPassword = hashedPassword.data;
            if(passwordHash.verify(sanitizedPassword, hashedPassword)) {    
                props.setUserId(sanitizedUserID);
                props.setUsername(sanitizedUsername); 
                setTimeout(() => { props.setAuthentication(true); }, 200);                           
            } else {
                //pwd was wrong so set authenticated to false to make sure it failed. and set username and userID to null
                props.setUserId(null);
                props.setUsername(null);
                props.setAuthentication(false);
                props.showHideCustomAlert("Incorrect username or password.", null);
            }
        } catch {
            props.showHideCustomAlert("Incorrect username or password.", null);
            return 300;
        }  
    }
  
    const ShowLoginFormOrMessenger = () => {
        if(props.authenticated) {
            //messenger has its own <main></main>
           return <Messenger showHideCustomAlert={props.showHideCustomAlert}/>                   
        } else {
            return( <main>
                        <NavigationRouterLinks />
                        <LoginForm checkName={ checkUserNameForLogin } checkForNewUser={ checkIfUserAlreadyExists }/>
                    </main>
            );              
        }
    }
    
    return(
        <Fragment>                                 
                { /* messenger is set by ifAuthenticated(). is either the Messenger component or the login screen*/}
                <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={props.pageAnimationVariants}
                    transition={props.pageTransition}
                >
                    { ShowLoginFormOrMessenger() }
                </motion.div>
        </Fragment>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckIfAuthenticatedSwitch);