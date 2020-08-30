import React, { Component, Fragment } from 'react';
import styles from './ContactForm.module.scss';
import Alert from '../Alert/Alert';
import DOMPurify from 'dompurify';

class ContactForm extends Component {

    state = {

        notification: null

    };

    closeNotification = ( ) => {
       
        this.setState( { notification: null } );
        
    }

    render( ) {

            return(

                <Fragment>

                    { this.state.notification }

                    <div className = { styles.wrapper }>

                        <img src="../../../unanimity-large-logo.svg" alt="Unanimity Messenger Logo. Harmony through words."/>
                            
                        <form className = { styles.form } action="/" > { /* removed the name from the email input to get rid of querystring since post method would not work. */ }

                            <fieldset>

                                <legend>Contact Unanimity!</legend>
                                    
                                <label htmlFor = "Email" >Email</label>
                                <input aria-label = "Email Text input" type = "Email" id = "Email"  className = { styles.input } required /> 

                                <label htmlFor = "Comments">Comments</label>
                                <textarea aria-label = "Enter your comments here." id = "Comment" rows="4" cols="40" placeholder = "Enter your comment here..." required ></textarea>

                                <input aria-label = "Submit contact form button" type = "submit" value = "Submit" className = { styles.submit } onClick={ ( e ) => {

                                        //stop page form reloading on click
                                        e.preventDefault();

                                        let email = document.getElementById('Email').value;
                                        let comment = document.getElementById('Comment').value;

                                        //sanitize data
                                        email = DOMPurify.sanitize( email ) ;
                                        comment = DOMPurify.sanitize( comment );

                                        //only allow words numbers ! ? $ @ .                                 
                                        email = email.replace(/[^\w^0-9^!?$@.]/g, '');
                                        comment = comment.replace(/[^\w^0-9^!?$@.]/g, '');

                                        //validate email format
                                        if( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) && email && comment ) {

                                            let message = "Thank you for contacting Unanimity, your form will be reviewed within 24 hours!";
                                            this.setState( { notification: <Alert alertMessage = { message } alertClose = { this.closeNotification } /> }) 

                                        } else {

                                            //email input was blank or formatted wrong or comment was empty
                                            this.setState( { notification: <Alert alertMessage = "Please enter a valid email address and comment" alertClose = { this.closeNotification } /> } )

                                        }
                                        
                                      
                                } } /> 

                            </fieldset>
                                
                        </form>
                            
                    </div>

                </Fragment>

            );//return

    };//render

}; //end of class

export default ContactForm;