import React from 'react';
import styles from './ContactForm.module.scss';
import Alert from '../Alert/Alert';
import Nav from '../Nav/Nav.js';
import {motion} from 'framer-motion';
import emailjs from 'emailjs-com';



/*
User form that takes in contact information, validates the email address, then alerts the user how to fix their data or a email will be sent to Blaine's email
*/
let ContactForm = props => {
    
        //a function that takes the event as a parameter. sendEmail first prevents the page from reloading, then sends a email to Blaine's email. Next the event resets the form.
    function sendEmail(e){
        e.preventDefault();

        emailjs.sendForm('contact_service', 'UnanimityContactTemplate', e.target, 'user_aaSkiLFIoRQuHKUSx1hvK') //@params - serviceID templateID templateParams userID
          .then((result) => {
              console.log(result.text);
              let message = "Thank you for contacting Unanimity, your form will be reviewed within 24 hours with emailjs!";
              props.handleNotification(message, true);
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

export default ContactForm;