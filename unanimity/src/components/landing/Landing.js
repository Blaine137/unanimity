import React, { Fragment } from 'react';
import styles from './Landing.module.scss';

function Landing( props ) {


    return (
        
        <Fragment>

            <main style = { { backgroundImage: "url('../../../backgroundlarge.png')" } } >

                <img className = { styles.landinglogo } src = "../../../unanimity-large-logo.svg" alt = " Unanimity Messenger Logo. Harmony through words. " />

                    <h1 className = {styles.header}>The best way to unify with your community!</h1>

                    <p className = { styles.subtext }>Unanimity, instant communication that connects you with your awesome community.</p>
              

                    <button onClick = { () => { props.goToAuth(); } } type = " button " className = {styles.chatButton}>Start Chatting</button>
               
            </main>

        </Fragment>
        
    );


    }
    
    export default Landing;