import React, { Component, Fragment } from 'react';
import Messenger from '../Messenger/Messenger';
import styles from './Authentication.module.css';
import axios from '../../axios';

class Authentication extends Component {

    state = {

        authenticated: true,
        userID: null,
        username: null
        
    }

    tryAuthentication = ( authValues, userNameElement, passwordElement ) => {
        let username = userNameElement.value;
        let password = passwordElement.value;
        let userID = null;
        //prevents page from reloading. forms by default cause pages to reload.
        authValues.preventDefault();

        if( username ) {
            axios.get("userIDByUsername/" + username).then((e) => {
                if(!e.data){
                    alert("incorrect username or password")
                }else{
                    userID = e.data;
                }
            })
        }
    }

    render( ){
        

        let messenger = null;
        if( this.state.authenticated ) {

            messenger = <Messenger authenticated = { this.state.authenticated } userID = { this.state.userID } username = { this.state.username } />;

        } else {

            messenger = (

                <form className = { styles.form } onSubmit = {  ( e ) => { this.tryAuthentication( e ,document.getElementById('userNameID'),   document.getElementById('passwordID')) }   } >
                    <label for="username">Username</label>
                    <input type="text" id="userNameID" name="username" className={styles.input} />
                    
                    <label for="password" >Password</label>
                    <input type="text" id="passwordID" name="password" className={styles.input}/>

                    <input type="submit" value="Log in"/>
                </form>
                
                );
                console.log(this.state.username);
        }
        
        
        
        
        
        return(
            <Fragment>
                {messenger}
            </Fragment>
        );
    }
}

export default Authentication;