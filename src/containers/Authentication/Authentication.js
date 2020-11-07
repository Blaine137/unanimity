import React, { useEffect, Fragment } from 'react';
import Messenger from '../Messenger/Messenger';
import LoginForm from './LoginForm/LoginForm';
import axios from '../../axios';
import DOMPurify from 'dompurify';
import Alert from '../../components/Alert/Alert';
import * as passwordHash from 'password-hash'; //import npm pass https://www.npmjs.com/package/password-hash
import { connect } from 'react-redux';
import { setAuthentication, setUserId, setUsername, setNotification } from '../../redux/actions';
import Nav from '../../components/Nav/Nav';

let messenger = null; //messenger is either unanimity messenger(Messenger component ) or the log in page if not authenticated
 
const mapStateToProps = state => {
    return {
        authenticated: state.authentication.authenticated,
        userId: state.authentication.userId,
        username: state.authentication.username,
        notification: state.messenger.notification,
    };
};

const mapDispatchToProps = {
    setAuthentication: authStatus => setAuthentication(authStatus),
    setUserId: userId => setUserId(userId),
    setUsername: username => setUsername(username),
    setNotification: notification => setNotification(notification)
};

let Authentication = props => {
    useEffect(() => {
        props.setAuthentication(false);
        props.setUserId(null);
        props.setUsername(null);
    }, []);

    const checkForNewUser = async (event, newUser, newPassword) => {    
        event.preventDefault();
        let newUserValue = newUser.value;
        let newPasswordValue = newPassword.value;
        let newUserID = null;
        newUserValue = DOMPurify.sanitize(newUserValue);
        newUserValue = newUserValue.replace(/[^\w]/g,'');
        newUserValue = newUserValue.toLowerCase();
        newPasswordValue = DOMPurify.sanitize(newPasswordValue);
        newPasswordValue = newPasswordValue.replace(/[^\w^!?$]/g,'');
        newUserID = DOMPurify.sanitize(newUserID);
        newUserID = newUserID.replace(/[^\w]/g,'');
        
        //username a valid length
        if(newUserValue.length > 10 || newPasswordValue.length > 20) {
            props.setNotification([<Alert alertMessage="Username must be less than 10 characters and password must be less than 20." alertClose={ closeNotification }/>]);
         } else if(!newUserValue || !newPasswordValue || newUserValue < 5 || newPasswordValue < 5) {
            props.setNotification([<Alert alertMessage="Username and password must be 5 characters long and only contain alphabetical and numerical values." alertClose={ closeNotification }/>])
         } else {
            let getUserId = async () => {
                try {
                    let resID = await axios.get('userIDByUsername/nextUserID.json');
                    newUserID = resID.data;
                    //try to get the username they are wanting to register as
                    let resName = await axios.get('userIDByUsername/' + newUserValue + '.json');
                    if(!resName.data) {
                        //create user if the username is not taken
                        setNewUser(newUserValue, newPasswordValue, newUserID); 
                    } else {
                        props.setNotification([<Alert alertMessage="Username is already taken!" alertClose={ closeNotification }/>]);
                    }
                } catch(error) {
                    return 300;
                }
            }
            getUserId();
        }
    }

    //sets users in db
    const setNewUser = async (newUser, newPassword, newUserID) => {
        newUser = DOMPurify.sanitize(newUser);
        newUser = newUser.replace(/[^\w]/g,'');
        newPassword = DOMPurify.sanitize(newPassword);
        newPassword = newPassword.replace(/[^\w^!?$]/g,'');
        newUserID = DOMPurify.sanitize( newUserID ); 
        newUserID = newUserID.replace(/[^\w!?$]/g,'');      
        let newCompleteUser = {
            password: passwordHash.generate(newPassword),
            userID: newUserID,
            userName: newUser
        };
        //sets new users in users
        axios.put('users/u' + newUserID + '.json' , newCompleteUser);  

        //-----adds user to userIDByUsername-----

        let userIDByUsername = {};
        //set property of object name to newUser and then set the value of the property to newUserID
        userIDByUsername[newUser] = newUserID;
        //axios get old usernames and ID
        try {
            let oldUserIDByUsername = await axios.get('userIDByUsername.json');
            oldUserIDByUsername = oldUserIDByUsername.data
            let combinedUserIDByUsername = { ...oldUserIDByUsername, ...userIDByUsername };
            let updatedNextUserID = parseInt(newUserID);
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
                userID: newUserID
            }
            axios.put('usersChatRooms/ucr' + newUserID + '.json', newUCR);

        //-----end of add to usersChatRooms in DB-----

        //inform user that account was created
        let accountMessage = DOMPurify.sanitize("Your account has been created! Username: '" + newUser + "'");
        accountMessage = accountMessage.replace(/[^\w\s!?$]/g,'');
        props.setNotification([<Alert alertMessage={ accountMessage } alertClose={ closeNotification }/>]);
    }
    
    const checkName = async (authValues, userNameElement, passwordElement) => {
        let username = userNameElement.value || userNameElement;
        let password = passwordElement.value || passwordElement;
        let userID = null;
        username = DOMPurify.sanitize(username);
        username = username.replace(/[^\w]/g,'');
        password = DOMPurify.sanitize(password);
        password = password.replace(/[^\w^!?$]/g,'');

        if(authValues) { authValues.preventDefault(); }
        if(username) {
            //make usernames non-caseSensitive
            username = username.toLowerCase();
            //get userId by username 
            try {
                userID = await axios.get('userIDByUsername/' + username + '.json');
                userID = userID.data;
                if(!userID) {
                    props.setNotification([<Alert alertMessage="Incorrect username or password." alertClose={ closeNotification }/>]);
                } else {
                    //now that we know the username is exist and we have the userID for that username check the password
                    if(password) { checkPwdForUserID(username, userID, password); }
                }
            } catch(error) {
                return 300;
            }            
        }
    }

    const checkPwdForUserID = async (checkUsername, checkUserID, checkPassword) => {
       checkUsername = DOMPurify.sanitize(checkUsername);
       checkUsername = checkUsername.replace(/[^\w]/g,'');
       checkUserID = DOMPurify.sanitize(checkUserID);
       checkUserID = checkUserID.replace(/[^\w]/g,'');
       checkPassword = DOMPurify.sanitize(checkPassword);
       checkPassword = checkPassword.replace(/[^\w^!?$]/g,'');
        try {
            let hashedPassword = await axios.get('users/u' + checkUserID + '/password.json');
            if(passwordHash.verify(checkPassword, hashedPassword)) {    
                props.setUserId(checkUserID);
                props.setUsername(checkUsername); 
                setTimeout(() => { props.setAuthentication(true); } ,200)                           
            } else {
                //pwd was wrong so set authenticated to false to make sure it failed. and set username and userID to null
                props.setUserId(null);
                props.setUsername(null);
                props.setAuthentication(false);
                props.setNotification([<Alert alertMessage="Incorrect username or password." alertClose={ closeNotification }/>]);
            }
        } catch {
            return 300;
        }  
    }

    const closeNotification = () => props.setNotification(null);
    
    const ifAuthenticated = () => {
        if(props.authenticated) {
            messenger =  <Messenger/>;
        } else {
            messenger = <main><Nav/><LoginForm checkName={ checkName } checkForNewUser={ checkForNewUser}/></main>;              
        }
    }
    ifAuthenticated();
    
    return(
        <Fragment>                                 
            { props.notification }
            { /* messenger is set by ifAuthenticated(). is either the Messenger component or the login screen*/}
            { messenger }
        </Fragment>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);