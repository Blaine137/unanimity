import React, { Component, Fragment } from 'react';
import Messenger from '../Messenger/Messenger';
import styles from './Authentication.module.css';
import axios from '../../axios';

class Authentication extends Component {

    state = {

        authenticated: true,
        userID: 2,
        username: "Jacob"
        
    }
/*
TODO: add password hashing!
*/
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

                <Fragment>
                    <p>This Project Database is public so that people can see how the project works! Do not use passwords that you use anywhere else! password currently arent hashed in DB.</p>
                    <p>Username and password are both case sensitive</p>
                     
                    <form className = { styles.form } onSubmit = {  ( e ) => { this.checkName( e ,document.getElementById('userNameID'),   document.getElementById('passwordID')) }   } >
                        <fieldset>
                            <legend>Unanimity Messenger Login</legend>
                            <label for="username" >Username</label>
                            <input type="text" id="userNameID" name="username" className={styles.input} />
                            
                            <label for="password" >Password</label>
                            <input type="text" id="passwordID" name="password" className={styles.input}/>

                            <input type="submit" value="Log in" className={styles.submit} />
                        </fieldset>
                        
                        

                    </form>
                  

                </Fragment>
                
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