import React, { Component, Fragment } from 'react';
import Messenger from '../Messenger/Messenger';
import styles from './Authentication.module.scss';
import axios from '../../axios';
//import npm pass https://www.npmjs.com/package/password-hash
import * as passwordHash from 'password-hash';

class Authentication extends Component {

    state = {
        
        //this sets the default authentication to false.
        authenticated:  false, 
        userID: 2,
        username: "Jacob"
        
    }
    
/*
TODO: add password hashing!
*/  checkForNewUser = ( event, newUser, newPassword ) => {
       
        
        let newUserValue = newUser.value;
        let newPasswordValue = newPassword.value;
        let newUserID = null;

        //prevent reload of page due to form submission
        event.preventDefault( );

        //getnextuserID
        axios.get( 'userIDByUsername/nextUserID.json' ).then( ( e ) => {
            newUserID = e.data
            //not null
            if( newUserValue && newPasswordValue ){

                //a valid length
                if( newUserValue.length > 15 || newPasswordValue.length > 20 ){

                    alert( 'username must be less than 15 characters and password must be less that 20.' );

                }//if valid length
                //try to get the username they are wanting to register as
                axios.get( 'userIDByUsername/' + newUserValue + '.json' ).then( ( e ) => {
                    
                    if(  !e.data ) {

                        this.setNewUser( newUserValue, newPasswordValue, newUserID ); 

                    } else {

                        alert( 'Username is already taken!' );

                    }

                } ).catch( ( error ) => {

                    
                    
                    return 300;

                } );//axios get username they are wanting to register as

            }//if newUser and newPassword not null
        } );

    }

    //sets users in db
    setNewUser = ( newUser, newPassword, newUserID ) => {
               
        //add user to Users in db
        
            let newCompleteUser = {

                    //passwordHash is a npm install. gernerate by default has 8 salts and strong one way encryption.
                    password: passwordHash.generate(newPassword),
                    userID: newUserID,
                    userName: newUser
        
            };
    
            //sets new users in users
            axios.put( 'users/u' + newUserID + '.json' , newCompleteUser );   

        //end of add user to Users in db

        // adds user to userIDByUsername

            //create object
            let userIDByUsername = { };
            //set property of object name to newUser and then set the value of the property to newUserID
            userIDByUsername[ newUser ] = newUserID;

            //axios get old usernames and ID
            axios.get( 'userIDByUsername.json' ).then(
                ( e ) => {

                    //set old data(not including new user)
                    let oldUserIDByUsername = e.data;
                    //combine new user and old users
                    let combinedUserIDByUsername = { ...oldUserIDByUsername, ...userIDByUsername };
                    //convert string of int to actually integer so incrementing works
                    let updatedNextUserID = parseInt( newUserID );
                    updatedNextUserID++;
                    //sets nextUserId to correct ID
                    combinedUserIDByUsername.nextUserID = updatedNextUserID;

                    //update db to latest version
                    axios.put( 'userIDByUsername.json',  combinedUserIDByUsername);

                }
            );//axios get old usernames and iD

        // end of adds user to userIDByUsername

        //start add to usersChatRooms in DB
                
                //ucr stands for UserChatRoom
                let newUCR = {

                    chatRooms: [  ],
                    userID: newUserID

                }
                axios.put( 'usersChatRooms/ucr' + newUserID + '.json', newUCR );

        //end of add to usersChatRooms in DB
        
        //inform user that account was created
        alert( "Your account has been created!" );
        
    }
    
    checkName = ( authValues, userNameElement, passwordElement ) => {
       
        let username = userNameElement.value || userNameElement;
        let password = passwordElement.value || passwordElement;
        let userID = null;

        //prevents page from reloading. forms by default cause pages to reload.
        if(authValues){
            authValues.preventDefault();
        }
        //if username was provided
        if( username ) {

            //get userId by username 
            axios.get( 'userIDByUsername/' + username + '.json' ).then( ( e ) => {

                //if username was not found
                if( !e.data ) {

                    //dont tell them that the username wasent found for security reason say one was wrong
                    alert( "incorrect username or password" );

                } else {

                    //set the userID if the username was found
                    userID = e.data;

                    //now that we know the username is exist and we have the userID for that username check the password
                    //if we have a password
                    if( password ) {

                        this.checkPwdForUserID( username, userID, password );

                    }
                }

            })//axios get userID by Username 

        }//if username was provided

    }
    checkPwdForUserID = ( checkUsername, checkUserID, checkPassword ) => {
        
        //axios get password for a given user
        axios.get( 'users/u' + checkUserID + '/password.json' ).then(
            ( e ) => {

                //if pwd is correct
                // e.data is the 
                if ( passwordHash.verify( checkPassword, e.data) ) {

                    //set username userid and authentication in state
                    this.setState( { authenticated: true, userID: checkUserID, username: checkUsername } );
                    
                }
                //pwd was incorect
                else {

                    //pwd was wrong so set authenticed to false to make sure it failed. and set username and userID to null
                    this.setState( { authenticated: false, userID: null, username: null } );
                    //tell the user that credientals were incorrect
                    alert( "incorrect username or password" );

                }//if pwd was correct

            }//.then axios get password for user

        )//axios get password for user

    }

    render( ) {
        
        let messenger = null;
        //if authenticed go to messenger
        if( this.state.authenticated ) {

            messenger = <Messenger authenticated = { this.state.authenticated } userID = { this.state.userID } username = { this.state.username } />;

        } 
        //else not authenticaed stay on login page to login in
        else {

            messenger = (

                <div className = { styles.wrapper }>
                    <p>This Project Database is public so that people can see how the project works!</p>
                    <p>Username and password are both case sensitive.</p>
                     
                    <form className = { styles.form }  >
                        <fieldset>
                            <legend>Unanimity Messenger Login</legend>
                            <label htmlFor = "username" >Username</label>
                            <input type = "text" id = "userNameID" name = "username" className = { styles.input } />
                            
                            <label htmlFor = "password" >Password</label>
                            <input type = "password" id = "passwordID" name = "password" className = { styles.input } />

                            <input type = "submit" value = "Log in" className = { styles.submit } onClick = {  ( e ) => { this.checkName( e , document.getElementById( 'userNameID'  ),   document.getElementById( 'passwordID' ) ) }   } />
                            <input type = "submit" value = "Register" className = { styles.register } onClick = { ( e ) => { this.checkForNewUser( e , document.getElementById( "userNameID" ), document.getElementById( "passwordID" ) ) } } /> 
                        </fieldset>
                        
                    </form>
                
                </div>
                
            );//varible messenger
               
        }//if state authenticated
                 
        return(

            <Fragment>

                { messenger }

            </Fragment>

        );//return()
    }//render()
}

export default Authentication;