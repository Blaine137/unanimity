import React, { Component, Fragment } from 'react';
import Messenger from '../Messenger/Messenger';
import styles from './Authentication.module.css';
import axios from '../../axios';

class Authentication extends Component {

    state = {
        
        authenticated: false,
        userID: 1,
        username: "Blaine"
        
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
                if( newUser.length > 15 || newPassword.length > 20 ){

                    alert('username must be less than 15 characters and password must be less that 20.');

                }//if valid length

                //try to get the username they are wanting to register as
                axios.get( 'userIDByUsername/' + newUser + '.json' ).catch( ( error ) => {

                    this.setNewUser( newUserValue, newPasswordValue, newUserID ); 
                    
                    return 300;

                } );//axios get username they are wanting to register as

            }//if newUser and newPassword not null
        } );

       
 

    }

    setNewUser = ( newUser, newPassword, newUserID ) => {
        
        let newCompleteUser = {

            
                password: newPassword,
                userID: newUserID,
                userName: newUser
            

        };
        //get all the data for the users tabel
        //add new complete user to that data
        //the axios put that combinded data
        
        axios.put( 'users/u' + newUserID + '.json' , newCompleteUser );   

        //convert string of int to actually integer so incrementing works
        let updatedNextUserID = parseInt(newUserID);
        updatedNextUserID++;
        //update the nextUserID
        axios.put( 'userIDByUsername/nextUserID.json', updatedNextUserID );
    }
    
    checkName = ( authValues, userNameElement, passwordElement ) => {
       
        let username = userNameElement.value;
        let password = passwordElement.value;
        let userID = null;

        //prevents page from reloading. forms by default cause pages to reload.
        authValues.preventDefault();
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
                if ( e.data === checkPassword ) {

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
                    <p>This Project Database is public so that people can see how the project works! Do not use passwords that you use anywhere else! password currently arent hashed in DB.</p>
                    <p>Username and password are both case sensitive</p>
                     
                    <form className = { styles.form }  >
                        <fieldset>
                            <legend>Unanimity Messenger Login</legend>
                            <label htmlFor="username" >Username</label>
                            <input type="text" id="userNameID" name="username" className={styles.input} />
                            
                            <label htmlFor="password" >Password</label>
                            <input type="password" id="passwordID" name="password" className={styles.input}/>

                            <input type="submit" value="Register" className={styles.register} onClick = { ( e ) => {this.checkForNewUser(e, document.getElementById("userNameID"), document.getElementById("passwordID"))}}/>
                            <input type="submit" value="Log in" className={styles.submit} onClick = {  ( e ) => { this.checkName( e ,document.getElementById('userNameID'),   document.getElementById('passwordID')) }   }/>
                        </fieldset>
                        
                        

                    </form>
                  

                </div>
                
            );//varible messenger
               
        }//if state authenticated
        
               
        return(

            <Fragment>

                { messenger }

            </Fragment>

        );
    }
}

export default Authentication;