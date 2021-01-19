import React from 'react';
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';
import {
  FormControl, InputLabel, TextField, OutlinedInput, Grid, Button,
} from '@material-ui/core';
import NavigationRouterLinks from '../NavigationRouterLinks/NavigationRouterLinks';
import styles from './ContactForm.module.scss';

/*
User form that takes in contact information, notifies the user, and sends the email.
*/
const ContactForm = (props) => {
  const sendEmail = (event) => {
    event.preventDefault();
    // @params - serviceID templateID templateParams userID
    emailjs.sendForm('contact_service', 'UnanimityContactTemplate', event.target, 'user_aaSkiLFIoRQuHKUSx1hvK')
      .then(() => {
        const alertMessage = 'Thank you for contacting Unanimity, your form will be reviewed within 24 hours with emailjs!';
        props.showHideCustomAlert(alertMessage, true);
      }, (error) => {
        // eslint-disable-next-line no-console
        console.log(error.text);
      });
    event.target.reset();
  };

  return (
    <main>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={props.pageAnimationVariants}
        transition={props.pageTransition}
      >
        { props.notification }
        <NavigationRouterLinks />
        <img src="../../../unanimity-large-logo.svg" alt="Unanimity Messenger Logo. Harmony through words." />
        <form className={styles.form} onSubmit={sendEmail}>
          <legend>Let&apos;s get to know each other!</legend>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel htmlFor="Email">Your Email Address</InputLabel>
            <OutlinedInput
              id="Email"
              inputProps={{
                'aria-label': 'Enter you email to be contacted at.', type: 'Email', name: 'Email', required: true,
              }}
              label="Your Email Address"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              aria-label="Enter your comment here for unanimity contact form."
              id="outlined-basic"
              label="How may we Help You?"
              variant="outlined"
              // eslint-disable-next-line react/jsx-no-duplicate-props
              id="Comment"
              name="Comment"
              multiline
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Grid container>
              <Grid item xs={12} md={4} lg={3}>
                <Button
                  type="submit"
                  aria-label="Button that takes you to login page for Unanimity instant messenger."
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </FormControl>
        </form>
      </motion.div>
    </main>
  );
};

export default ContactForm;
