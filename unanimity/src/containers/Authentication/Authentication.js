import React, { Component, Fragment } from 'react';
import Messenger from '../Messenger/Messenger';
import LoginForm from './LoginForm/LoginForm';
import axios from '../../axios';
import DOMPurify from 'dompurify';
import Alert from '../../components/Alert/Alert';
//import npm pass https://www.npmjs.com/package/password-hash
import * as passwordHash from 'password-hash';
import { connect } from 'react-redux';
import { setAuthentication, setUserId, setUsername } from '../../redux/actions';

//messenger is either unanimity messenger(Messenger component ) or the log in page if not authenticated
let messenger = null;

const mapStateToProps = state => {
    return {
        authenticated: state.authentication.authenticated,
        userId: state.authentication.userId,
        username: state.authentication.username,
    };
};

const mapDispatchToProps = {
    setAuthentication: (authStatus) => (setAuthentication(authStatus)),
    setUserId: (userId) => (setUserId(userId)),
    setUsername: (username) => (setUsername(username)),
};

class Authentication extends Component {
    state = { notification: null }
    
    componentDidMount() {
        this.props.setAuthentication(false);
        this.props.setUserId(null);
        this.props.setUsername(null);
    }

    checkForNewUser = (event, newUser, newPassword) => {     
        let newUserValue = newUser.value;
        let newPasswordValue = newPassword.value;
        let newUserID = null;

        newUserValue = DOMPurify.sanitize( newUserValue );
        newUserValue = newUserValue.replace(/[^\w]/g,'');
        newUserValue = newUserValue.toLowerCase();

        newPasswordValue = DOMPurify.sanitize( newPasswordValue );
        newPasswordValue = newPasswordValue.replace(/[^\w^!?$]/g,'');

        newUserID = DOMPurify.sanitize( newUserID );
        newUserID = newUserID.replace(/[^\w]/g,'');

        //prevent reload of page due to form submission
        event.preventDefault();
        //a valid length
        if(newUserValue.length > 10 || newPasswordValue.length > 20) {
            this.setState({ notification: <Alert alertMessage = "Username must be less than 10 characters and password must be less than 20." alertClose = { this.closeNotification } /> });
         }//if valid length
         //if newUser and newPassword not null
         else if(!newUserValue || !newPasswordValue || newUserValue < 5 || newPasswordValue < 5 ) {
            this.setState( { notification: <Alert alertMessage = "Username and password must be 5 characters long and only contain alphabetical and numerical values." alertClose = { this.closeNotification } /> } );
         } else {
            //getnextuserID
            axios.get('userIDByUsername/nextUserID.json').then((e) => {
                newUserID = e.data
                //not null
                if(newUserID) {
                    //try to get the username they are wanting to register as
                    axios.get('userIDByUsername/' + newUserValue + '.json').then((e) => {
                        if(!e.data) {
                            this.setNewUser(newUserValue, newPasswordValue, newUserID); 
                        } else {
                            this.setState({ notification: <Alert alertMessage = "Username is already taken!" alertClose = { this.closeNotification } /> });
                        }
                    }).catch((error) => {               
                        return 300;
                    });//axios get username they are wanting to register as
                }
            });
         }
    }

    //sets users in db
    setNewUser = (newUser, newPassword, newUserID) => {
        newUser = DOMPurify.sanitize(newUser);
        newUser = newUser.replace(/[^\w]/g,'');

        newPassword = DOMPurify.sanitize(newPassword);
        newPassword = newPassword.replace(/[^\w^!?$]/g,'');

        newUserID = DOMPurify.sanitize( newUserID ); 
        newUserID = newUserID.replace(/[^\w!?$]/g,'');      
        //add user to Users in db
            let newCompleteUser = {
                    //passwordHash is a npm install. gernerate by default has 8 salts and strong one way encryption.
                    password: passwordHash.generate(newPassword),
                    userID: newUserID,
                    userName: newUser
            };
            //sets new users in users
            axios.put('users/u' + newUserID + '.json' , newCompleteUser);   
        //end of add user to Users in db
        // adds user to userIDByUsername
            //create object
            let userIDByUsername = {};
            //set property of object name to newUser and then set the value of the property to newUserID
            userIDByUsername[newUser] = newUserID;
            //axios get old usernames and ID
            axios.get('userIDByUsername.json').then(
                (e) => {
                    //set old data(not including new user)
                    let oldUserIDByUsername = e.data;
                    //combine new user and old users
                    let combinedUserIDByUsername = { ...oldUserIDByUsername, ...userIDByUsername };
                    //convert string of int to actually integer so incrementing works
                    let updatedNextUserID = parseInt(newUserID);
                    updatedNextUserID++;
                    //sets nextUserId to correct ID
                    combinedUserIDByUsername.nextUserID = updatedNextUserID;
                    //update db to latest version
                    axios.put('userIDByUsername.json',  combinedUserIDByUsername);
                }
            );//axios get old usernames and iD
        // end of adds user to userIDByUsername
        //start add to usersChatRooms in DB
                //ucr stands for UserChatRoom
                let newUCR = {
                    chatRooms: [],
                    userID: newUserID
                }
                axios.put('usersChatRooms/ucr' + newUserID + '.json', newUCR);
        //end of add to usersChatRooms in DB
        //inform user that account was created
        let accountMessage = DOMPurify.sanitize("Your account has been created! Username: '" + newUser + "'");
        accountMessage = accountMessage.replace(/[^\w\s!?$]/g,'');
        this.setState({ notification: <Alert alertMessage = { accountMessage } alertClose = { this.closeNotification } /> });
    }
    
    checkName = (authValues, userNameElement, passwordElement) => {
        let username = userNameElement.value || userNameElement;
        let password = passwordElement.value || passwordElement;
        let userID = null;
    
        username = DOMPurify.sanitize(username);
        username = username.replace(/[^\w]/g,'');

        password = DOMPurify.sanitize(password);
        password = password.replace(/[^\w^!?$]/g,'');

        userID = DOMPurify.sanitize(userID);
        userID = userID.replace(/[^\w^!?$]/g,'');

        //prevents page from reloading. forms by default cause pages to reload.
        if(authValues) {
            authValues.preventDefault();
        }
        //if username was provided
        if(username) {
            //make usernames non-caseSensitive
            username = username.toLowerCase();
            //get userId by username 
            axios.get('userIDByUsername/' + username + '.json').then((e) => {
                //if username was not found
                if(!e.data) {
                    this.setState( { notification: <Alert alertMessage = "Incorrect username or password." alertClose = { this.closeNotification } /> });
                } else {
                    //set the userID if the username was found
                    userID = e.data;
                    //now that we know the username is exist and we have the userID for that username check the password
                    //if we have a password
                    if(password) {
                        this.checkPwdForUserID(username, userID, password);
                    }
                }
            })//axios get userID by Username 
        }//if username was provided
    }

    checkPwdForUserID = (checkUsername, checkUserID, checkPassword) => {
       checkUsername = DOMPurify.sanitize(checkUsername);
       checkUsername = checkUsername.replace(/[^\w]/g,'');

       checkUserID = DOMPurify.sanitize(checkUserID);
       checkUserID = checkUserID.replace(/[^\w]/g,'');

       checkPassword = DOMPurify.sanitize(checkPassword);
       checkPassword = checkPassword.replace(/[^\w^!?$]/g,'');

        //axios get password for a given user
        axios.get('users/u' + checkUserID + '/password.json').then(
            (e) => {
                //if pwd is correct
                // e.data is the 
                if (passwordHash.verify(checkPassword, e.data)) {
                    this.props.setAuthentication(true);
                    this.props.setUserId(checkUserID);
                    //set username user id and authentication in state   
                    this.props.setUsername(checkUsername)              
                }
                //pwd was incorrect
                else {
                    //pwd was wrong so set authenticed to false to make sure it failed. and set username and userID to null
                    this.props.setUserId(null);
                    this.props.setUsername(null);
                    this.props.setAuthentication(false);
                    //tell the user that credientals were incorrect
                    this.setState({ notification: <Alert alertMessage = "Incorrect username or password." alertClose = { this.closeNotification } /> });
                }
            }
        )
    }

    logout = () => {
        this.props.setAuthentication(false);
        this.props.setUserId(null);
    }

    closeNotification = () => {
        this.setState({ notification: null });
    }

    ifAuthenticated = () => {
        //if authenticated go to messenger
        if(this.props.authenticated) {
            messenger = <Messenger authenticated = { this.props.authenticated } userID = { this.props.userId} username = { this.props.username } authLogout = { this.logout }/>;
        } 
        //else not authenticated stay on login page to login in
        else {
            messenger = <LoginForm checkName = { this.checkName } checkForNewUser = { this.checkForNewUser }/>              
        }
    }

    render() {
        this.ifAuthenticated();
        return(
            <Fragment>
                { this.state.notification }
                { /* messenger is set by ifAuthenticated(). is either the Messenger component or the login screen*/}
                { messenger }
            </Fragment>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);