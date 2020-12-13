import React from 'react';
import styles from './ContactForm.module.scss';
import Alert from '../Alert/Alert';
import DOMPurify from 'dompurify';
import { connect } from 'react-redux';
import { setNotification } from '../../redux/actions';
import Nav from '../Nav/Nav.js';
import {motion} from 'framer-motion';
import emailjs from 'emailjs-com';


const mapStateToProps = state => ({ notification: state.messenger.notification });

const mapDispatchToProps = { setNotification };

/*
User form that takes in contact information, validates the email address, then alerts the user how to fix their data or that they will be receiving an email shortly. Their currently is no logic that sends the email.
*/
let ContactForm = props => {

    let closeNotification = () => props.setNotification(null);
    
    function sendEmail(e){
        e.preventDefault();

        emailjs.sendForm('contact_service', 'UnanimityContactTemplate', e.target, 'user_aaSkiLFIoRQuHKUSx1hvK') //@params - serviceID templateID templateParams userID
          .then((result) => {
              console.log(result.text);
              let message = "Thank you for contacting Unanimity, your form will be reviewed within 24 hours with emailjs!";
              props.setNotification([<Alert alertMessage={ message } alertClose={ closeNotification }/>]);
          }, (error) => {
              console.log(error.text);
          });
          e.target.reset();
    }

    return(     
        <main >
            <motion.div
             initial="initial"
             animate="in"
             exit="out"
             variants={props.pageVariants}
             transition={props.pageTransition}>
                { props.notification }
                <Nav />
                <img src="../../../unanimity-large-logo.svg" alt="Unanimity Messenger Logo. Harmony through words."/>                         
                <form className={ styles.form } onSubmit={sendEmail}> 
                    <fieldset>
                        <legend>Let's get to know each other!</legend>                                 
                        <label htmlFor="Email" >Your Email Address</label>
                        <input aria-label="Email Text input" type="Email" id="Email" name="Email" className={ styles.input } required /> 
                        <label htmlFor="Comments">How may we help you?</label>
                        <textarea aria-label="Enter your comment here for unanimity contact form." id="Comment" name="Comment" rows="12" placeholder="Enter your comment here." required></textarea>
                        <input aria-label="Submit contact form to Unanimity" type="submit" value="Submit" className={ styles.submit } /> 
                    </fieldset>                       
                </form> 
            </motion.div>                     
        </main>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactForm);