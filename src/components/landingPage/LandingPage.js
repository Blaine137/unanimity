import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Typography } from '@material-ui/core';
import NavigationRouterLinks from '../NavigationRouterLinks/NavigationRouterLinks';
import styles from './LandingPage.module.scss';

/*
User interface component that displays an animated landing page and shows the navigation component.
*/
const LandingPage = (props) => (
  <>
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={props.pageAnimationVariants}
      transition={props.pageTransition}
    >
      <NavigationRouterLinks />
      <div className={styles.backgroundImage}>
        <img className={styles.landingLogo} src="../../unanimity-large-logo.svg" alt="Unanimity Messenger Logo. Harmony through words." />
        <Typography variant="h1">
          The best way to unify with your community!
        </Typography>
        <Typography variant="subtitle1">
          Unanimity, instant communication that connects you to anyone.
        </Typography>
        <Button
          type="button"
          aria-label="Button that takes you to login page for Unanimity instant messenger."
          variant="contained"
          color="primary"
          size="large"
        >
          <Link style={{ color: 'var(--main-bg)', textDecoration: 'none' }} aria-label="Link that goes to login page" to="/login">Start Chatting</Link>
        </Button>
      </div>
    </motion.div>
  </>
);

export default LandingPage;
