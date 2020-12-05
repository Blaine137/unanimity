import React, { Fragment } from 'react';
import styles from './Landing.module.scss';
import Nav from '../Nav/Nav.js';
import { Link } from 'react-router-dom';
import {motion} from 'framer-motion';

const Landing = props => {
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
                    <p className={ styles.subtext }>Unanimity, instant communication that connects you to anyone.</p>          
                    <button type="button" aria-label="Button that takes you to login page for Unanimity instant messenger."className={ styles.chatButton }>
                        <Link aria-label="Link that goes to login page" className={ styles.chatButton } to="/login">Start Chatting</Link>
                    </button>       
                </main>
            </motion.div>
        </Fragment>    
    );
};
    
export default Landing;