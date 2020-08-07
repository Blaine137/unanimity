import React, { Fragment } from 'react';
import styles from './LoginForm.module.scss';

const  LoginForm = ( props ) => {

    return (

        <Fragment>

            <div className = { styles.wrapper }>

            <img src="../../../unanimity-large-logo.svg" alt="Unanimity Messenger Logo. Harmony through words."/>
            
            <form className = { styles.form }  >

                <fieldset>

                    <legend>Unanimity Messenger Login</legend>
                    <label htmlFor = "userNameID" >Username</label>
                    <input  type = "text" id = "userNameID" name = "userNameID" className = { styles.input } aria-label ="User Name Text Input field" required />
                    
                    <label htmlFor = "passwordID" >Password</label>
                    <input aria-label = "Password Text input field" type = "password" id = "passwordID" name = "passwordID" className = { styles.input } required />

                    <input aria-label = "Submit Login information button" type = "submit" value = "Log in" className = { styles.submit } onClick = {  ( e ) => { props.checkName( e , document.getElementById( 'userNameID'  ), document.getElementById( 'passwordID' ) ) }   } />

                    <input aria-label = "Register For Account button" type = "submit" value = "Register" className = { styles.register } onClick = { ( e ) => { props.checkForNewUser( e , document.getElementById( 'userNameID'  ), document.getElementById( 'passwordID' ) ) } }  /> 

                </fieldset>
                
            </form>

            <p>This Project's Database is public so that people can see how the project works!</p>

            </div>

        </Fragment>
        
    );

}

export default LoginForm;