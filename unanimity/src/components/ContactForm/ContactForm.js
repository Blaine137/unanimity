import React, { Component, Fragment } from 'react';
import styles from './ContactForm.module.scss';

class ContactForm extends Component {

    render( ) {

            return(

                <Fragment>

                    <div className = { styles.wrapper }>

                        <img src="../../../unanimity-large-logo.svg" alt="Unanimity Messenger Logo. Harmony through words."/>
                            
                        <form className = { styles.form } action="/" > { /* removed the name from the email input to get rid of querystring since post method would not work. */ }

                            <fieldset>

                                <legend>Contact Unanimity!</legend>
                                    
                                <label htmlFor = "Email" >Email</label>
                                <input aria-label = "Email Text input" type = "Email" id = "Email"  className = { styles.input } /> 

                                <label htmlFor = "Comments">Comments</label>
                                <textarea aria-label = "Enter your comments here." id = "Comments" rows="4" cols="40" placeholder = "Enter your comment here..."></textarea>

                                <input aria-label = "Submit contact form button" type = "submit" value = "Submit" className = { styles.submit } onClick={ ( ) => {
                                        
                                        alert('Thank you for contacting Unanimity, your form will be reviewed within 24 hours!');

                                } } /> 

                            </fieldset>
                                
                        </form>
                            
                    </div>

                </Fragment>

            );//return

    };//render

}; //end of class

export default ContactForm;