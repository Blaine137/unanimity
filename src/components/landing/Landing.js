import React, { Fragment } from 'react';
import styles from './Landing.module.scss';
import Nav from '../Nav/Nav.js';
import { Link } from 'react-router-dom';
import {motion} from 'framer-motion';

const Landing = props => {

    /* ANIMATION STYLES FOR FRAMER MOTION */
		const pageVariants = {
			initial: {
			  opacity: 0,
			  y: "-10vw",
              scale: 0.8
			},
			in: {
			  opacity: 1,
			  y: 0,
			  scale: 1
			},
			out: {
			  opacity: 0,
			  y: "100vw",
			  scale: 1.2
			}
		  };
		  
		  const pageTransition = {
			type: "tween",
			ease: "anticipate",
            duration: 0.5,
            delay: 3.8
		  };

    return (       
        <Fragment>
            <motion.div
             initial="initial"
             animate="in"
             exit="out"
             variants={props.pageVariants}
             transition={props.pageTransition}>
                <Nav />
                <main className={styles.backgroundImage}>
                    <img className={ styles.landinglogo } src="../../unanimity-large-logo.svg" alt="Unanimity Messenger Logo. Harmony through words."/>
                    <h1 className={ styles.header }>The best way to unify with your community!</h1>
                    <motion.p className={ styles.subtext }
                    initial="initial" 
                    animate="in" 
                    variants={pageVariants}
                    transition={pageTransition}>Unanimity, instant communication that connects you to anyone.</motion.p>          
                    <button type="button" aria-label="Button that takes you to login page for Unanimity instant messenger."className={ styles.chatButton }>
                        <Link aria-label="Link that goes to login page" className={ styles.chatButton } to="/login">Start Chatting</Link>
                    </button>       
                </main>
            </motion.div>
        </Fragment>    
    );
};
    
export default Landing;