import React, { Fragment } from 'react';
import styles from './Landing.module.scss';
import Nav from '../Nav/Nav.js';

const Landing = ( props ) => {
    return (       
        <Fragment>
            <Nav goToAuth={ props.goToAuth } goToContact = { props.goToContact } />
            <main>
                <img className = { styles.landinglogo } src = "../../../unanimity-large-logo.svg" alt = " Unanimity Messenger Logo. Harmony through words. " />
                    <h1 className = {styles.header}>The best way to unify with your community!</h1>
                    <p className = { styles.subtext }>Unanimity, instant communication that connects you to anyone.</p>          
                    <button onClick = { () => { props.goToAuth() } } type = " button " className = {styles.chatButton}>Start Chatting</button>           
            </main>
        </Fragment>    
    );
};
    
export default Landing;