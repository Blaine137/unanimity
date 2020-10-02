import React from 'react';
import styles from './ContactForm.module.scss';
import Alert from '../Alert/Alert';
import DOMPurify from 'dompurify';
import { connect } from 'react-redux';
import { setNotification } from '../../redux/actions';
import Nav from '../Nav/Nav.js';

const mapStateToProps = state => ({ notification: state.messenger.notification });

const mapDispatchToProps={ setNotification: notification => setNotification(notification) };

let ContactForm = props => {
    let closeNotification = () => props.setNotification(null);      
    return(     
        <main >
            <Nav />
            { props.notification }
            <img src="../../../unanimity-large-logo.svg" alt="Unanimity Messenger Logo. Harmony through words."/>                         
            <form className={ styles.form } action="/"> 
                <fieldset>
                    <legend>Let's get to know each other!</legend>                                 
                    <label htmlFor="Email" >Your Email Address</label>
                    <input aria-label="Email Text input" type="Email" id="Email" name="Email" className={ styles.input } required/> 
                    <label htmlFor="Comments">How may we help you?</label>
                    <textarea aria-label="Enter your comment here." id="Comment" name="Comment" rows="12" placeholder="Enter your comment here." required></textarea>
                    <input aria-label="Submit contact form button" type="submit" value="Submit" className={ styles.submit } onClick={ e => {
                            // sanitize and check for vailid email format. then alert the user with appropriate info
                            e.preventDefault();
                            let email = document.getElementById('Email').value;
                            let comment = document.getElementById('Comment').value;
                            email = DOMPurify.sanitize(email) ;
                            comment = DOMPurify.sanitize(comment);
                            //only allow words numbers ! ? $ @ .                             
                            email = email.replace(/[^\w^0-9^!?$@.]/g, '');
                            comment = comment.replace(/[^\w^0-9^!?$@.]/g, '');
                            //validate email format
                            if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) && email && comment) {
                                let message = "Thank you for contacting Unanimity, your form will be reviewed within 24 hours!";
                                props.setNotification([<Alert alertMessage={ message } alertClose={ closeNotification }/>]);
                            } else {
                                props.setNotification([<Alert alertMessage="Please enter a valid email address and comment" alertClose={ closeNotification }/>]);
                            }                                       
                    } }/> 
                </fieldset>                       
            </form>                      
        </main>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactForm);