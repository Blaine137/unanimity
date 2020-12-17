import React from 'react';
import styles from './ContactForm.module.scss';
import NavigationRouterLinks from '../NavigationRouterLinks/NavigationRouterLinks.js';
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';

/*
User form that takes in contact information, notifies the user, and sends the email.
*/
let ContactForm = props => {
    function sendEmail(e) {

        e.preventDefault();
        //@params - serviceID templateID templateParams userID
        emailjs.sendForm('contact_service', 'UnanimityContactTemplate', e.target, 'user_aaSkiLFIoRQuHKUSx1hvK')
        .then((result) => {
            //console.log(result.text);
            let alertMessage = "Thank you for contacting Unanimity, your form will be reviewed within 24 hours with emailjs!";
            props.showHideCustomAlert(alertMessage, true);
        }, (error) => {
            console.log(error.text);
        });
        e.target.reset();
    }

    return(     
        <main>
            <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={ props.pageAnimationVariants }
                transition={ props.pageTransition }
            >
                { props.notification }
                <NavigationRouterLinks />
                <img src="../../../unanimity-large-logo.svg" alt="Unanimity Messenger Logo. Harmony through words."/>                         
                <form className={ styles.form } onSubmit={ sendEmail }> 
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