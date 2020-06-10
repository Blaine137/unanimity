import React, {Fragment} from 'react';
import styles from './ContactForm.module.scss';

const contactForm = () => {

    return(

        <Fragment>
                        <div className = { styles.wrapper }>

                    <img src="../../../unanimity-large-logo.svg" alt="Unanimity Messenger Logo. Harmony through words."/>
                     
                    <form className = { styles.form }  >
                        <fieldset>

                            <legend>Contact Unanimity!</legend>
                            <label htmlFor = "userNameID" >Username</label>
                            <input  type = "text" id = "userNameID" name = "userNameID" className = { styles.input } aria-label ="User Name Text Input" />
                            
                            <label htmlFor = "passwordID" >Password</label>
                            <input aria-label = "Password Text input" type = "password" id = "passwordID" name = "passwordID" className = { styles.input } />

                            <input aria-label = "Submit Login information" type = "submit" value = "Log in" className = { styles.submit } onClick = {  ( e ) => { this.checkName( e , document.getElementById( 'userNameID'  ), document.getElementById( 'passwordID' ) ) }   } />

                            <input aria-label = "Register For Account" type = "submit" value = "Register" className = { styles.register } onClick = { ( e ) => { this.checkForNewUser( e , document.getElementById( 'userNameID'  ), document.getElementById( 'passwordID' ) ) } }  /> 

                        </fieldset>
                        
                    </form>
                    
                </div>
        </Fragment>

    );

};

export default contactForm;